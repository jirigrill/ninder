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

hit_list_path = 'hit_list.json'
hit_list = read_json_to_dict(hit_list_path)

names_by_origin_path = "names_by_origin.json"
names_by_origin = read_json_to_dict(names_by_origin_path)

for hit in hit_list:
    if hit in names_by_origin:
        names_by_origin[hit]['popular'] = True
    else:
        if not "XX" in hit_list[hit]['countries']:
            names_by_origin[hit] = {}
            names_by_origin[hit]['name'] = hit_list[hit]['name']
            names_by_origin[hit]['sex'] = hit_list[hit]['sex']
            names_by_origin[hit]['countries'] = hit_list[hit]['countries']
            names_by_origin[hit]['popular'] = True
            names_by_origin[hit]['origin'] = hit_list[hit]['countries'][0]
            pass

write_dict_to_json("post-process.json", names_by_origin)