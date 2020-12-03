
/////////////////////////////////
// Global 

var loc = window.location;
var ws;
var wsUri = "ws:";
var map;
var markers = [];

if (loc.protocol === "https:") { wsUri = "wss:"; }
// This needs to point to the web socket in the Node-RED flow
// ... in this case it's ws/simple
wsUri += "//" + loc.host + loc.pathname.replace("monitor","ws/alert");

//////////////////////////////////////////////
//  google map

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 20.719784 , lng:-103.393908}
    });
}

function dropMarker (type, addr, la, lo) {
    
    clearMarker(addr);
    var marker;
    if ( type === 'Water') {
        marker = new google.maps.Marker({
        position: {lat: 20.72024, lng: -103.392053},
        title : addr,
        map: map,
        label : 'A',
        animation: google.maps.Animation.DROP
        });
    } else {
        marker = new google.maps.Marker({
        position: {lat: 20.720372, lng: -103.392939},
        title : addr,
        map: map,
        label : 'B',
        animation: google.maps.Animation.DROP
        });    
    }
    
    markers.push(marker);
}


function clearMarkers() {
    for ( var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function clearMarker(addr) {
    for ( var i = 0; i < markers.length; i++) {
        if ( markers[i].title == addr ) markers[i].setMap(null);
    }
}

////////////////////////////////////////////////
// Toastr

function showToast(type, addr, la, lo) {  
    toastr.options.positionClass = 'toast-bottom-full-width';    toastr.options.extendedTimeOut = 0; //1000;
    toastr.options.timeOut = 1000;
    toastr.options.fadeOut = 250;
    toastr.options.fadeIn = 250;
    var msg = ' Address : ' + addr;
    msg = msg + ', Latitude : '+ la;
msg = msg + ', Longitude : '+ lo;
        
    

    
}

///////////////////////////////////////////////
// WebSocket 

function wsConnect() {
    
    console.log("connect",wsUri);
    ws = new WebSocket(wsUri);

    ws.onopen = function() {
       console.log("connected");
    }
    ws.onclose = function() {
        setTimeout(wsConnect,5000);
    }
    
    ws.onmessage = function(msg) {
        var payload = JSON.parse(msg.data);
        //console.log(payload);
        showToast(payload.type, payload.addr, payload.la, payload.lo);
        //insert Marker
        dropMarker(payload.type, payload.addr, payload.la, payload.lo);
    }
}

function action(m) {
    // Nothing has been defined yet
    if (ws) { ws.send(m); }
}
 
