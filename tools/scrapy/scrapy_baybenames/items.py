# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class ScrapyBaybenamesItem(scrapy.Item):
    name = scrapy.Field()
    sex = scrapy.Field()
    countries = scrapy.Field()
    languages = scrapy.Field()
    origin = scrapy.Field()
    popular = scrapy.Field()
    categories = scrapy.Field()
    tags = scrapy.Field()
