from itemloaders import ItemLoader
from itemloaders.processors import TakeFirst, MapCompose, Compose

class ScrapyBaybenamesItemLoader(ItemLoader):
    default_output_processor = TakeFirst()
    name_in = MapCompose(lambda x: x.strip())
    languages_out = Compose(lambda v: v if isinstance(v, list) else [v])
    categories_out = Compose(lambda v: v if isinstance(v, list) else [v])
    tags_out = Compose(lambda v: v if isinstance(v, list) else [v])
    sex_out = Compose(lambda values: "Unisex" if set(values) == {"Männlich", "Weiblich"} else values[0])