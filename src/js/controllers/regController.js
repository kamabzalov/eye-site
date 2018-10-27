eyeApp.controller("regController", function($scope, $http, $window){

    /**
     * Проверяет номер телефона для регистрации (первый шаг регистрации)
     */
    $scope.startReg = function() {
		if(!$.trim($scope.phone)) {
			angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
            alert("Некорректный ввод номера телефона");
			return;
		}
		$scope.phone = $scope.phone.replace(/\(|\)|-/g, "");

		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerTestStart",
			method: "GET",
			params: {phone: $scope.phone},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '/'
			}
		}).then(function(result){
			if(!result.data.success) {
				alert("Произошла ошибка. Возможно такой номер уже зарегистрирован");
				angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
			} else {
				$scope.nextStep(1);
			}
		});
    } ;
      
    /**
     * Проверяет корректность введенного кода с кодом из смс (второй шаг регистрации)
     */
    $scope.middleReg = function() {
	    if(!$.trim($scope.code)) {
			angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
			return;
		}
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerTestMiddle",
			method: "GET",
			params: {phone: $scope.phone, code: $scope.code},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': '/'
			}
		}).then(function(result){
			if(!result.data.success) {
				alert("Введенный вами код неверен");
				angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
			} else {
				angular.element("form[name='userRegForm'] input").addClass('success');
				localStorage.setItem('id', result.data.identify);
				$scope.nextStep(1);
			}
		});
    };
      
    /**
     * Регистрирует пользователя (последний шаг)
     */
    $scope.finishReg = function() {
		if($.trim($scope.name) == '' || $scope.name == 'undefined') {
			angular.element("form[name='userRegForm'] input").removeClass('success');
			angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='userRegForm'] input").removeClass('ng-invalid');
			angular.element("form[name='userRegForm'] input").addClass('success');
		}
		if($.trim($scope.password) == '' || $scope.password == 'undefined') {
			angular.element("form[name='userRegForm'] input").removeClass('success');
			$("form[name='userRegForm'] input").addClass('error');
			return;
		} else {
			angular.element("form[name='userRegForm'] input").removeClass('ng-invalid');
			angular.element("form[name='userRegForm'] input").addClass('success');
		}
		if($.trim($scope.email) == '' || $scope.email == 'undefined') {
			angular.element("form[name='userRegForm'] input").removeClass('success');
			angular.element("form[name='userRegForm'] input").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='userRegForm'] input").removeClass('ng-invalid');
			angular.element("form[name='userRegForm'] input").addClass('success');
		}

		var file = document.querySelector('input[type=file]').files[0];
		if(typeof file == 'undefined') {
			angular.element("span.icon-eye-plus").addClass('ng-touched ng-invalid');
			return;
		}

		makeBase64(file,(avatar) => {
        	var fd = new FormData();
        	fd.append("id",localStorage.getItem('id'));
        	fd.append("name",$scope.name);
        	fd.append("password",$scope.password);
        	fd.append("email",$scope.email);
        	fd.append("avatar",avatar);

        	$http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerTestFinish", fd, {
          		withCredentials: false,
          		headers: {
            		'Content-Type': undefined
          		},
          		transformRequest: angular.identity,
          		params: {fd}
  			}).then(function(result) {
				localStorage.setItem("access_token", result.data.token.auth.access_token);
				$scope.getAuthUserPage();
				$window.location.href = '/';	
			});
  		});
	}


	// Регистрация заведений

	/**
	 * Проверяет телефон и email для регистрации заведения
	 */
	$scope.startCompanyReg = function() {
		if($.trim($scope.phone) == '' || $scope.phone == 'undefined') {
			angular.element("form[name='companyRegForm'] input").removeClass('success');
			angular.element("form[name='companyRegForm'] input").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input").addClass('success');
		}
		if($.trim($scope.email) == '' || $scope.email == 'undefined') {
			angular.element("form[name='companyRegForm'] input").removeClass('success');
			angular.element("form[name='companyRegForm'] input").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input").addClass('success');
		}

		if($scope.isEmail) {
			$scope.isEmail = 1;
		} else {
			$scope.isEmail = 0;
		}
		$scope.phone = $scope.phone.replace(/\(|\)|-/g, "");
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerBuisnessStart",
			method: "GET",
			params: {phone: $scope.phone, email: $scope.email, isEmail: $scope.isEmail},
		}).then(function(result){
			if(!result.data.success) {
				angular.element("form[name='companyRegForm'] input").removeClass('success');
				angular.element("form[name='companyRegForm'] input").addClass('ng-invalid');
				alert("Произошла ошибка. Возможно, такой номер или email уже есть в нашей базе");
			} else {
				angular.element("form[name='companyRegForm'] input").removeClass('success');
				angular.element("form[name='companyRegForm'] input").removeClass('ng-invalid');
				$scope.nextStep(1);
			}

		});
	}

	/**
	 * Проверяет введенный проверочный код с кодом, присланным в смс
	 */
	$scope.middleCompanyReg = function() {
		if($.trim($scope.code) == '' || $scope.code == 'undefined') {
			angular.element("form[name='companyRegForm'] input").removeClass('success');
			angular.element("form[name='companyRegForm'] input").addClass('ng-invalid');
			return;
		}
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerBuisnessMiddle",
			method: "GET",
			params: {login: $scope.phone, code: $scope.code, isEmail: $scope.isEmail},
  		}).then(function(result){
			if(!result.data.success) {
				alert("Вы ввели неверный код");
			} else {
				angular.element("form[name='companyRegForm'] input").removeClass('success');
				angular.element("form[name='companyRegForm'] input").removeClass('ng-invalid');
        		localStorage.setItem('id', result.data.identify);
  				$scope.nextStep(1);
			}
  		});
	}
	 
	/**
	 * Регистрирует заведение (заключительный шаг)
	 */
	$scope.finishCompanyReg = function() {
		if($.trim($scope.company) == '' || $scope.company == 'undefined') {
			angular.element("form[name='companyRegForm'] input[name=company]").removeClass('success');
			angular.element("form[name='companyRegForm'] input[name=company]").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input[name=company]").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input[name=company]").addClass('success');
		}
		if($.trim($scope.password) == '' || $scope.password == 'undefined') {
			angular.element("form[name='companyRegForm'] input[name=password]").removeClass('success');
			angular.element("form[name='companyRegForm'] input[name=password]").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input[name=password]").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input[name=password]").addClass('success');
		}
		if($.trim($scope.repeatPassword) == '' || $scope.repeatPassword == 'undefined') {
			angular.element("form[name='companyRegForm'] input[name=repeatPassword]").removeClass('success');
			angular.element("form[name='companyRegForm'] input[name=repeatPassword]").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input[name=repeatPassword]").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input[name=repeatPassword]").addClass('success');
		}
		if($.trim($scope.calls) == '' || $scope.calls == 'undefined') {
			angular.element("form[name='companyRegForm'] input[name=calls]").removeClass('success');
			angular.element("form[name='companyRegForm'] input[name=calls]").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input[name=calls]").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input[name=calls]").addClass('success');
		}
		if($.trim($scope.address) == '' || $scope.address == 'undefined') {
			angular.element("form[name='companyRegForm'] input[name=address]").removeClass('success');
			angular.element("form[name='companyRegForm'] input[name=address]").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] input[name=address]").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] input[name=address]").addClass('success');
		}
		if($.trim($scope.category) == '' || $scope.category == 'undefined') {
			angular.element("form[name='companyRegForm'] #category").removeClass('success');
			angular.element("form[name='companyRegForm'] #category").addClass('ng-invalid');
			return;
		} else {
			angular.element("form[name='companyRegForm'] #category").removeClass('ng-invalid');
			angular.element("form[name='companyRegForm'] #category").addClass('success');
		}

		
		$scope.address = angular.element("#address").val();
		var file = document.querySelector('input[type=file]').files[0];
		if(typeof file == 'undefined') {
			angular.element("span.icon-eye-plus").addClass('ng-touched ng-invalid');
			return;
		}
		
      	makeBase64(file, (avatar) => {

			$scope.calls = $scope.calls.replace(/\(|\)|-/g, "");

			var fd = new FormData();
			fd.append("id",localStorage.getItem('id'));
			fd.append("name",$scope.company);
			fd.append("password",$scope.password);
		  	fd.append("email",$scope.email);
		  	fd.append("avatar",avatar);
		  	fd.append("address", $scope.address);
		  	fd.append("lat", localStorage.getItem("lat"));
		  	fd.append("lng", localStorage.getItem("lng"));
		  	fd.append("category", $scope.category);
			fd.append("calls", $scope.calls);


			$http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=registerBuisnessFinish", fd, {
        		withCredentials: false,
          		headers: {
            		'Content-Type': undefined
          		},
          		transformRequest: angular.identity,
          		params: {fd}
        	}).then(function(result){
				localStorage.setItem("access_token", result.data.token.auth.access_token);
				$scope.nextStep(1);
        	});
  		});
	}

	$scope.authCompany = function() {
		$scope.getAuthUserPage();
		$window.location.href = '/';	
	}
});