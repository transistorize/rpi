#!/usr/bin/env python3
# Use Python 3.3
# GPX lat-long stream-based parser
# Read from std in, and write the lat, lon pairs to std out.
import sys
import xml.etree.ElementTree as ET

prefix = '{http://www.topografix.com/GPX/1/1}'
trkpt_tag = '{0}trkpt'.format(prefix)
time_tag = '{0}time'.format(prefix)
delimiter = ','

# stream based pasrser
for event, elem in ET.iterparse(sys.stdin):
    if event == 'end':
        if elem.tag == trkpt_tag:            
            # get track point attributes 
             print(elem.get('lat') + delimiter + elem.get('lon'))
    
    # discard the element to free memory
    elem.clear()

