eyeApp.controller("userController", function($scope, $http, $window, $rootScope, $websocket, $timeout){

	var currentTimeStr;

	/**
	 * Авторизует аккаунт в приложении
	 */
	$scope.getAuthUserPage = function() {
		$http({
			url:"https://api.eyeinc.ru/v0.9/index.php?c=api&m=getProfile",
			method: "GET",
      	}).then(function(result) {
      		$scope.accountProfileId = result.data.profile.id;
        	$scope.accountWatchers = result.data.profile.watchers;
        	$scope.accountFollowers = result.data.profile.followers;
        	$scope.accountLikes = result.data.profile.likes;
        	$scope.accountName = result.data.profile.name;
        	$scope.accountAvatar = result.data.profile.avatar;
			$scope.accountType = result.data.profile.type;
			$scope.accountUncheckedUsers = result.data.profile.unchecked;
			$scope.accountUnreaded = result.data.profile.unreaded;
			$scope.getWallByUserId($scope.accountProfileId);
      	}).catch(function(response){
	      	if (response.status === 401){
	        $scope.refreshAccessToken((success) =>{
	          if (success){
	            $scope.getAuthUserPage();
	          }
	          else{
	            $scope.logout();
	          }
	        });
	      }
	    });
    }
		
	// Авторизует пользователя повторно по истчениее refreshToken
    if(localStorage.getItem("access_token")) {
		$scope.getAuthUserPage();
    }
    
    /**
	 * Выходит из аккаунта
	 */
	$scope.logout = function() {
		localStorage.clear();
		$window.location.href = '/';
	}

	/**
	 * Возвращает список чатов авторизованного пользователя
	 */
	$scope.getChatList = function() {
		$http({
				url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getChatList",
				method: "GET",
		}).then(function(result){
			$scope.dialogs = result.data.list;
		});
	}

	/**
	 * Возвращает список избранных авторизованного пользователя
	 */
	$scope.getMyFavorites = function() {
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getFavoritesByUserId",
			method: "GET",
			params: {userId: localStorage.getItem("user_id")}
		}).then(function(result){
			$scope.myFavoritesList = result.data.followersTo;
		});
	}

	/**
	 * Возвращает список подписчиков авторизованного пользователя
	 */
	$scope.getMyFollowers = function() {
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getFollowersByUserId",
			method: "GET",
			params: {userId: localStorage.getItem('user_id')}
		}).then(function(result){
      	$scope.countFollowers = result.data.followersMe.length;
			$scope.myFollowersMe = result.data.followersMe;
		});
	}

	/**
	 * Поиск пользователя по логину/имени
	 * @param {*} searchRequest - критерий поиска (логин/имя)
	 */
	$scope.searchUsers = function(searchRequest) {
		$http({
  		  url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=searchUsers",
		  params: {username: searchRequest}
  		}).then(function(response){
			if(response.data.search.length > 0) {
  				$scope.results = response.data.search;
  			} else {
  				$scope.results = false;
  			}
  		}, function errorCallback(response) {
  	    		// TODO:
    		});
	}

	/**
	 * Возвращает список камер авторизованного заведения
	 */
	$scope.getMyCameras = function(){
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getMyCameras",
			method: "GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		}).then(function(result){
			$scope.camerasList = result.data.cameras;
		});
	}

	/**
	 * Добавляет новую камеру
	 */
	$scope.addNewCamera = function() {
		$http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=addStaticCamera",
            method: "POST",
            data: $.param({name: $scope.cameraName, uri: $scope.cameraURL}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(result){
            if(result.data.success) {
				alert("Камера успешно добавлена");
            } else {
                alert("Ошибка добавления камеры");
			}
			$scope.panelType = '';
			$scope.toggleElement(true);
        });
	}

	/**
	 * Удаляет камеру
	 * @param {*} id - id камеры для удаления
	 */
	$scope.deleteCamera = function(id) {
        $http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=deletecamera",
            method: "POST",
            data: $.param({id: id}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(result){
            if(result.data.success) {
                alert("Камера удалена");
            } else {
                alert("Ошибка удаления камеры");
            }
		});
		$scope.panelType = '';
        $scope.getMyCameras();
    }

	/**
	 * Возвращает стену пользователя по его id
	 * @param {*} id - идентификатор пользователя
	 */
	$scope.getWallByUserId = function(id) {
        if(!id) {
            id = localStorage.getItem('user_id');
        }
        $http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getWallByUserId",
            method: "GET",
            params: {userId: id}
        }).then(function(response){
            if(response.data.wall != null) {
                $scope.wallInformation = response.data.wall.information;
				$scope.wallImage = response.data.wall.url;
            }
        })
    }

	/**
	 * Создает стену авторизованного пользователя/заведения
	 */
	$scope.createWall = function() {
		var file = document.getElementById('wallCreateFile').files[0];
        makeBase64(file, (wallCreateAvatar) => {
            var fd = new FormData();
            fd.append("textInformation",$scope.wallCreateText);
			fd.append("imageInformation",wallCreateAvatar);

            $http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=createWall", fd, {
                withCredentials: false,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity,
                    params: {fd}
            }).then(function(response) {
                if(!response.data.success) {
					alert("Не удалось создать стену. Возможно, вы заполнили не все поля");
					return;
				} else {
					$window.location.reload();
				}
            });
        });
	}

	/**
	 * Обновляет стену авторизованного пользователя/заведения
	 */
	$scope.updateWall = function() {
        var updateFile = document.getElementById('wallUpdateFile').files[0];
        makeBase64(updateFile, (wallUpdateAvatar) => {
            var fd = new FormData();
            fd.append("textInformation",$scope.wallUpdateText);
            fd.append("imageInformation",wallUpdateAvatar);
            $http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=updateWall", fd, {
                withCredentials: false,
                    headers: {
                        'Content-Type': undefined
                    },
                transformRequest: angular.identity,
                params: {fd}
            }).then(function(response) {
				if(!response.data.success) {
					alert("Не удалось обновить стену. Возможно, вы заполнили не все поля");
					return;
				} else {
					$window.location.reload();
				}
            });
        });
	}

	/**
	 * Удаляет стену пользователя
	 */
	$scope.deleteWall = function() {
        $http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=deleteWall",
            method: "GET"
        }).then(function(response){
            $scope.wallInformation =  '';
			$scope.wallImage = '';
			alert("Вы успешно удалили вашу стену");
			$window.location.reload();
        });
	}
	
	/**
	 * Закрывает правую панель
	 */
	$scope.closeProfile = function() {
		$scope.userId = false;
		$scope.isOpenChat = false;
		$scope.startTranslation(false, 'Viewer');
	}

	/**
	 * Возвращает список избранных пользователей по ID
	 * @param {*} id - id пользователя
	 */
	$scope.getFavoritesByUserId = function(id) {
		if(!id) {
            id = localStorage.getItem('user_id');
        }
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getFavoritesByUserId",
			method: "GET",
			params: {userId: id}
		}).then(function successCallback(result){
			$scope.favoritesList = result.data.followersTo;
		}, function errorCallback(response){
			if(response.status == 401) {
				alert("Вы должны авторизоваться, чтобы просматривать данный аккаунт");
			}
		});
	}

	/**
	 * Возвращает список подписчиков по id
	 * @param {*} id - id пользователя
	 */
	$scope.getFollowersByUserId = function(id) {
		if(!id) {
            id = localStorage.getItem('user_id');
        }
		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getFollowersByUserId",
			method: "GET",
			params: {userId: id}
		}).then(function successCallback(result){
			$scope.followersList = result.data.followersMe;
		});
	}

	/**
	 * Подписаться на аккаунт
	 * @param {*} id - id аккаунта, на который подписывается пользователь
	 */
	$scope.subscribeToProfile = function(id) {
    	$http({
	      	url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=follow",
	      	method: "GET",
	      	headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		  	params: {id: id}
	    }).then(function successCallback(result){
            $scope.isFollow = result.data.follow;
			$scope.userFollowers = result.data.follower_count;
			$scope.getFollowersByUserId(id);
		}, function errorCallback(response){
			if(response.status == 401) {
				alert("Вы должны авторизоваться, чтобы подписаться на данный аккаунт");
			}
		});
	}

	/**
	 * Открывает чат с пользователем
	 * @param {*} isOpenChat - открыть/закрыть чат
	 * @param {*} userId - id собеседника
	 */
	$scope.openChat = function(isOpenChat, userId) {
		$scope.isOpenChat = !isOpenChat;
		$rootScope.obj.methods.enterChat(localStorage.getItem("access_token"), userId);
		if($scope.isOpenChat) { // если чат открыт
			angular.element("footer").hide();

			if(!angular.element("#panel").hasClass("ng-hide")) {

				if(!$scope.isShowAccountPanel) {
					$scope.isShowAccountPanel = true;
					angular.element("#chat").css({
						'marginLeft': LEFTASIDEWIDTH,
						'width': angular.element("body").outerWidth() - LEFTASIDEWIDTH - RIGHTASIDEWIDTH
					});
					angular.element("#chat input").css({
						'width': "85%"
					})
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
						});
					}
					angular.element("#chat input").css({
						'width': "65%"
					})
				} 

			} else {
				angular.element("#chat").css({
					'marginLeft': LEFTASIDEWIDTH,
					'width': angular.element("body").outerWidth() - LEFTASIDEWIDTH - RIGHTASIDEWIDTH
				});
				angular.element("#chat input").css({
					'width': "70%"
				})

				if(isMobileDevice()) {
					angular.element("#chat").css({
						'marginLeft': MOBILELEFTASIDEWIDTH,
						'width': angular.element("body").outerWidth() - MOBILELEFTASIDEWIDTH - RIGHTASIDEWIDTH
					})
				} 
			} 

		} else {
			angular.element("footer").show();
		}
	}

	/**
	 * Возвращает историю переписки с пользователем
	 * @param {*} userId - id собеседника
	 */
   $scope.getChatWithUser = function(userId) {

		$timeout(function() {        
			var music = document.querySelectorAll('*[id^="music-"]');
			var pButton = document.querySelectorAll('*[id^="pButton-"]'); 
			var playhead = document.querySelectorAll('*[id^="playhead-"]');
			var timeline = document.querySelectorAll('*[id^="timeline-"]');
			var timer  = document.querySelectorAll('*[id^="timer-"]');

			pButton.forEach(function(item, i, arr) {

				var timelineWidth = 156;
				pButton[i].addEventListener("click", play);
				music[i].addEventListener("timeupdate", timeUpdate, false);

				if(Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60) < 10)) {
					currentTimeStr = Math.floor(music[i].duration/60) + ":0" + Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60)); 
				} else {
					currentTimeStr = Math.floor(music[i].duration/60) + ":" + Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60));
				}
				timer[i].innerHTML = currentTimeStr;

				timeline[i].addEventListener("click", function(event) {
					moveplayhead(event);
					music[i].currentTime = music[i].duration * event.clientX - timeline[i].getBoundingClientRect().left / timelineWidth;
				}, false);

				playhead[i].addEventListener('mousedown', mouseDown, false);
				window.addEventListener('mouseup', mouseUp, false);

				var onplayhead = false;

				function mouseDown() {
					onplayhead = true;
					window.addEventListener('mousemove', moveplayhead, true);
					music[i].removeEventListener('timeupdate', timeUpdate, false);
				}

				function mouseUp(event) {
					if (onplayhead == true) {
						moveplayhead(event);
						window.removeEventListener('mousemove', moveplayhead, true);
						music[i].currentTime = music[i].duration * event.clientX - timeline[i].getBoundingClientRect().left / timelineWidth ;
						music[i].addEventListener('timeupdate', timeUpdate, false);
					}
					onplayhead = false;
				}


				function moveplayhead(event) {
					var newMargLeft = event.clientX - timeline[i].getBoundingClientRect().left;
					if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
						playhead[i].style.marginLeft = newMargLeft + "px";
					}
					if (newMargLeft < 0) {
						playhead[i].style.marginLeft = "0px";
					}
					if (newMargLeft > timelineWidth) {
						playhead[i].style.marginLeft = timelineWidth + "px";
					}
				}

				function play() {
					if (music[i].paused) {
						music[i].play();
						$("#" + pButton[i].id + " .icon-eye-play").toggleClass("icon-eye-pause");
					} else {
						music[i].pause();
						$("#" + pButton[i].id + " .icon-eye-play").toggleClass("icon-eye-pause");
					}
				}

				function timeUpdate() {
					var playPercent = timelineWidth * (music[i].currentTime / music[i].duration);
					playhead[i].style.marginLeft = playPercent + "px";
					if(Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60) < 10)) {
						currentTimeStr = Math.floor(music[i].duration/60) + ":0" + Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60)); 
					} else {
						currentTimeStr = Math.floor(music[i].duration/60) + ":" + Math.floor(music[i].currentTime - Math.floor(music[i].currentTime/60));
					}
					timer[i].innerHTML = currentTimeStr;
				}

				function clickPercent(event) {
					return (event.clientX - timeline[i].getBoundingClientRect().left) / timelineWidth;
				}
			});
		}, 2000);

		localStorage.setItem("time",0);

		$http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getChatWithUser",
			method: "GET",
			params: {id: userId, time:0}
		}).then(function(result){
			$scope.isScroll = (result.data.chat.length<50) ? false : true;
			for (var i =0;i<result.data.chat.length;i++){
				result.data.chat[i].receiver = (result.data.chat[i].from_user_id==localStorage.getItem("user_id")) ? false : true;
			}
		
			for(var j=0; j<result.data.chat.length - 1; j++) {
				result.data.chat[j].messagesDay = $scope.diffDate(result.data.chat[j].date_msg, result.data.chat[j+1].date_msg);
			}
		
			var temp = result.data.chat.reverse();
			$scope.messagesWithUser = temp;
			localStorage.setItem("time",result.data.time);
			localStorage.setItem("to_user_id",userId);
		});

		// Костыль для моментальной прокрутки чата вниз
		angular.element("#chat ul").animate({scrollTop: "10000px"},'fast');
	}

	/**
	 * Определяет дату сообщения
	 * @param {*} date1 - вчерашний день
	 * @param {*} date2 - текущий день
	 */
	$scope.diffDate = function(date1, date2){
        var dateOut1 = new Date(date1 * 1000);
        var dateOut2 = new Date(date2 * 1000);
        var diff = dateOut2.getDate() - dateOut1.getDate();
        return (diff != 0) ? $scope.getDateAndMonth(dateOut1) : 0;
	};
	
	/**
	 * Возвращает полную дату переписки в формате "число месяц"
	 * @param {*} date1 - день переписки
	 */
	$scope.getDateAndMonth = function(date1){
        const MONTHS = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];
        const month = MONTHS[date1.getMonth()];
        const day = date1.getDate();
        return day+" "+month;
	};

	$scope.changePassword = function() {
		$http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=new_password",
            method: "POST",
            data: $.param({oldpassword: $scope.oldpassword, newpassword: $scope.newpassword}),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(result){
            if(result.data.success) {
				alert("Ваш пароль успешно изменен");
            } else {
				alert("Произошла ошибка");
			}
			$scope.toggleElement(true, false);
		});
	}

	$scope.changePersonalData = function() {
		var fd = new FormData();
		if(typeof $scope.login == 'undefined') {
			$scope.login = $scope.$parent.accountName;
		}
		if($scope.base64) {
			var arr = $scope.base64.split(',');
			urltoFile($scope.base64, 'avatar', arr[0].split(":")[1].split(";")[0])
			.then(function(file){
				fd.append("AVATAR",file);
				fd.append("name",$scope.login);

				$http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=change_profile", fd, {
					withCredentials: false,
          			headers: {
            			'Content-Type': undefined
          			},
          			transformRequest: angular.identity,
          			params: {fd}
				}).then(function(result){
					$scope.modalType = '';
					$window.location.reload();
				})
			})
		} else {
			fd.append("name",$scope.login);
			$http.post("https://api.eyeinc.ru/v0.9/index.php?c=api&m=change_profile", fd, {
				withCredentials: false,
          		headers: {
            		'Content-Type': undefined
          		},
          		transformRequest: angular.identity,
          		params: {fd}
			}).then(function(result){
				$scope.modalType = '';
				$window.location.reload();
			})
		}
	}
});