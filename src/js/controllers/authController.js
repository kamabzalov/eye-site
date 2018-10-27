eyeApp.controller("authController", function($scope, $http, $window){

	/**
	 * Авторизует пользователя по логину/паролю
	 */
    $scope.auth = function() {
		if($.trim($scope.login) == '' || $scope.login == 'undefined' || $.trim($scope.password) == '' || $scope.password == 'undefined') {
			angular.element("form[name=auth] input").addClass('ng-invalid');
			alert("Логин или пароль не могут быть пустыми");
			return;
		}
		$scope.login = $scope.login.replace(/\(|\)|-/g, "");
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=authorize",
			method: "POST",
			data: $.param({login: $scope.login, password: $scope.password, client_id: "web", client_secret: "EvZ5pWaVAhvC7laJdFNTNsrQLNaeF2"}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function(result){
			if(result.data.success) {
				angular.element("form[name=auth] input").addClass('success');
				localStorage.setItem('access_token', result.data.auth.access_token);
    			localStorage.setItem('refresh_token', result.data.auth.refresh_token);
    			localStorage.setItem('expires_in', result.data.auth.expires_in);
    			localStorage.setItem('user_id', result.data.profile.id);
        		$scope.accountId = result.data.profile.id;
				$window.location.href = '/';
			} else {
				alert("Произошла ошибка. Попробуйте еще раз");
			}
		}).catch(function(err){
			alert("Неверный логин или пароль");
			angular.element("form[name=auth] input").addClass('ng-invalid');
		});

	}

	/**
	 * Проверяет пользователя с введенным логином (первый шаг формы)
	 */
	$scope.startRemember = function() {
		if($.trim($scope.login) == '' || $scope.login == 'undefined') {
			angular.element("form[name='rememberPassForm'] input").addClass('ng-invalid');
			alert("Логин не может быть пустыми");
			return;
		}
		$scope.login = $scope.login.replace(/\(|\)|-/g, "");
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=rememberPasswordStart",
			method: "GET",
			params: {login: $scope.login},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '/'
			}
		}).then(function(result){
			if(!result.data.success) {
				angular.element("form[name='rememberPassForm'] input").addClass('ng-invalid');
				alert("Пользователь с таким логином не найден");
			} else {
				angular.element("form[name='rememberPassForm'] input").addClass('success');
    			$scope.nextStep(1);
			}
		});
	}

	/**
	 * Проверяет введенный код с тем, который пришел в смс (второй шаг формы)
	 */
	$scope.middleRemember = function() {
		if($.trim($scope.code) == '' || $scope.code == 'undefined') {
			angular.element("form[name='rememberPassForm'] input").addClass('ng-invalid');
			alert("Введен неверный код");
			return;
		}
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=rememberPasswordFinish",
			method: "GET",
			params: {login: $scope.login, code: $scope.code},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '/'
			}
		}).then(function(result){
			if(!result.data.success) {
				angular.element("form[name='rememberPassForm'] input").addClass('ng-invalid');
				alert("Произошла ошибка при вводе кода. Попробуйте еще раз");
			} else {
				angular.element("form[name='rememberPassForm'] input").addClass('success');
				localStorage.setItem('hash', result.data.hash);
    			$scope.nextStep(1);
			}
		});

	  }
	  
	/**
	 * Изменяет пароль на введенный пользователем
	 */
	$scope.changePass = function () {
	  if($.trim($scope.newpassword) == '' || $scope.newpassword == 'undefined') {
		angular.element("form[name='rememberPassForm'] input").addClass('ng-invalid');
		alert("Пароль не может быть пустым");
		return;
	  }
	  $http({
		  url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=change_password",
		  method: "GET",
		  params: {hash: localStorage.getItem('hash'), newpassword: $scope.newpassword},
	  }).then(function(result){
		  if(result.data.success) {
			  alert("Вы успешно изменили ваш пароль");
			  $window.location.href = '/';
		  }
	  });
  }

});