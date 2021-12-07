# AppSheet-Coord-Convert
A script to convert coordinates from WGS84 lat long to any other format that has a EPSG code.
My version is running in Google Apps Script.

Select your conversion codes from: http://epsg.io/
s_srs = the source coordinate system. This is WGS84 in the code (4326).
t_srs = the target coordinate system.  This is NZTM2000 in the code (2193).

Enable app API in the editor by following the steps here: https://help.appsheet.com/en/articles/1979976-enabling-the-api
