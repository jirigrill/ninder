import scrapy

from scrapy_baybenames.itemloaders import ScrapyBaybenamesItemLoader
from scrapy_baybenames.items import ScrapyBaybenamesItem

class BabyvornamendeChartsSpider(scrapy.Spider):
    name = "babyvornamendecharts"
    allowed_domains = ["baby-vornamen.de"]
    start_urls = ["https://www.baby-vornamen.de/Namensthemen/Charts/"]

    def parse(self, response): 
        articles = response.css('article.teaser a.teaser__link::attr(href)')
        yield from response.follow_all(articles, self.parse_country_hitlist)
    
    def parse_country_hitlist(self, response):
        name_links = response.css('td.tab__data a::attr(href)')

        for name in name_links:
            yield response.follow(f'https://www.baby-vornamen.de{name}', self.parse_name)

    def parse_name(self, response):
        name = ScrapyBaybenamesItemLoader(item=ScrapyBaybenamesItem(), selector=response)
        name.add_css('name', 'div.namehead__content h1::text')
        name.add_css('sex', 'div.namehead__gender svg::attr(aria-label)')
        name.add_css('countries', 'ul.imglist--origin li a span::text')
        name.add_value('popular', True)
        name.add_value('origin', 'placeholder')
        yield name.load_item()

class BabyvornamendeCountrySpider(scrapy.Spider):
    name = "babyvornamendecountry"
    allowed_domains = ["baby-vornamen.de"]
    start_urls = ["https://www.baby-vornamen.de/Sprache_und_Herkunft/"]

    def parse(self, response): 
        articles = response.css('ul.imglist--flags li')
        for article in articles:
            url = article.css('a::attr(href)')
            origin = article.css('span span::text')

            if not url or not origin:
                continue

            yield response.follow(url[0], self.parse_country_page, meta={'origin': origin})
    
    def parse_country_page(self, response):
        origin = response.meta['origin']
        hit_list = response.css('td.tab__data--name a::text')
        name_links = response.css('td.name a::attr(href)')
        yield from response.follow_all(name_links, self.parse_name, meta={'hit_list': hit_list, 'origin': origin})

        next_button = response.css('a[title="Eine Seite vor"]::attr(href)')
        if next_button:
            yield response.follow(next_button[0], self.parse_country_page, meta={'origin': origin})

    def parse_name(self, response):
        origin = response.meta['origin']
        name = ScrapyBaybenamesItemLoader(item=ScrapyBaybenamesItem(), selector=response)
        name.add_css('name', 'div.namehead__content h1::text')
        name.add_css('sex', 'div.namehead__gender svg::attr(aria-label)')
        name.add_css('countries', 'ul.imglist--origin li a span::text')
        name.add_value('popular', self.is_hit(response))
        name.add_value('origin', origin.get())
        yield name.load_item()

    def is_hit(self, response):
        hit_list = response.meta['hit_list'].getall()
        name = response.css('div.namehead__content h1::text').get().strip()

        return name in hit_list