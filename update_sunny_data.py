#!/usr/bin/env python3

import glob, json

with open('data/sunny/manifest.json', 'wt') as f:
    print(json.dumps(glob.glob("data/sunny/*.csv")), file=f)