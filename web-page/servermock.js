/**
 * Created by Sergey on 12/29/2015.
 */

var ws = require("nodejs-websocket");

var clients = [];

var usStates = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
            result = prop;
    return result;
};

var sendData = function () {

    var data = JSON.stringify({
        time: new Date(),
        state: pickRandomProperty(usStates),
        pressure: (Math.random() * 20) + 50,
        temperature: (Math.random() * 20) + 20,
        count: 1
    });

    clients.forEach( function(client){
        client.sendText(data);
    });

};

setInterval(sendData, 100);

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    var cconn = conn;
    console.log("New connection");

    clients.push(cconn);

    //conn.on("text", function (str) {
    //    console.log("Received "+str);
    //    conn.sendText(str.toUpperCase()+"!!!")
    //});

    cconn.on("close", function (code, reason) {
        var idx = clients.indexOf(cconn);
        if (idx>=0) {
            clients.splice(idx, 1);
        }
    })
}).listen(9000);

