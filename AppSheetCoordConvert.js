function doPost(e) {

  /* JSON contents example that is sent by AppSheet - user defined
  contents: {
    "pointID": "dc39c4bf",
    "location": "-41.000065, 174.000268"
   }
  */

  // parse JSON and extract location and key field
  var json = JSON.parse(e.postData.contents);
  var latlong = json.location;
  var uniqueId = json.pointID; // change this to the key field of your return table
  
  // variables for conversion
  var llarray = latlong.split(',');
  var lat = llarray[0];
  var lon = llarray[1];

  // form epsg request
  var urlEpsg = "http://epsg.io/trans?x="+lon+"&y="+lat+"&z=0&s_srs=4326&t_srs=2193"; // elevation z=0 as we don't have it recorded, but is required
  
  // send request on to http://epsg.io/trans e.g. ?x=174&y=-41&z=0&s_srs=4326&t_srs=2193
  var response = UrlFetchApp.fetch(urlEpsg); 

  // parse json
  var data = JSON.parse(response.getContentText());
  var xCoord = data.x;
  var yCoord = data.y;
  
  // variables for return
  var appId = "your_app_id_here"; // see guide on where to find and enable this - https://help.appsheet.com/en/articles/1979976-enabling-the-api
  var tableName = "Point"; // target table to return data to, possibly this could be passed with webhook
  var coords = xCoord+", "+yCoord;

  // form appsheet api call
  var urlAppSheet = "https://api.appsheet.com/api/v2/apps/"+appId+"/tables/"+tableName+"/Action?applicationAccessKey=your_app_access_key_here";

  // optionf for return, (properties appear to be needed)
  var options = {
              "Action": "Edit",
              "Properties": {
                "Locale": "en-AU",
                "Location": "-41.000000, 171.000000",
                "Timezone": "New Zealand Standard Time",
                "UserSettings": {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
              },
              "Rows": [
                {
                "PointID": uniqueId,
                "NZTM": coords,
                },
              ]
              };

  // payload for the request
  var payload = {
      "method" : "post",
      "headers" : {
        "content-type" : "application/json"
      },
      "payload" : JSON.stringify(options),
      "muteHttpExceptions" : true
  };
  
  // send appsheet api call 
  var call = UrlFetchApp.fetch(urlAppSheet, payload);

  console.log("call resp code: "+call.getResponseCode());
  console.log("call cont text: "+call.getContentText());

}
