import json

def read_json_to_dict(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    result = {item['name']: item for item in data}
    return result

def write_dict_to_json(file_path, data_dict):
    data_list = list(data_dict.values())

    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data_list, file, indent=4, ensure_ascii=False)

def combine_and_distinct(arr1, arr2):
    combined = set(arr1 + arr2)
    return list(combined)

def consolidate(original_path, additional_path, output_path):
    additionals = read_json_to_dict(additional_path)
    originals = read_json_to_dict(original_path)

    for additional in additionals:
        if additional in originals:
            if additionals[additional]['popular'] == True:
                originals[additional]['popular'] = True

            if not "categories" in originals[additional]:
                originals[additional]['categories'] = []

            if not "countries" in originals[additional]:
                originals[additional]['countries'] = []

            if not "languages" in originals[additional]:
                originals[additional]['languages'] = []

            if not "tags" in originals[additional]:
                originals[additional]['tags'] = []

            originals[additional]['countries'] = combine_and_distinct(originals[additional]['countries'], additionals[additional]['countries'])
            originals[additional]['categories'] = combine_and_distinct(originals[additional]['categories'], additionals[additional]['categories'])
            originals[additional]['languages'] = combine_and_distinct(originals[additional]['languages'], additionals[additional]['languages'])
            originals[additional]['tags'] = combine_and_distinct(originals[additional]['tags'], additionals[additional]['tags'])

        else:
            originals[additional] = {}
            originals[additional]['name'] = additionals[additional]['name']
            originals[additional]['sex'] = additionals[additional]['sex']
            originals[additional]['countries'] = additionals[additional]['countries']
            originals[additional]['categories'] = additionals[additional]['categories']
            originals[additional]['languages'] = additionals[additional]['languages']
            originals[additional]['tags'] = additionals[additional]['tags']
            originals[additional]['popular'] = additionals[additional]['popular']

            if additionals[additional]['origin'] != "XX":
                originals[additional]['origin'] = additionals[additional]['origin']
            else:
                originals[additional]['origin'] = additionals[additional]['countries'][0]
            pass

    write_dict_to_json(output_path, originals)

consolidate('by_countries.json', 'charts.json', 'consolidated.json')
consolidate('consolidated.json', 'top1000.json', 'consolidated.json')
consolidate('consolidated.json', 'rare.json', 'consolidated.json')