/*Angluar application code*/
var eyeApp = angular.module("eye", ["ngRoute", "ngWebSocket", "ngAnimate", "pascalprecht.translate", "infinite-scroll"]);

const LEFTASIDEWIDTH = 250;
const INFOPANELWIDTH = 250;
const RIGHTASIDEWIDTH = 310;
const MOBILELEFTASIDEWIDTH = 55;

/**
 * Разрешает кроссдоменные запросы
 */
eyeApp.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

/**
 * Устанавливает корректный формат ссылок в роутинге
 */
eyeApp.config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
}]);

/**
 * Добавялет урл в "белый список"
 */
eyeApp.config(["$sceDelegateProvider", function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		"self",
		"https://api.eyeinc.ru/v0.9/index.php"
	]);
}]);

eyeApp.config(['$translateProvider', function($translateProvider){

	// Adding a translation table for the English language
	$translateProvider.translations('en_US', {
		"TITLE": "EYE - look at the world",
		"LOGIN": "Login",
		"LOGOUT": "Logout",
		"REGISTRATION": "Registration",
		"MESSAGES": "Messages",
		"STARTTRANSLATE": "Start streaming",
		"STOPTRANSLATE": "Stop streaming",
		"STOPWATCHTRANSLATE": "Exit from streaming",
		"MYCAMERAS": "My cameras",
		"ADDCAMERA": "Add camera",
		"MYWALL": "Wall",
		"WALL": "Wall",
		"FAVORITES": "Favorites",
		"FOLLOWERS": "Followers",
		"SETTINGS": "Settings",
		"SEARCH": "Search",
		"TOSUBSCRIBE": "Subscribe",
		"UNSUBSCRIBE": "Unsubscribe",
		"PEOPLE": "people",
		"COMPANIES": "companies",
		"PLACES": "places",
		"PLACEHOLDERLOGIN": "Phone/Email",
		"PLACEHOLDERPASSWORD": "Password",
		"FORGOTPASSWORD": "Forgot password?",
		"REGNEWUSER": "Register new user",
		"REMEMBERPASS": "Remember password",
		"CHOOSEREMEMBERPASS": "Choose remember password way",
		"NEXTBUTTON": "Next",
		"NOTERECEIVECODE": "If you didn't receive code after 60 seconds",
		"TRYMORE": "try again",
		"PLACEHOLDERCODE": "Enter the code",
		"PLACEHOLDERNEWPASSWORD": "New password",
		"SAVEBUTTON": "Save",
		"ENTERNEWPASSWORD": "Enter new password",
		"USER": "User",
		"COMPANY": "Company",
		"REGISTERNOTICE": "Registering in our service you get access to our services and agree with",
		"TERMSOFUSE": "terms of use",
		"PLACEHOLDERUSERNAME": "User name",
		"PLACEHOLDERPHONE": " Phone",
		"PLACEHOLDEREMAIL": "Email",
		"START": "Start",
		"REGNEWCOMPANY": "Register new company",
		"SENDCODETOEMAIL": "Send code to email",
		"PLACEHOLDERCOMPANYNAME": "Company name",
		"PLACEHOLDERREPEATPASSWORD": "Repeat password",
		"PLACEHOLDERCALLS": "Phone for receiving calls",
		"PLACEHOLDERADDRESS": "Address",
		"CHOOSECATEGORY": "Choose category",
		"NIGHTCLUB": "Night club",
		"BAR": "Bar",
		"KARAOKE": "Karaoke",
		"CAFE": "Cafe",
		"RESTAURANT": "Restaurant",
		"HOOKAH": "Hookah",
		"HOSTEL": "Hostel",
		"HOTEL": "Hotel",
		"FITNESS": "Fitness",
		"FASHION": "Fashion",
		"ART": "Art",
		"GAMES": "Games",
		"AQUAPARK": "Aquapark",
		"SERVICE": "Service",
		"SHOPPING CENTER": "Shopping center",
		"SHOP": "Shop",
		"BUSINESS CENTER": "Business center",
		"KINDERGARTEN CENTER": "Kindergarten center",
		"EDUCATION": "Education",
		"MEDICINE": "Medicine",
		"CHANNEL": "Channel",
		"PRIVATE": "Private",
		"NO CATEGORY": "No category",
		"DOWNLOADWINDOWS": "Download app for windows",
		"DOWNLOADMAC": "Download app for Mac",
		"SEARCHBYDIALOGS": "Search by dialogs",
		"SEARCHBYFAVORITES": "Search by favorites",
		"SEARCHBYFOLLOWERS": "Search by followers",
		"ADDCAMERA": "Add camera",
		"ADDCAMERANOTICE": "If you use static IP address, add your camera URL to form and manage your streaming through mobile app",
		"PLACEHOLDERCAMERAURL": "Camera URL",
		"PLACEHOLDERCAMERAURL": "Camera URL",
		"PLACEHOLDERCAMERANAME": "Camera name",
		"ADDBUTTON": "Add camera",
		"SEARCHBYCAMERAS": "Search by cameras",
		"WALLNOTICE": "Here you can add advertising or poster of future events",
		"ADDWALL": "Add wall",
		"PLACEHOLDERWALLCREATETEXT": "Enter the text",
		"CREATEWALL": "Create wall",
		"EDITWALL": "Edite wall",
		"UPDATEWALL": "Update wall",
		"DELETEWALL": "Delete wall",
		"ANSWERTO": "Answer",
		"WATCHERSCOUNT": "watchers",
		"WRITECOMMENT": "Write comment",
		"DOWNLOAD": "Download",
		"DOWNLOADEYESTREAMER": "Download EyeStreamer",
		"DOWNLOADFORWINDOWS": "Download for Windows",
		"DOWNLOADFORMAC": "Download for Mac",
		"CHANGEPASSWORD": "Change password",
		"CHANGELOGINANDAVATAR": "Change login and avatar",
		"ENTEROLDPASSWORD": "Enter old password",
		"ENTERNEWPASSWORD": "Enter new password",
		"ENTERLOGIN": "Enter login",
		"CHANGEBUTTON": "Change"
	  });
	
	  // Adding a translation table for the Russian language
	  $translateProvider.translations('ru_RU', {
		"TITLE": "EYE - посмотри на мир",
		"LOGIN": "Вход",
		"LOGOUT": "Выход",
		"REGISTRATION": "Регистрация",
		"MESSAGES": "Сообщения",
		"MYCAMERAS": "Мои камеры",
		"STARTTRANSLATE": "Начать трансляцию",
		"STOPTRANSLATE": "Закончить трансляцию",
		"STOPWATCHTRANSLATE": "Выйти из трансляции",
		"ADDCAMERA": "Добавить камеру",
		"MYWALL": "Моя стена",
		"WALL": "Стена",
		"FAVORITES": "Избранные",
		"FOLLOWERS": "Подписчики",
		"SETTINGS": "Настройки",
		"SEARCH": "Поиск",
		"TOSUBSCRIBE": "Подписаться",
		"UNSUBSCRIBE": "Подписки",
		"PEOPLE": "люди",
		"COMPANIES": "заведения",
		"PLACES": "места",
		"PLACEHOLDERLOGIN": "Телефон",
		"PLACEHOLDERPASSWORD": "Пароль",
		"PLACEHOLDERREPEATPASSWORD": "Повторите пароль",
		"FORGOTPASSWORD": "Забыли пароль?",
		"REGNEWUSER": "Регистрация нового пользователя",
		"REMEMBERPASS": "Восстановление пароля",
		"CHOOSEREMEMBERPASS": "Выберите способ восстановления пароля",
		"NEXTBUTTON": "Вперед",
		"NOTERECEIVECODE": "Если вы не получили код после 60 секунд",
		"TRYMORE": "попробуйте еще",
		"PLACEHOLDERCODE": "Введите код",
		"PLACEHOLDERNEWPASSWORD": "Новый пароль",
		"SAVEBUTTON": "Сохранить",
		"ENTERNEWPASSWORD": "Введите новый пароль",
		"USER": "Пользователь",
		"COMPANY": "Заведение",
		"REGISTERNOTICE": "Регистрируясь в нашем сервисе, вы получаете доступ к нашим услугам и подтверждаете согласие на обработку и хранение персональной информации",
		"TERMSOFUSE": "пользовательское соглашение",
		"PLACEHOLDERUSERNAME": "Имя пользователя",
		"PLACEHOLDERPHONE": " Телефон",
		"PLACEHOLDEREMAIL": "Email",
		"START": "Начать работу без скачивания",
		"REGNEWCOMPANY": "Регистрация нового заведения",
		"SENDCODETOEMAIL": "Отправить код на email",
		"PLACEHOLDERCOMPANYNAME": "Название компании",
		"PLACEHOLDERREPEATPASSWORD": "Повторите пароль",
		"PLACEHOLDERCALLS": "Номер для приема звонков",
		"PLACEHOLDERADDRESS": "Адрес",
		"CHOOSECATEGORY": "Выберите категорию",
		"NIGHTCLUB": "Ночной клуб",
		"BAR": "Бар",
		"KARAOKE": "Караоке",
		"CAFE": "Кафе",
		"RESTAURANT": "Ресторан",
		"HOOKAH": "Кальянная",
		"HOSTEL": "Гостиница",
		"HOTEL": "Отель",
		"FITNESS": "Фитнес",
		"FASHION": "Мода",
		"ART": "Искусство",
		"GAMES": "Игры",
		"AQUAPARK": "Аквапарк",
		"SERVICE": "Услуги",
		"SHOPPING CENTER": "Торговый центр",
		"SHOP": "Магазин",
		"BUSINESS CENTER": "Бизнес центр",
		"KINDERGARTEN CENTER": "Детский сад",
		"EDUCATION": "Образование",
		"MEDICINE": "Медицина",
		"CHANNEL": "Канал",
		"PRIVATE": "Частное",
		"NO CATEGORY": "Без категории",
		"DOWNLOADWINDOWS": "Скачать программу для Windows",
		"DOWNLOADMAC": "Скачать программу для Mac",
		"SEARCHBYDIALOGS": "Поиск по диалогам",
		"SEARCHBYFAVORITES": "Поиск по избранным",
		"SEARCHBYFOLLOWERS": "Поиск по подписчикам",
		"ADDCAMERA": "Добавить камеру",
		"ADDCAMERANOTICE": "Если вы используете статический IP адрес, добавьте URL Вашей камеры сюда и управляйте трансляцией с помощью мобильного приложения",
		"PLACEHOLDERCAMERAURL": "URL камеры",
		"PLACEHOLDERCAMERANAME": "Название камеры",
		"ADDBUTTON": "Добавить",
		"SEARCHBYCAMERAS": "Поиск по камерам",
		"WALLNOTICE": "Здесь вы можете разместить рекламу или афишу предстоящих событий",
		"ADDWALL": "Добавить стену",
		"PLACEHOLDERWALLCREATETEXT": "Введите текст",
		"CREATEWALL": "Создать стену",
		"EDITWALL": "Редактировать стену",
		"UPDATEWALL": "Обновить стену",
		"DELETEWALL": "Удалить стену",
		"ANSWERTO": "Ответить",
		"WATCHERSCOUNT": " зрителей",
		"WRITECOMMENT": "Написать комментарий",
		"DOWNLOAD": "Скачать",
		"DOWNLOADEYESTREAMER": "Скачать EyeStreamer",
		"DOWNLOADFORWINDOWS": "Скачать для Windows",
		"DOWNLOADFORMAC": "Скачать для Mac",
		"CHANGEPASSWORD": "Изменить пароль",
		"CHANGELOGINANDAVATAR": "Изменить логин и аватар",
		"ENTEROLDPASSWORD": "Введите старый пароль",
		"ENTERNEWPASSWORD": "Введите новый пароль",
		"ENTERLOGIN": "Введите новый логин",
		"CHANGEBUTTON": "Изменить"
	  });

	  $translateProvider.preferredLanguage('ru_RU');

}]);

/**
 * Автоматическая авторизация через определенное время
 */
eyeApp.factory('httpInterceptor', function($q){
	return {
		request: function(config) {
			if(localStorage.getItem("access_token")) {
				config.headers['Authorization'] = "Bearer " + localStorage.getItem("access_token");
        	}
        return config;
      }
    }
});

/**
 * Добавление нового интерсептора
 */
eyeApp.config(function($httpProvider){
	$httpProvider.interceptors.push('httpInterceptor');
});

// Роутинг приложения
eyeApp.config(function($routeProvider) {
	$routeProvider
		.when(
			'/auth',
				{
					templateUrl: 'templates/auth.html',
					controller: 'authController'
				}
    	)
    	.when (
			'/remember-pass',
				{
        			templateUrl: 'templates/remember-pass.html',
          			controller: 'authController'
        		}
    	)
    	.when(
      		'/reg',
        		{
          			templateUrl: 'templates/reg.html',
          			controller: 'regController'
        		}
    	)
    	.when(
      		'/reg/user-reg',
        		{
          			templateUrl: 'templates/user-reg.html',
          			controller: 'regController'
        		}
    	)
    	.when(
      		'/reg/company-reg',
        		{
          			templateUrl: 'templates/company-reg.html',
          			controller: 'regController'
        		}
		)
		.when (
			'/:reg',
				{
					templateUrl: 'templates/reg.html',
					controller: 'regController'
				}
		)
    .	otherwise(
    			{
					redirectTo: '/'
				}
    	);
});

// Инициализация сокета
eyeApp.run(function($rootScope, $websocket) {
	$rootScope.dataStream = $websocket("wss://newmedia.eyeinc.ru:84/one2many");
	$rootScope.methods = {
		get: function(){},
		enterChat: function(accessToken, idCorrespondent){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'enterChat',
				userId : idCorrespondent,
				access_token : accessToken
			}));
		},
		exitChat: function (accessToken, idCorrespondent) {
			$rootScope.dataStream.send(JSON.stringify({
				id : 'exitChat',
				userId : idCorrespondent,
				access_token : accessToken
			}));
		},
		chatTyping: function(accessToken,receiverId){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'chatTyping',
				access_token : accessToken,
				userId : receiverId
			}));
		},
		sendChatMessage: function (accessToken, receiverId, typeFile,message,messageAttachment,order) {
			let request = JSON.stringify({
				id : 'sendmessagetest',
				access_token : accessToken,
				userId : receiverId,
				type_file : typeFile,
				message : message,
				message_attachment : messageAttachment,
				order : order
			});
			$rootScope.dataStream.send(request);
		},
		translationStart: function(accessToken,sdpOffer,cameraId){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'translationStart',
				access_token : accessToken,
				sdpOffer : sdpOffer,
				cameraId : cameraId
			}));
		},
		translationStop: function(accessToken){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'translationStop',
				access_token : accessToken
			}));
		},
		sendIceCandidate: function(accessToken,candidate,cameraId){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'onIceCandidate',
				candidate : candidate,
				access_token : accessToken,
				cameraId : cameraId
			}));
		},
		sendComment: function(accessToken,ownerId,comment){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'sendComment',
				access_token : accessToken,
				userId : ownerId,
				comment : comment
			}));
		},
		callToUser: function(accessToken,calleeId,sdpOffer){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'callToUser',
				access_token : accessToken,
				userId : calleeId,
				sdpOffer : sdpOffer
			}));
		},
		sendResponse: function(response,accessToken,callId,sdpOffer){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'sendResponse',
				access_token : accessToken,
				callId : callId,
				sdpOffer : sdpOffer
			}));
		},
		endCall: function(status,accessToken,callId){
			$rootScope.dataStream.send(JSON.stringify({
				id : 'endCall',
				access_token : accessToken,
				callId : callId,
				status : status
			}));
		},
		iceCandidateVideoCall : function(candidate,accessToken){
			$rootScope.dataStream.send(JSON.stringify({
				id : "onIceCandidateTest",
				access_token : accessToken,
				candidate : candidate
			}));
		},
		getCameraId : function(accessToken){
			$rootScope.dataStream.send(JSON.stringify({
				id : "getCameraId",
				access_token : accessToken
			}));
		},
		viewerStart : function (accessToken,sdpOffer,cameraId) {
			$rootScope.dataStream.send(JSON.stringify({
				id : "viewer",
				access_token : accessToken,
				sdpOffer : sdpOffer,
				cameraId : cameraId
			}));
		},
		disconnectViewer : function (accessToken) {
			$rootScope.dataStream.send(JSON.stringify({
				id : "disconnectViewer",
				access_token : accessToken
			}));
		},
		enterViewer : function (accessToken,presenterId){
			$rootScope.dataStream.send(JSON.stringify({
				id : "enterViewer",
				access_token : accessToken,
				userId : presenterId
			}));
		},
		exitViewer : function (accessToken,presenterId){
			$rootScope.dataStream.send(JSON.stringify({
				id : "exitViewer",
				access_token : accessToken,
				userId : presenterId
			}));
		},
		sendChangeQuality : function (accessToken,cameraId,quality){
			$rootScope.dataStream.send(JSON.stringify({
				id : "sendChangeQuality",
				access_token : accessToken,
				quality : quality,
				cameraId : cameraId
			}));
		}

	};

	$rootScope.obj = {
		webSocket : $rootScope.dataStream,
		methods : $rootScope.methods
	};
})

function Socket(){
  angular.extend(this);
}

Socket.prototype = {
  init: function($websocket){
    this.dataStream = $websocket("wss://newmedia.eyeinc.ru:84/one2many");
    this.methods = {
    get: function(){},
	enterChat: (accessToken, idCorrespondent)=>{
		this.dataStream.send(JSON.stringify({
				id : 'enterChat',
				userId : idCorrespondent,
				access_token : accessToken
			}));
		},
	exitChat:  (accessToken, idCorrespondent) =>{
			this.dataStream.send(JSON.stringify({
				id : 'exitChat',
				userId : idCorrespondent,
				access_token : accessToken
			}));
		},
	chatTyping: (accessToken,receiverId)=>{
			this.dataStream.send(JSON.stringify({
				id : 'chatTyping',
				access_token : accessToken,
				userId : receiverId
			}));
		},
	sendChatMessage:  (accessToken, receiverId, typeFile,message,messageAttachment,order)=> {
			let request = JSON.stringify({
				id : 'sendmessagetest',
				access_token : accessToken,
				userId : receiverId,
				type_file : typeFile,
				message : message,
				message_attachment : messageAttachment,
				order : order
			});
			this.dataStream.send(request);
		},
	translationStart: (accessToken,sdpOffer,cameraId) =>{
			this.dataStream.send(JSON.stringify({
				id : 'translationStart',
				access_token : accessToken,
				sdpOffer : sdpOffer,
				cameraId : cameraId
			}));
		},
	translationStop: (accessToken)=>{
			this.dataStream.send(JSON.stringify({
				id : 'translationStop',
				access_token : accessToken
			}));
		},
	sendIceCandidate: (accessToken,candidate,cameraId)=>{
			this.dataStream.send(JSON.stringify({
				id : 'onIceCandidate',
				candidate : candidate,
				access_token : accessToken,
				cameraId : cameraId
			}));
		},
	sendComment: (accessToken,ownerId,comment)=>{
			this.dataStream.send(JSON.stringify({
				id : 'sendComment',
				access_token : accessToken,
				userId : ownerId,
				comment : comment
			}));
		},
	callToUser: (accessToken,calleeId,sdpOffer)=>{
			this.dataStream.send(JSON.stringify({
				id : 'callToUser',
				access_token : accessToken,
				userId : calleeId,
				sdpOffer : sdpOffer
			}));
		},
	sendResponse: (response,accessToken,callId,sdpOffer)=>{
			this.dataStream.send(JSON.stringify({
				id : 'sendResponse',
				access_token : accessToken,
				callId : callId,
				sdpOffer : sdpOffer
			}));
		},
	endCall: (status,accessToken,callId)=>{
			this.dataStream.send(JSON.stringify({
				id : 'endCall',
				access_token : accessToken,
				callId : callId,
				status : status
			}));
		},
	iceCandidateVideoCall : (candidate,accessToken)=>{
			this.dataStream.send(JSON.stringify({
				id : "onIceCandidateTest",
				access_token : accessToken,
				candidate : candidate
			}));
		},
	getCameraId : (accessToken)=>{
			this.dataStream.send(JSON.stringify({
				id : "getCameraId",
				access_token : accessToken
			}));
		},
	viewerStart :  (accessToken,sdpOffer,cameraId) =>{
			this.dataStream.send(JSON.stringify({
				id : "viewer",
				access_token : accessToken,
				sdpOffer : sdpOffer,
				cameraId : cameraId
			}));
		},
	disconnectViewer :  (accessToken) =>{
			this.dataStream.send(JSON.stringify({
				id : "disconnectViewer",
				access_token : accessToken
			}));
		},
	enterViewer :  (accessToken,presenterId)=>{
			this.dataStream.send(JSON.stringify({
				id : "enterViewer",
				access_token : accessToken,
				userId : presenterId
			}));
		},
	exitViewer :  (accessToken,presenterId)=>{
			this.dataStream.send(JSON.stringify({
				id : "exitViewer",
				access_token : accessToken,
				userId : presenterId
			}));
		},
	sendChangeQuality :  (accessToken,cameraId,quality)=>{
			this.dataStream.send(JSON.stringify({
				id : "sendChangeQuality",
				access_token : accessToken,
				quality : quality,
				cameraId : cameraId
			}));
		}
    };
  }
};

Socket.get = function(){
  return new Socket();
};

eyeApp.factory("socketService",function(){
  return{
    get : Socket.get
  }
});

// Главный контроллер приложения
eyeApp.controller("mainController", function($http, $scope, $window, $translate, $location){

	// Переменные
	$scope.isClose = true;
	$scope.currentStep = 0;
	$scope.isShowAccountPanel = false;
	$scope.isShowTop = false;
	$scope.isStartTranslation = false;

	if($location.search().reg) {
		$scope.isClose = false;
		$location.url('reg')
	}

	/**
	 * Показывает текущий шаг формы
	 * @param {int} step - индекс шага 
	 */
	$scope.showStep = function(step) {
		var x = document.getElementsByClassName("step");
		x[step].style.display = "block";
		if(step == 0) {
			angular.element("#prev").css("display", "none");
		} else {
			angular.element("#prev").css("display", "inline-block");
		}
		
		if(step == (x.length-1)) {
			angular.element("#prev").css("display", "none");
		} else {
			angular.element(".step button").css("visibility", "visible");
	  }
	}

	/**
	 * Переходит к следующему шагу
	 * @param {int} step - индекс следующего шага 
	 */
	$scope.nextStep = function(step) {
		var x = document.getElementsByClassName("step");
		x[$scope.currentStep].style.display = "none";
		$scope.currentStep = $scope.currentStep + step;
		if($scope.currentStep >= x.length) {
			return false;
		}
		$scope.showStep($scope.currentStep);
	}

	/**
	 * Переводит содержимое сайта на язык, код которого передан в параметре
	 * @param {*} langKey - код языка для перевода
	 */
	$scope.setLang = function(langKey) {
		// You can change the language during runtime
		$translate.use(langKey);
	};
	
	/**
	* Запрашивает повторную отправку смс с кодом
	*/
	$scope.makeCodeRequest = function() {
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=rememberPasswordStart",
			method: "GET",
			params: {login: $scope.login},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '/'
			}
			}).then(function(result){
				alert("СМС с кодом отправлено");
			});
		}

	/**
	 * Закрывает элемент на странице
	 * @param {bool} toggle - true - показывать элемент, false - скрыть элемент
	 * @param {bool} isReload - перезагрузить страницу после закрытия
	 */
	$scope.toggleElement = function(toggle, isReload) {
		$scope.isClose = toggle;		
		if(isReload) {
			$window.location.href = '/';
		}

		$scope.isShowTop = false;
	}

	/**
	 * Показывает/скрывает левую панель и топ, если он открыт
	 */
	$scope.showAccountPanel = function() {
		$scope.isShowAccountPanel = !$scope.isShowAccountPanel;
		$scope.isShowTop = false;
		$scope.isOpenChat = false;

		// При закрытии боковой панели закрываем инофрмационную
		if(!$scope.isShowAccountPanel) {
			$scope.panelType = false;
			angular.element("#userPanel nav ul").removeAttr('data-clicked');
			angular.element("footer").show();
		} 

		// Меняем иконки при открытии/закрытии топа
		if($scope.isShowTop) {
			angular.element(".openToggle i").removeClass('icon-eye-closetop');
			angular.element(".openToggle i").addClass('icon-eye-opentop');
		} else {
			angular.element(".openToggle i").removeClass('icon-eye-opentop');
			angular.element(".openToggle i").addClass('icon-eye-closetop');
		}
	}

	/**
	 * Показывает/скрывает топ
	 */
	$scope.showTop = function() {
		$scope.isShowTop = !$scope.isShowTop;
		$scope.userId = false;
		$scope.panelType = false;
		$scope.modalType = false;
		angular.element("#userPanel nav ul").removeAttr('data-clicked');
		map.addListener('zoom_changed',function() {
	   		getMarkers(map);
		});
		if($scope.isShowTop) {
			$scope.isShowAccountPanel = false;
			angular.element(".openToggle i").removeClass('icon-eye-closetop');
			angular.element(".openToggle i").addClass('icon-eye-opentop');
		} else {
			angular.element(".openToggle i").removeClass('icon-eye-opentop');
			angular.element(".openToggle i").addClass('icon-eye-closetop');
		}
	}

	/**
	 * Обновляет access token
	 * @param {function} callback 
	 */
	$scope.refreshAccessToken = function(callback){
		$http({
			url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=refreshaccesstoken",
			method: "POST",
			data: $.param({"refresh_token" : localStorage.getItem("refresh_token"),"client_id" : "web", "client_secret" : "EvZ5pWaVAhvC7laJdFNTNsrQLNaeF2"}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function(result) {
			if (result.data.success){
				var auth = result.data.auth;
				localStorage.setItem("access_token",auth.access_token);
				localStorage.setItem("refresh_token",auth.refresh_token);
				callback(true);
			}
			else{
				callback(false);
			}
		}).catch(reject => {
			console.log(reject);
			callback(false);
		});
	}

	/**
	 * Возвращает полную информацию о пользователе 
	 * @param {*} id - id пользователя, данные которого нужно получить
	 */
	$scope.getUserDataById = function(id) {
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getUserPage",
			method: "GET",
			params: {id: id},
		}).then(function(result){
			for(var prop in result.data.profile.followeTo) {
				if(result.data.profile.followeTo[prop]['id'] == localStorage.getItem("user_id")) {
					$scope.isSubscirbe = "подписан на вас";
					break;
				}
			}
			for(var prop in result.data.profile.followeMe) {
				if(result.data.profile.followeMe[prop]['id'] == localStorage.getItem("user_id")) {
					$scope.isFollow = true;
					break;
				} else {
					$scope.isFollow = false;
				}
			}


			$scope.userId = result.data.profile.id;
			$scope.userAvatar = result.data.profile.avatar;
			$scope.userType = result.data.profile.type;
			$scope.userName = result.data.profile.name;
			$scope.isOnline = result.data.profile.online;
			$scope.userLikes = result.data.profile.likes;
			$scope.userFollowers = result.data.profile.followeMe.length;
			$scope.userFavorites = result.data.profile.followeTo.length;
			
			if(result.data.profile.translation == '0') {
				$scope.notTranslate = true;
			} else {
				$scope.notTranslate = false;
			}

			  
			$scope.getWallByUserId(id);
			$scope.getFavoritesByUserId(id);
			$scope.getFollowersByUserId(id);			

		})
	}

	/**
	 * Открывает/закрывает трансляцию в браузере
	 * @param {*} isStartTranslation  - открыть/закрыть видео
	 * @param {*} type - тип транслируемого пользователя (Presenter - владелец трансляции; Viewer - зритель)
	 * @param {*} userType - тип транслируемого пользователя (0 - место, 1 - пользователь, 2 - заведение (бизнес))
	 * @param {*} cameraId - id камеры c которой ведется трансляция
	 * @param {*} accountProfileId - id пользователя
	 * @param {*} cameraClient - откуда ведется трансляция (веб, устройство)
	 */
	$scope.startTranslation = function(isStartTranslation, type, userType, cameraId, accountProfileId, cameraClient) {
		$scope.isStartTranslation = isStartTranslation;
		
		// Закрываем чат, панели и пр
		$scope.isOpenChat = false;
		$scope.isShowTop = false;
		$scope.isShowAccountPanel = false;
		$scope.panelType = false;

		// Подготавливаем параметры для трансляции
		$scope.translationType = type;
		$scope.userType = userType;
		$scope.cameraId = cameraId;
		$scope.ownerId = accountProfileId;
		$scope.cameraClient = cameraClient;

		if($scope.translationType == 'Presenter') {
			$scope.userId = '';
		}
	}

	/*
	** Показыает транлсяцию пользователя (просмотр) 
	*/
	$scope.enterUserTranslation = function(id) {
		$http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getUserPage",
            method: "GET",
            params: {id: id}
        }).then(function successCallback(result){
			$scope.userTranslationName = result.data.profile.name;
			$scope.cameraClient = result.data.profile.cameras[0].client;
			$scope.userTranslationId = result.data.profile.id;
			$scope.ownerId = id;
			$scope.cameras = result.data.profile.cameras;
			if($scope.userTranslationType == 0) {
				alert("Просмотр трансляций уличных камер возможен только через приложение");
				return;
			}
			$scope.startTranslation(true,"Viewer", $scope.userTranslationType, $scope.cameras[0].id, $scope.userTranslationId, $scope.cameraClient);
		}, function errorCallback(response){
			if(response.status == 401) {
				alert("Вы должны авторизоваться для просмотра трансляций")
			}
		});
	}

})

/**
* Создание директивы для информационных списков (подписчики, избранные, диалоги)
*/
eyeApp.directive("panel", function(){
	return {
		restrict: "E",
		replace: true,
		link: function(scope, element, attrs) {
			scope.showPanel = function(panelType) {
				switch (panelType) {
					case 'dialogs':
						scope.panelType = 'templates/directives/dialogs.html';

						if(!angular.element("#panel").hasClass("ng-hide")) {

							if(isMobileDevice()) {
								angular.element("#chat").css({
									'marginLeft': MOBILELEFTASIDEWIDTH,
									'width': angular.element("body").outerWidth() - MOBILELEFTASIDEWIDTH - RIGHTASIDEWIDTH
								})	
							} else {
								angular.element("#chat").css({
									'marginLeft': LEFTASIDEWIDTH,
									'width': angular.element("body").outerWidth() - LEFTASIDEWIDTH - RIGHTASIDEWIDTH				
								})
							}

						} else {
							if(isMobileDevice()) {
								angular.element("#chat").css({
									'marginLeft': MOBILELEFTASIDEWIDTH + INFOPANELWIDTH,
									'width': angular.element("body").outerWidth() - MOBILELEFTASIDEWIDTH - INFOPANELWIDTH - RIGHTASIDEWIDTH
								})	
							} else {
								angular.element("#chat").css({
									'marginLeft': LEFTASIDEWIDTH + INFOPANELWIDTH,
									'width': angular.element("body").outerWidth() - LEFTASIDEWIDTH - INFOPANELWIDTH - RIGHTASIDEWIDTH				
								})
							}
						}
						scope.getChatList();
						break;
					case 'cameras':
						scope.panelType = 'templates/directives/cameras.html';
						scope.isOpenChat = false;
						scope.getMyCameras();
						break;
					case 'favorites':
						scope.panelType = 'templates/directives/favorites.html';
						scope.isOpenChat = false;
						scope.getMyFavorites();
						break;
					case 'followers':
						scope.panelType = 'templates/directives/followers.html';
						scope.isOpenChat = false;
						scope.getMyFollowers();
						break;
					case 'wall':
						scope.panelType = 'templates/directives/wall.html';
						scope.isOpenChat = false;
						break;
					case 'settings':
						scope.panelType = 'templates/directives/settings.html';	
						scope.isOpenChat = false;
						break;
					case 'search':
						scope.panelType = 'templates/directives/search.html';
						scope.isOpenChat = false;
						break;
				}
			}
		},
		template: "<div data-ng-include='panelType' data-ng-if='panelType' data-ng-cloak></div>",
		controller: "userController"
	}
})

/**
 * Директивы для модальных окон в приложении
 */
eyeApp.directive("modal", function(){
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		link: function(scope, element, attrs) {
			scope.showModal = function(modalType) {
				scope.isClose = false;
				scope.panelType = false;
				scope.isOpenChat = false;
				scope.isShowTop = false;
				switch(modalType) {
					case 'addCamera':
						scope.modalType = 'templates/directives/addCamera.html';
						break;
					case 'settings':	
						scope.modalType = 'templates/directives/settings.html';
						break;
					case 'download':
						scope.modalType = 'templates/directives/download.html';
						break;		
				}
			}
		},
		template: "<div data-ng-if='modalType && !isClose' data-ng-cloak><button data-ng-click='toggleElement(true, false)'>&times;</button><div class='modalWrapper' data-ng-include='modalType'></div></div>",
		controller: "userController"
	}
})

/**
 * Директивы для lightbox
 */
eyeApp.directive("lightbox", function(){
	return {
		restrict: "E",
		replace: true,
		transclude: true,
		link: function(scope, element) {
			scope.openLightBox = function(source) {
				scope.isOpenLightBox = true;
				scope.isClose = false;
				scope.source = source;
			}
			
		},
		templateUrl: "templates/directives/lightbox.html",
	}
})

eyeApp.directive('file', function(){
	return {
		restrict: "A",
		link: function(scope,element) {
			element.bind('change', function(event){
				var file = event.target.files[0];
				var str;
				var reader = new FileReader();
				if(file) {
					reader.readAsDataURL(file);
				} else {
					angular.element("#newAvatar").removeAttr("src");
					angular.element("#newAvatar").hide();
				}
				
				reader.onloadend = function() {
			
					var $image = angular.element("#newAvatar");
					$image.css("display", "block");
					$image.attr("src", reader.result);
					$image.cropper('destroy');

					$image.cropper({
						aspectRatio: 4 / 3,
						viewMode: 3,
						cropBoxResizable:false,
						dragMode: 'move',
						toggleDragModeOnDblclick: false,
						crop: function(event) {
							str = cropper.getCroppedCanvas({width:640, height: 480}).toDataURL();
							scope.base64 = str;
						}
					});
					var cropper = $image.data('cropper');		
				}
			})
		}
	}
})