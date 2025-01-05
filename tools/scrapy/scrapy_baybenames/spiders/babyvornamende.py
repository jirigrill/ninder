import scrapy
from urllib.parse import urlencode
from scrapy_baybenames.itemloaders import ScrapyBaybenamesItemLoader
from scrapy_baybenames.items import ScrapyBaybenamesItem

class BabyvornamendeChartsSpider(scrapy.Spider):
    name = "babyvornamendecharts"
    allowed_domains = ["xxx"]
    start_urls = ["xxx"]

    def parse(self, response): 
        articles = response.css('article.teaser a.teaser__link::attr(href)')
        yield from response.follow_all(articles, self.parse_country_hitlist)
    
    def parse_country_hitlist(self, response):
        name_links = response.css('td.tab__data a::attr(href)')
        chart_name = f"charts-{response.url.split('/')[-1].split('-')[-2].lower()}"

        for name in name_links:
            yield response.follow(f'xxx', self.parse_name, meta={'chart_name': chart_name})

    def parse_name(self, response):
        chart_name = response.meta['chart_name']
        name = ScrapyBaybenamesItemLoader(item=ScrapyBaybenamesItem(), selector=response)
        name.add_css('name', 'div.namehead__content h1::text')
        name.add_css('sex', 'div.namehead__gender svg::attr(aria-label)')

        languages = response.css('.datasection--sprachen ul.imglist li a span::text').getall()
        if len(languages) == 0:
            languages = response.css('.datasection--wortherkunft ul.imglist li a span::text').getall()

        name.add_value('languages', languages)
        name.add_value('popular', True)
        name.add_value('origin', 'placeholder')
        name.add_value('categories', [chart_name])
        name.add_value('tags', ['popular'])
        yield name.load_item()

class BabyvornamendeCountrySpider(scrapy.Spider):
    name = "babyvornamendecountry"
    allowed_domains = ["xxx"]
    start_urls = ["xxx"]

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

        languages = response.css('.datasection--sprachen ul.imglist li a span::text').getall()
        if len(languages) == 0:
            languages = response.css('.datasection--wortherkunft ul.imglist li a span::text').getall()

        name.add_value('languages', languages)
        name.add_value('popular', self.is_hit(response))
        if self.is_hit(response):
            name.add_value('tags', ['popular'])
        else:
            name.add_value('tags', ['placeholder'])

        name.add_value('origin', origin.get())
        name.add_value('categories', [])
        yield name.load_item()

    def is_hit(self, response):
        hit_list = response.meta['hit_list'].getall()
        name = response.css('div.namehead__content h1::text').get().strip()

        return name in hit_list
    
class BabyvornamendeRareSpider(scrapy.Spider):
    name = "babyvornamenderare"
    allowed_domains = ["xxx"]
    start_urls = [
        "xxx",
        "xxx"
    ]

    def parse(self, response): 
        names =  response.css('table.table-names a::attr(href)')
        yield from response.follow_all(names, self.parse_name)

    def parse_name(self, response):
        name = ScrapyBaybenamesItemLoader(item=ScrapyBaybenamesItem(), selector=response)
        name.add_css('name', 'div.namehead__content h1::text')
        name.add_css('sex', 'div.namehead__gender svg::attr(aria-label)')

        languages = response.css('.datasection--sprachen ul.imglist li a span::text').getall()
        if len(languages) == 0:
            languages = response.css('.datasection--wortherkunft ul.imglist li a span::text').getall()

        name.add_value('languages', languages)
        name.add_value('popular', False)
        name.add_value('tags', ['rare'])
        name.add_value('origin', 'placeholder')
        name.add_value('categories', ['rare'])
        yield name.load_item()

    def is_hit(self, response):
        hit_list = response.meta['hit_list'].getall()
        name = response.css('div.namehead__content h1::text').get().strip()

        return name in hit_list

class BabyvornamendeTop1000(scrapy.Spider):
    name = "babyvornamendetop1000"
    allowed_domains = ["xxx"]
    start_urls = ["xxx"]

    def parse(self, response): 
        names = response.css('td.tab__data--name a::attr(href)')
        yield from response.follow_all(names, self.parse_name)

        if response.request.method == 'GET':
            url = 'xxx'
            data = {
                'sta': '1',
                'wei': '1',
            }
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'xxx',
            }

            yield scrapy.FormRequest(
                url=url,
                formdata=data,
                headers=headers,
                callback=self.parse
            )

    def parse_name(self, response):
        name = ScrapyBaybenamesItemLoader(item=ScrapyBaybenamesItem(), selector=response)
        name.add_css('name', 'div.namehead__content h1::text')
        name.add_css('sex', 'div.namehead__gender svg::attr(aria-label)')

        languages = response.css('.datasection--sprachen ul.imglist li a span::text').getall()
        if len(languages) == 0:
            languages = response.css('.datasection--wortherkunft ul.imglist li a span::text').getall()

        name.add_value('languages', languages)

        name.add_value('popular', True)
        name.add_value('origin', 'placeholder')
        name.add_value('categories', ['top1000'])
        name.add_value('tags', ['top1000', 'popular'])
        yield name.load_item()

