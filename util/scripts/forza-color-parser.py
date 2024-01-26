import os
import csv
import json

file_path = os.path.join(os.path.dirname(__file__), '../data/forza-colors.csv')

output_json_path = os.path.join(os.path.dirname(__file__), '../data/forza-colors.json')

# Read CSV data from file
with open(file_path, 'r', newline='', encoding='utf-8') as file:
    csv_reader = csv.reader(file)
    lines = list(csv_reader)

header = [x.strip() for x in lines[0]]
result = []

for line in lines[1:]:
    values = [x.strip() for x in line]
    item = {}
    for i in range(len(header)):
        item[header[i]] = values[i]
    result.append(item)

json_data = json.dumps(result, indent=2)

# Write JSON data to a file
with open(output_json_path, 'w', encoding='utf-8') as json_file:
    json_file.write(json_data)

print(f"Data has been successfully written to {output_json_path}")
