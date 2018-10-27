eyeApp.controller("chatController", function($scope, $http, $rootScope, $sce){

    $scope.chatMessages = [];
    $scope.chatMessage;
    $scope.record = false;
    $scope.URL_PHOTO = "https://api.eyeinc.ru/assets/images/";
    $scope.URL_AUDIO = "https://api.eyeinc.ru/assets/voices/";
    var typeFile, message_attachment, fileExt, chunks, base64;

    /**
     * Добавляет переданный урл в список доверенных
     * @param {*} url - урл для списка доверенных адресов
     */
    $scope.trustAsUrl = function(url){
        return $sce.trustAsResourceUrl(url)
    }
     
    /*
    ** Инициализация сокета
    */
    $scope.initWs = function(userId){
        $rootScope.obj.webSocket.onMessage(function(_message){
            try{
                var message = JSON.parse(_message.data);
                switch (message.id){
                    case 'sendmessagetestSuccess':
                        $scope.addChatMessage(message);
                        break;
                    default:
                        // TODO:
                }
            }
            catch(e){
                console.log(e);
            }
        });
    }

    /*
    ** Уставливает, отправлено ли сообщение авторизованным пользователем или его собеседником
    */
    $scope.isReceiver = function(msg){
        if (msg.from_user_id == localStorage.getItem('userId')){
            return false;
        }
        else{
            return true;
        }
    }

    /*
    ** Добавляет новое сообщение в историю переписки
    */
    $scope.addChatMessage = function(chatMessage){
        chatMessage.receiver = (chatMessage.from_user_id == localStorage.getItem("user_id")) ? false : true;
        if (!$scope.messagesWithUser){
            $scope.messagesWithUser = [];
        }

        if (chatMessage.receiver){
            $scope.messagesWithUser.push(chatMessage);
        }
        else{
            $scope.messagesWithUser[chatMessage.order] = chatMessage;
        }
    
        // Костыль для моментальной прокрутки чата вниз
		angular.element("#chat ul").animate({scrollTop: "10000px"},'fast');
    }

    /*
    ** Подгружает дополнительные сообщения из чата
    */
    $scope.getChatMore = function() {
        if ($scope.isScroll){
            $scope.isScroll = !$scope.isScroll;
            $http({
                url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getChatWithUser",
                method: "GET",
                params: {id: localStorage.getItem("to_user_id"), time: localStorage.getItem("time")}
            }).then(function(result){
                $scope.isScroll = (result.data.chat.length<50) ? false : true;
                for (var i =0;i<result.data.chat.length;i++){
                    result.data.chat[i].receiver = (result.data.chat[i].from_user_id==localStorage.getItem("user_id")) ? false : true;
                }
                var temp = result.data.chat.reverse();
                localStorage.setItem("time",result.data.time);
                for (var i=0; i<temp.length; i++){
                    $scope.messagesWithUser.unshift(temp[i]);
                }
            });
        }
    }

    /**
    ** Отправка текстового сообщения
    */
    $scope.sendMessageByEnter = function(chatMessage, userId, $event) {
        if(!$scope.chatMessage) {
            return;
        }
        var keyCode = $event.which || $event.keyCode;
        if(keyCode == 13) {
            $scope.order = (typeof $scope.messagesWithUser == "undefined") ? 0 : $scope.messagesWithUser.length;
            $scope.setLocalMessage("Text",$scope.order);
            $rootScope.obj.methods.sendChatMessage(localStorage.getItem("access_token"),$scope.userId, typeFile='Text', $scope.chatMessage,null,$scope.order);
            $scope.chatMessage = "";
            angular.element("#chat form input[type=text]").val('');
        }
    }

    /*
    ** Отправка изображения в сообщении
    */
    $scope.sendChatImage = function() {
        var files = document.querySelector('#chat form input[type=file]').files;
        for(var i=0; i<files.length; i++) {
            fileExt = files[i].name.split(".");
            makeBase64(files[i],(chatImage) => {
                var fd = new FormData();
                fd.append("chatImage",chatImage);
                typeFile = "." + fileExt[1];
                message_attachment = {};
                $scope.order = (typeof $scope.messagesWithUser == "undefined") ? 0 : $scope.messagesWithUser.length;
                $scope.setLocalMessage(typeFile,$scope.order);
                $scope.saveServerImage(chatImage,$scope.userId,typeFile,(fileName) =>{
                    if (fileName){
                        message_attachment.fileName = fileName;
                        $rootScope.obj.methods.sendChatMessage(localStorage.getItem("access_token"),$scope.userId, typeFile, "",message_attachment,$scope.order);
                    }
                    else{
                        alert("error");
                    }
                })

                angular.element(".sendButtons").hide();
            });
        }
    }

    /*
    ** Отправка карты в сообщении
    */
    $scope.sendChatMap = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            typeFile = "Map";
            message_attachment = {
                location: {
                    latitude: $scope.lat,
                    longitude: $scope.lng
                }
            }
            $scope.order = (typeof $scope.messagesWithUser == "undefined") ? 0 : $scope.messagesWithUser.length;
            $scope.setLocalMessage(typeFile,$scope.order);
            $rootScope.obj.methods.sendChatMessage(localStorage.getItem("access_token"),$scope.userId, typeFile, "", message_attachment,$scope.order);
        }, function() {
            // TODO:
        });
    }

    /*
    ** Сохрание файла-вложения на сервер
    */
    $scope.saveServerImage = function(attach,uId,typeFile,callback) {
        $http({
			url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=saveObject",
			method: "POST",
			data:$.param({"attach" : attach,"userId" : uId,"typeFile" : typeFile}),
            headers:{'Content-Type' : 'application/x-www-form-urlencoded'}
  		}).then(function(result){
			if(result.data.success) {
				callback(result.data.fileName);
			} else {
        	    callback(null);
			}
  		});
    }

    /*
    ** Устанавливает порядок сообщения
    */
    $scope.setLocalMessage = function(type,order) {
        switch(type){
            case ".mp3":
            case ".wav":
                $scope.addChatMessage({
                    from_user_id : localStorage.getItem("user_id"),
                    to_user_id : $scope.userId,
                    type_file : type,
                    message: '',
                    message_attachment : {
                        fileName : ''
                    },
                    order : order
                });
                break;
            case ".png":
            case ".jpeg":
            case ".jpg":
                $scope.addChatMessage({
                    from_user_id : localStorage.getItem("user_id"),
                    to_user_id : $scope.userId,
                    type_file : type,
                    message: '',
                    message_attachment : {
                        isLocal : true,
                        fileName : ''
                    },
                    order : order
                });
                break;
            case "Text":
                $scope.addChatMessage({
                    from_user_id : localStorage.getItem("user_id"),
                    to_user_id : $scope.userId,
                    message: $scope.chatMessage,
                    order : order
                });
                break;
            case "Map":
                $scope.addChatMessage({
                    from_user_id : localStorage.getItem("user_id"),
                    to_user_id : $scope.userId,
                    type_file: type,
                    message_attachment: {
                        location : {
                            latitude: $scope.lat,
                            longitude: $scope.lng
                        }
                    },
                    order : order
                });
                break;
        }
    }

    /*
    ** Отправка голосового сообщения
    */
    $scope.startRecord = function() {
        $scope.record = !$scope.record;
        window.AudioContext =  window.AudioContext || webkitAudioContext;
        var audioCtx = new AudioContext;
        navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia);
        if(navigator.getUserMedia) {
            var constraints = { audio: true };
            var onSuccess = function(stream) {
                var options = {
                    audioBitsPerSecond: 44100,
                    type: "audio/wave"
                }
                if ($scope.record){
                    var input = audioCtx.createMediaStreamSource(stream);
                    $scope.rec = new Recorder(input);
                    $scope.rec.record();
                }
                else if(!$scope.record) {
                    $scope.rec.stop();
                    var audio = document.createElement('audio');
                    audio.setAttribute('controls', '');
                    audio.controls = true;
                    $scope.rec.exportWAV((wav) =>{
                        $scope.duration = parseInt((wav.size/(44100*2)) * 1000+1000);
                        var reader = new window.FileReader();
                        reader.readAsDataURL(wav);
                        reader.onloadend = function() {
                            $scope.rec.clear();
                            chunks = [];
                            message_attachment = {};
                            base64 = reader.result;
                            audio.src = base64;
                            typeFile = '.wav';
                            base64 = base64.split(",");
                            message_attachment.base_64 = base64[1];
                            message_attachment.duration = $scope.duration
                            $scope.order = (typeof $scope.messagesWithUser == "undefined") ? 0 : $scope.messagesWithUser.length;
                            $scope.setLocalMessage(typeFile,$scope.order);
                            $rootScope.obj.methods.sendChatMessage(localStorage.getItem("access_token"),$scope.userId, typeFile, null, message_attachment,$scope.order);
                        }
                    })
                }
            }
            var onError = function(err){
                console.log('The following error occured: ' + err);
            };
            navigator.getUserMedia(constraints, onSuccess, onError);

        } else {
            console.log('getUserMedia not supported on your browser!');
        }
    }

    /*
    ** Определение символа emoji
    */
    $scope.getEmojiCode = function(item) {
        let emojiCode = '';
        emojiCode = angular.element(item).data('emojicode');
        angular.element(".inputMessage input[type=text]")[0].value += emojiCode;
    };
});