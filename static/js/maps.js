      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: {lat: 51.377914, lng:  5.579662}
        });

        var image = {
          url: "assets/panelicon.JPG",
          scaledSize: new google.maps.Size(40, 40),

        };
        var solarMarker = new google.maps.Marker({
          position: {lat: 51.377914, lng:  5.579662},
          map: map,
          icon: image
        });
      }
      
      