//TOKIYO HRE
var tokiyo = [];
tokiyoPoints = [{
    pointId: '58f01f50419a9e1f9b735d06',
    pointName: 'Starbucks',
    pointLat: 35.665542,
    pointLng: 139.703497
}, {
    pointId: '5885eafa51d19e79a15ad8d0',
    pointName: 'KOFFEE MAMEYA',
    pointLat: 35.668368,
    pointLng: 139.710888
}, {
    pointId: '58facdc24420d81732477af3',
    pointName: 'ALPHA BETA COFFEE CLUB',
    pointLat: 35.608171,
    pointLng: 139.668158
}, {
    pointId: '583cf19aa6118c23dbe2bb26',
    pointName: 'Mikkeller Tokyo',
    pointLat: 35.659502,
    pointLng: 139.696019
}, {
    pointId: '58df3581b3cdc84867e6ad53',
    pointName: 'The Counter',
    pointLat: 35.663108,
    pointLng: 139.715508
}, {
    pointId: '58cdfe375305115323feb684',
    pointName: 'Wendys First Kitchen',
    pointLat: 35.713416,
    pointLng: 139.774697
}];
var map;
  function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {      
			lat: 35.689488,
			lng: 139.691706
		},
		zoom: 13
	});
	ko.applyBindings(new tokyoModelHere());
  };
  function error() {
	document.getElementById('map').innerHTML = "Error in map";
  };
  
//TOKYOMODEL HERE
var tokyoModelHere = function() {
    /*   var nIcon = makePointerIcon('0091gf'); //NEW ICON
       var uIcon = makePointerIcon('FFFF24'); //USED ICON
      */
    var tokyoInfo = new google.maps.InfoWindow(); //TOKYO HERE
    for (var p = 0; p < tokiyoPoints.length; p++) { //for loop
        var tpoint = new google.maps.Marker({ //MAP MARKER
            map: map, //MAP BY ID
            //MARKER DROP
            animation: google.maps.Animation.DROP,
            venue: tokiyoPoints[p].pointId, //FOR LIKES AND RATING
            title: tokiyoPoints[p].pointName, //TITLE OF POINT
            show: ko.observable(true), //SHOW POINT
            selected: ko.observable(false), //SELECT POINT
            position: { //POINT POSITION
                lat: tokiyoPoints[p].pointLat,
                lng: tokiyoPoints[p].pointLng
            }
        });
        tokiyo.push(tpoint); //ADD POINT AT THE END
        tpoint.addListener('click', clickHandler1);
        tpoint.addListener('click', clickHandler2);
        /*
          tpoint.addListener('mouseover', mouseOverHandler);
          tpoint.addListener('mouseout', mouseOutHandler);
        */
    }

    function clickHandler1() {
        //CLICK ON THE POINTER
        pointerInfo(this, tokyoInfo);
    }

    function clickHandler2() {
        //CLICK ON THE POINTER
        BOUNCE(this);
    }
    /*
    function mouseOverHandler() {
      //MOSEOVER ON POINT
      this.setIcon(nIcon);
    }

    function mouseOutHandler() {
      //MOUSEOUT FROM THE POINTER
      this.setIcon(uIcon);
    }*/
    //INFOWINDOW FUNCTION
    function pointerInfo(pointInfo, infoTokyo) {
        if (infoTokyo.pointInfo != pointInfo) {
            infoTokyo.pointInfo = pointInfo;
            //SET CONTENT
            infoTokyo.setContent('<div>' + '<h5>' + pointInfo.title + '</h5>' + pointInfo.rating + '<br>' + pointInfo.likes + '</div>');
            infoTokyo.open(map, pointInfo);
            //WHEN CLICK ON CROSS
            infoTokyo.addListener('closeclick', function() {
                infoTokyo.pointInfo = null;
            });
        }
    }
    //MAKE THE ICON
    function makePointerIcon(colorPoint) {
        //IMAGE USED AS MARKR
        var imagePoint = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + colorPoint + '|40|_|%E2%80%A2', new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(21, 34));
        return imagePoint;
    }
    //BOUNCE FUNCTION
    function BOUNCE(pointbounce) {
        pointbounce.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            pointbounce.setAnimation(null); //BOUNCE ICON BY 850ms
        }, 850);
        pointerInfo(pointbounce, tokyoInfo);
    }
    var self = this;
    //BOUNCE SELF FUNCTION
    self.bouncePoint = function(pointbounce) {
        pointbounce.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            pointbounce.setAnimation(null);
        }, 850);
        pointerInfo(pointbounce, tokyoInfo);
    };

    self.searchfind = ko.observable('');
    self.useSearch = function() {
        self.disp();
    };
    self.searchOptions = function() {
        var typeText = self.searchfind();
        tokyoInfo.close(); //CLOSE ALL INFOWINDOW
        if (typeText.length === 0) {
            //SEARCH NOTHING
            self.disp();
        } else {
            //SEARCH SOMETHING
            self.match(typeText);
        }
        //CLOSE ALL INFOWINDOW
        tokyoInfo.close();
    };
    //EXTRA INFO OF THE OF THE POINTER
    tokiyo.forEach(function(pointbounce) {
        $.ajax({
            method: 'GET', //FOR METHOD
            dataType: 'json', //FOR DATATYPE
            //URL
            url: 'https://api.foursquare.com/v2/venues/' + pointbounce.venue + '?client_id=W0GTPJI3Q3HTWRRUOQVWSF12W2ZBYYNCTDVRZ4GZ1KW4MVV4&client_secret=QAQCOIHPZV0DOTYERSRMHCXO0GASRR4EYQG3OXB1XTJNFLKD&v=20170501',
            //WHEN ERROR
            error: function(eR) {
                alert("not disp");
            },
            //WHEN SUCCESS
            success: function(tdata) {
                var tokyoInfo = tdata.response.venue;
                if (tokyoInfo.hasOwnProperty('likes')) {
                    //LIKES OF THE POINT FROM FOURSQAURE
                    pointbounce.likes = "Likes - " + tokyoInfo.likes.summary;
                } else {
                    //IF NOTHING IS FOUND
                    pointbounce.likes = "nothing";
                }
                if (tokyoInfo.hasOwnProperty('rating')) {
                    //RATING OF THE POINT FROM FOURSQUARE
                    pointbounce.rating = "Rating - " + tokyoInfo.rating;
                } else {
                    //IF NOTHING IS FOUND
                    pointbounce.rating = "nothing";
                }
            }
        });
    });
    self.match = function(typeText) {
        for (var p = 0; p < tokiyo.length; p++) {
            if (tokiyo[p].title.toLowerCase().indexOf(typeText.toLowerCase()) < 0) {
                tokiyo[p].setMap(null);
                tokiyo[p].show(false);
            } else {
                tokiyo[p].setMap(map);
                tokiyo[p].show(true);
            }
        }
    };
    self.disp = function() {
        for (p = 0; p < tokiyo.length; p++) {
            tokiyo[p].show(true);
            tokiyo[p].setMap(map);
            tokiyo[p].setVisible(true);
        }
    };
};