#!/usr/bin/env python3
# Use Python 3.3

import xml.etree.ElementTree as ET

prefix = '{http://www.topografix.com/GPX/1/1}'
trkpt_tag = '{0}trkpt'.format(prefix)
time_tag = '{0}time'.format(prefix)

tree = ET.parse('sample.xml')
root = tree.getroot()

#recursively iterate through sub-elements trkpt
for trkpt in root.iter(trkpt_tag):
    print('-------------------')
    #attribute 
    print('lat: ' + trkpt.get('lat'))     
    
    #attribute
    print('lon: ' + trkpt.get('lon'))
    
    #sub-element
    print('time: {:>15}'.format(trkpt.find(time_tag).text))     


