#!/bin/sh -x
sudo gpsd /dev/ttyUSB0 -n -F /var/run/gpsd.sock
