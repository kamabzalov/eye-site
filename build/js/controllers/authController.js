"use strict";eyeApp.controller("authController",function($scope,$http,$window){$scope.auth=function(){if(""==$.trim($scope.login)||"undefined"==$scope.login||""==$.trim($scope.password)||"undefined"==$scope.password)return angular.element("form[name=auth] input").addClass("ng-invalid"),void alert("Логин или пароль не могут быть пустыми");$scope.login=$scope.login.replace(/\(|\)|-/g,""),$http({url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=authorize",method:"POST",data:$.param({login:$scope.login,password:$scope.password,client_id:"web",client_secret:"EvZ5pWaVAhvC7laJdFNTNsrQLNaeF2"}),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(result){result.data.success?(angular.element("form[name=auth] input").addClass("success"),localStorage.setItem("access_token",result.data.auth.access_token),localStorage.setItem("refresh_token",result.data.auth.refresh_token),localStorage.setItem("expires_in",result.data.auth.expires_in),localStorage.setItem("user_id",result.data.profile.id),$scope.accountId=result.data.profile.id,$window.location.href="/"):alert("Произошла ошибка. Попробуйте еще раз")}).catch(function(err){alert("Неверный логин или пароль"),angular.element("form[name=auth] input").addClass("ng-invalid")})},$scope.startRemember=function(){if(""==$.trim($scope.login)||"undefined"==$scope.login)return angular.element("form[name='rememberPassForm'] input").addClass("ng-invalid"),void alert("Логин не может быть пустыми");$scope.login=$scope.login.replace(/\(|\)|-/g,""),$http({url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=rememberPasswordStart",method:"GET",params:{login:$scope.login},headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"/"}}).then(function(result){result.data.success?(angular.element("form[name='rememberPassForm'] input").addClass("success"),$scope.nextStep(1)):(angular.element("form[name='rememberPassForm'] input").addClass("ng-invalid"),alert("Пользователь с таким логином не найден"))})},$scope.middleRemember=function(){if(""==$.trim($scope.code)||"undefined"==$scope.code)return angular.element("form[name='rememberPassForm'] input").addClass("ng-invalid"),void alert("Введен неверный код");$http({url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=rememberPasswordFinish",method:"GET",params:{login:$scope.login,code:$scope.code},headers:{"Content-Type":"application/x-www-form-urlencoded",Accept:"/"}}).then(function(result){result.data.success?(angular.element("form[name='rememberPassForm'] input").addClass("success"),localStorage.setItem("hash",result.data.hash),$scope.nextStep(1)):(angular.element("form[name='rememberPassForm'] input").addClass("ng-invalid"),alert("Произошла ошибка при вводе кода. Попробуйте еще раз"))})},$scope.changePass=function(){if(""==$.trim($scope.newpassword)||"undefined"==$scope.newpassword)return angular.element("form[name='rememberPassForm'] input").addClass("ng-invalid"),void alert("Пароль не может быть пустым");$http({url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=change_password",method:"GET",params:{hash:localStorage.getItem("hash"),newpassword:$scope.newpassword}}).then(function(result){result.data.success&&(alert("Вы успешно изменили ваш пароль"),$window.location.href="/")})}});