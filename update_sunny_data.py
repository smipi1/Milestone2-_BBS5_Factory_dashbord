#!/usr/bin/env python3

import glob, csv

file_base = u'data/sunny/Energie_en_vermogen_Dag_'
file_ext = u'.csv'
file_output = u'data/sunny/Energie_en_vermogen_Alle_Dagen.csv'

writer = csv.writer(
    open(file_output, 'wt', newline='')
)

writer.writerow(['timestamp', 'power[kW]'])

for filename in sorted(glob.glob(file_base + '*' + file_ext)):
    filedate = filename.replace(file_base,'').replace(file_ext,'')
    with open(filename, newline='') as in_file:
        reader = csv.reader(in_file, delimiter=';')
        # Skip first line (useless field-names)
        next(reader)
        for row in reader:
            timestamp = filedate + 'T' + row[0] + ':00'
            average_power = float(row[1].replace(',','.')) if row[1] else 0
            writer.writerow([timestamp, average_power])

print(file_output, 'updated')