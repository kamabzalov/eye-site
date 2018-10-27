// После верстки проверить все селекторы

var pos;
var flag = false;
var isStreet = false;
var isCompany = false;
var isUsers = false;
var markersArray = []
var filteredArray = [];
var markerCluster;
var map;
var lock = false;

var styles = [{
    url: '/img/cluster.png',
    width: 30,
    height: 30,
    backgroundPosition: '0,0',
    textColor: '#fff',
    textSize: 10
}];

/**
 *  Инициализация карты
 */
function initMap() {
    let marker_e = {lat: 55.75413771, lng: 37.62139542};
    let yor_pos = {lat: 55.75413771, lng: 37.62139542};
    map = new google.maps.Map(document.getElementById('map'), {
       disableDefaultUI: true,
       zoom: 14,
       styles:[{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#d3d3d3"}]},{featureType:"transit",stylers:[{color:"#808080"},{visibility:"off"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{visibility:"on"},{color:"#b3b3b3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{visibility:"on"},{color:"#ffffff"},{weight:1.8}]},{featureType:"road.local",elementType:"geometry.stroke",stylers:[{color:"#d7d7d7"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{visibility:"on"},{color:"#ebebeb"}]},{featureType:"administrative",elementType:"geometry",stylers:[{color:"#a7a7a7"}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#ffffff"}]},{featureType:"landscape",elementType:"geometry.fill",stylers:[{visibility:"on"},{color:"#efefef"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#696969"}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{visibility:"on"},{color:"#737373"}]},{featureType:"poi",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#d6d6d6"}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{color:"#dadada"}]}]
   });

    map.addListener('dragend',function() {
        getMarkers(map);
    });

    map.addListener('zoom_changed',function() {
        getMarkers(map);
    });

   
    // TODO: При скроллинге карты скрывать панель - проверить
    google.maps.event.addListener(map,'dragstart', function(){
       angular.element("#panel").addClass("hide");
   })

     var marker_company = "";
     
     var you_pos = "/img/black-dot.png";
     var you_pos = new google.maps.Marker({
       map: map,
       icon: you_pos
     });

     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
           pos = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
             };
           you_pos.setPosition(pos);
           map.setCenter(pos);
       }, function() {
             handleLocationError(true, you_pos, map.getCenter());
       });
     } else {
         handleLocationError(false, you_pos, map.getCenter());
         pos = {
             lat: 0,
             lng: 0
         };
         you_pos.setPosition(pos);
         map.setCenter(pos);
   }

}

/**
 * Декодирует адрес в географические координаты
 * @param {str} id - id html поля с адресом
 */
function codeAddress(id) {
	var geocoder = new google.maps.Geocoder;
    var address = document.getElementById(id).value;
  	geocoder.geocode({"address": address}, function(results, status){
    	localStorage.setItem("lat", results[0].geometry.location.lat());
        localStorage.setItem("lng", results[0].geometry.location.lng()); 
    });
}

/**
 * Добавляет возможность автоподстановки адреса в поле
 * @param {string} selector - селектор поля с адресом
 */
function makeAutoComplete(selector) {
	var input = document.getElementById(selector);
    var autocomplete = new google.maps.places.Autocomplete(input);
}

/**
 * Проверяет, поддерживает ли браузер геолокацию
 * @param {bool} browserHasGeolocation - флга поддержки геолокации браузером
 * @param {object} infoWindow - позиция
 * @param {*} pos  - центр карты
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	you_pos.setPosition(pos);
    you_pos.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
}

/**
 * Возвращает список маркеров (аккаунтов) из БД для их последующей установки и фильтрации
 * @param {*} map - объект карты
 */
function getMarkers(map){
	var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var settings = {
    	"async": true,
        "crossDomain": true,
		"url": "https://api.eyeinc.ru/v0.9/index.php?c=api&m=mapsearchNew&southWestLat="+sw.lat()+"&southWestLng="+sw.lng()+"&northEastLat="+ne.lat()+"&northEastLng="+ne.lng(),
        "method": "GET"
    }

    if (!lock){
        lock = true;
        $.ajax(settings).done(function (response) {
            lock = false;
            if (response.success){
                markersArray = response.search;
                    if(!isStreet && !isUsers && !isCompany){
                        setMarkers(markersArray);
                    } else {
                        filter(markersArray);
                    }
                }
            });
    }
}

/**
 * Располагает маркеры на карте
 * @param {object} marks - маркеры (аккаунты)
 */
function setMarkers(marks){
    initMarkers(marks,() => {});
    setTop(marks,() => {});
}


function initMarkers(search,callback){
    let markers = search.map(function(location,i){
    	location.lat = parseFloat(location.lat);
        location.lng = parseFloat(location.lng);
        if(search[i].type == 0) {
            var icon = "/img/green-dot.png";
        } else if(search[i].type == 1) {
            var icon = "/img/orange-dot.png";
        } else {
            var icon = "/img/blue-dot.png";
        }
        return new google.maps.Marker({
        	position : location,
            id: location.id,
            icon: icon
        });
    });
    
    var windowContent = [];
    var infoWindow = [];

    for(var j=0; j<markers.length; j++) { 
        let avatar = (search[j].avatar.length == 0) ? "<span class='empty-avatar'></span>"  : (search.type == 0) ? search[j].avatar : "<img src='" + search[j].avatar + "'/>" ;
        windowContent[j] = "<div class='eye-infoWindow'>" + avatar + " " + search[j].name  + "</div>";
        infoWindow[j] = new google.maps.InfoWindow({
            content: windowContent[j]
        });

        var infoWindowNow = infoWindow[j];

        google.maps.event.addListener(infoWindow[j], 'domready', function() {
            $('.gm-style-iw').prev().children(':nth-child(2)').hide();
            $('.gm-style-iw').prev().children(':nth-child(4)').hide();
            $('.gm-style-iw').next().css("display", "none");
        });

        markers[j].addListener('click', function() {
			angular.element(document.body).scope().getUserDataById(this['id']);
			// angular.element(document.body).scope().startTranslation(this['id']);
        });
        
        var addListener = function (j) {
            google.maps.event.addListener(markers[j], 'mouseover', function(){
                infoWindow[j].open(map, this);                 
            });

            google.maps.event.addListener(markers[j], 'mouseout', function(){
                infoWindow[j].close();                 
            });
        }
        addListener(j);

        if(!$(".eye-infoWindow img").outerWidth() || $(".eye-infoWindow img").outerWidth() == 'undefined') {
            $(".eye-infoWindow img").replaceWith("<span class='empty-avatar'></span>");
        }
    }

	if(typeof markerCluster !== 'undefined'){
    	markerCluster.clearMarkers();
	}

    markerCluster = new MarkerClusterer(map, markers,{
        imagePath: '/img/black-dot.png',
        styles: styles,
    });

    callback()
}

/**
 * Фильтр маркеров на карте из ТОПа
 * @param {string} param - параметр фильтрации
 */
function filter(param){
    switch (param) {
        case 'isUsers':
            isUsers = !isUsers;
            break;
        case 'isCompany':
            isCompany = !isCompany;
            break;
        case 'isStreet':
            isStreet = !isStreet;
            break;
        default:

    }
	var k = 0;
    filteredArray = [];
    for (var i = 0;i<markersArray.length;i++){
        // 0 - места
        // 1 - пользователи
        // 2 - заведения
        
        if (isStreet && markersArray[i].type == 0 ){
        	continue;
		}
        
        if (isUsers && markersArray[i].type == 1){
        	continue;
        }

		if (isCompany && markersArray[i].type == 2){
        	continue;
		}

       
        filteredArray[k] = markersArray[i];
        k++;

	}

    setMarkers(filteredArray);
}

/**
 * Сравнивает две трансляции по рейтингу
 * @param {*} translationA  - объект первой трансяции
 * @param {*} translationB  - объект второй трансяции
 */
function compareTranslation(translationA,translationB){
	return (translationA.likes+translationA.watchers+translationA.followers)-(translationB.likes+translationB.watchers+translationB.followers);
}