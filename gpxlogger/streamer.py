#!/usr/bin/env python3
# Use Python 3.3
# GPX lat-long stream-based parser
# Reads from std in, and writes the parsed data to std out.
import sys
import xml.etree.ElementTree as ET

prefix = '{http://www.topografix.com/GPX/1/1}'
trkpttag = '{0}trkpt'.format(prefix)
timetag = '{0}time'.format(prefix)
eletag = '{0}ele'.format(prefix)
riderid = "%2C65%2C0%2C'matthew'"
url = "https://ideapublic.cartodb.com/api/v2/sql?api_key=7302db3d477047e379af83c1987573e043022fe4&q=INSERT%20INTO%20gps_traces(gps_timestamp%2Cride_id%2Ctrace_id%2Cusername%2Cthe_geom)%20VALUES('{0}'%2C65%2C0%2C'matthew'%2CST_SetSrid(st_makepoint({1}%2C{2})%2C4326))" 

def toUrl(data):
    lat, lon, isotime, elev = data
    return url.format(isotime, lon, lat)

def writer(data):
    if data:
        print(toUrl(data))

# stream based pasrser
for event, elem in ET.iterparse(sys.stdin):
    if event == 'end':        
        if elem.tag == trkpttag:            
            
            # get track point attributes 
            lat = elem.get('lat')
            lon = elem.get('lon')
            timeElement = elem.find(timetag) 
            elevationElement = elem.find(eletag)
            
            if timeElement is not None:
                ts = timeElement.text
            else:
                ts = ''
            
            if elevationElement is not None:
                elevation = elevationElement.text
            else:
                elevation = ''

            writer((lat, lon, ts, elevation))

            # discard the element to free memory
            elem.clear()           

