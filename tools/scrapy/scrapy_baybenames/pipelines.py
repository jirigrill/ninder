# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
import json

class CountryCodePipeline:
    def __init__(self):
        with open('unique_countries.json', 'r', encoding='utf-8') as file:
            self.languages_dict = json.load(file)

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        languages = adapter.get('languages')
        origin = adapter.get('origin')
        two_letter_codes = set()

        for language in languages:
            if language in self.languages_dict:
                two_letter_code = self.languages_dict[language]
                if two_letter_code == "":
                    continue
                two_letter_codes.add(self.languages_dict[language])

        if len(two_letter_codes) <= 0:
            if not origin in self.languages_dict or self.languages_dict[origin] == "":
                raise DropItem(f"No countries found: {item}")
            
            fallback = self.languages_dict[origin]
            two_letter_codes.add(fallback)

        if origin in self.languages_dict and self.languages_dict[origin] != "":
            adapter['origin'] = self.languages_dict[origin]
        else:
            adapter['origin'] = next(iter(two_letter_codes))

        adapter['countries'] = two_letter_codes
        return item

class TransformSexPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        sex = adapter.get('sex', '').lower()
        if sex == 'männlich':
            adapter['sex'] = 'male'
        elif sex == 'weiblich':
            adapter['sex'] = 'female'
        else:
            adapter['sex'] = 'all'
            
        return item

class DuplicatesPipeline:

    def __init__(self):
        self.names_seen = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        if adapter['name'] in self.names_seen:
            raise DropItem(f"Duplicate item found: {item}")
        else:
            self.names_seen.add(adapter['name'])
            return item