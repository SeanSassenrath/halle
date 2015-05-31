$(document).on("pageinit", "#pageMap", function(e, data){

  // --------------------------------------

  var mapOptions = { zoom: 15,
                     disableDefaultUI: true,
                    zoomControl: true };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.setCenter(initialLocation);

    var marker = new google.maps.Marker({
      // change current location marker icon
      position: initialLocation,
      map: map,
    });

    var spaceId



// Add a space to the database -----------------------------------------
    $('#create-space').on('tap', function(e) {
      e.preventDefault();

      // add ability to move marker & add note to parking spot before saving current location as open space

      var longitude = position.coords.longitude;
      var latitude  = position.coords.latitude;
      var data      = {space:{longitude:+longitude,latitude:+latitude}};
      var headers   = '{"Content-Type":"application/json"}';

      $.ajax({
        url: 'http://calm-island-3256.herokuapp.com/spaces',
        // url: 'http://localhost:3000/spaces',
        type: "POST",
        data: data,
        headers: headers
      }).done(function(response) {
        // drop new marker
        $('#successful').popup("open", {
          overlayTheme: "a",
          positionTo: "window",
          // make disappear after 1s
        })
      }).fail(function(response) {
        console.log(response);
        alert("shits fucked up");
      })
    });

// Show available spaces from database -----------------------------------------
    var req = $.ajax({
      url: 'http://calm-island-3256.herokuapp.com',
      // url: 'http://localhost:3000',
      type: "GET",
    });

    req.done(function(response){
      parkingSpots = response
      for(i = 0; i < parkingSpots.length; i++){
        console.log(parkingSpots[i]);
        var marker = new google.maps.Marker({
              position: new google.maps.LatLng(parkingSpots[i].latitude,parkingSpots[i].longitude),
              map: map,
              title: 'Hello World!',
              id: parkingSpots[i].id
        });
        google.maps.event.addListener(marker, 'click', spaceDetails);
      };
    });

    var spaceDetails = function() {
      // $('#space-options').text(this.note)
      spaceId = this.id
      $('#space-options').popup("open", {
        overlayTheme: "a",
        positionTo: "window",
      })
    };

    $('#claim').on('click', function(e){
      e.preventDefault();
      var headers = '{"Content-Type":"application/json"}'
      $.ajax({
        url: 'http://calm-island-3256.herokuapp.com/spaces/'+spaceId,
        // url: 'http://localhost:3000/spaces/'+spaceId,
        type: 'PUT',
        headers: headers,
        data: '' //test without this
      }).done(function(response) {
        alert("success!")
        // navigation begins
      }).fail(function(response) {
        alert("fuck you guys")
      })
      // EXAMPLE NAVIGATION LINK
      //https://www.google.com/maps/dir/Current+Location/43.12345,-76.12345
    });
  });

});
