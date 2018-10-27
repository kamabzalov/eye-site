eyeApp.controller("translationController", function($scope,$http,$websocket,socketService){
    var webRtcPeer = null;
    var video;
    var constraints = {
        audio : true,
        video :
            {
                mandatory :
                    {
                        maxHeight : 480,
                        maxWidth : 640,
                        minFrameRate : 30,
                        maxFrameRate : 30
                    }
            }
    };
    $scope.comments = [];
    $scope.commentValue;
    var oId = $scope.ownerId;
    $scope.cameraId;
    $scope.accountTypeId;
    $scope.userAvatar;
    $scope.userName;
    $scope.userId;
    $scope.ws = socketService.get();
    $scope.ws.init($websocket);
    $scope.cameraIndex = 0;

    /*
    ** Инициализация сокета
    */
    $scope.initWs = function(){
        $scope.ws.dataStream.onMessage(function(_message){
            var message = JSON.parse(_message.data);
            switch (message.id){
                case 'iceCandidate':
                    webRtcPeer.addIceCandidate(message.candidate)
                    break;
                case 'cameraConnectSuccess':
                    $scope.connectSuccess(message);
                    break;
                case 'sendCommentSuccess':
                    $scope.addComment(message);
                    break;
                case 'enterViewerSuccess':
                    $scope.viewer();
                    $scope.getComments();
                    break;
                case 'viewerResponse':
                    webRtcPeer.processAnswer(message.sdpAnswer);
                    break;
                case 'setCameraId':
                    $scope.cameraId = message.cameraId;
                    $scope.createTranslation();
                    break;

                default:
                    // TODO:
            }
        })
    }

    /*
    ** Отслеживает событие окончания трансляции
    */
    $scope.$on("$destroy",function(){
        if ($scope.translationType === "Presenter" ){
            $scope.stopTranslation();
            webRtcPeer.dispose();
            webRtcPeer = null;
        }
        else if ($scope.translationType === "Viewer"){
            $scope.exitViewer(oId);
            $scope.disconnectViewer();
            webRtcPeer.dispose();
            webRtcPeer = null;
        }
        else{
            $scope.disconnectViewer();
        }
    })

    /*
    ** Добавляет комментарий к транлсяции
    */
    $scope.addComment = function(message){
        $scope.comments.unshift(message);
    }

    /*
    ** Запускает трансляцию
    */
    $scope.createTranslation = function(){
        video = angular.element(document.querySelector("#video"))[0];
        $scope.commentValue = $scope.commentValue;
        if (!webRtcPeer) {
            var options = {
                localVideo: video,
                mediaConstraints : constraints,
                onicecandidate : $scope.onIceCandidate
            };
            webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error) {
                if(error) return console.log(error);
                this.generateOffer(function(error,sdpOffer){
                    if (error){
                        console.log(error);
                    }
                    else{
                        $scope.ws.methods.translationStart(localStorage.getItem("access_token"),sdpOffer,$scope.cameraId);
                    }
                });
            });
        } else {
            $scope.ws.methods.translationStop(localStorage.getItem("access_token"));
        }
    }

    /*
    ** Выключает транлсяцию
    */
    $scope.stopTranslation = function(){
        $scope.ws.methods.translationStop(localStorage.getItem("access_token"));
    }

    /**
     * Успешное соединение с трансляцией
     * @param {*} message - сообщение
     */
    $scope.connectSuccess = function(message){
        $scope.ownerId = $scope.profileid;
        webRtcPeer.processAnswer(message.sdpAnswer);
    }

    /**
     * Отправляет кандидата на сервер
     * @param {*} candidate - объект кандидата
     */
    $scope.onIceCandidate = function(candidate){
        $scope.ws.methods.sendIceCandidate(localStorage.getItem("access_token"),candidate,$scope.cameraId);
    }

    /**
     * Отправляет комментарий на сервер
     * @param {*} userId - id пользователя
     * @param {*} comment - текст комментария
     * @param {*} $event - событие отправки комментария (по клавише Enter)
     */
    $scope.sendComment = function(comment, $event){
        if(!comment) {
            return;
        }
        var keyCode = $event.which;
        if(keyCode == 13) {
            $scope.ws.methods.sendComment(localStorage.getItem("access_token"),oId,comment);
            angular.element(".sendMessage input").val('');
        }

    }

    /**
    * Отвечает на комментарий
    * @param {*} name - иия пользователя, которому отвечают
    */
    $scope.answerToComment = function(name) {
        angular.element(".sendMessage > input").val("@ "+name + ", ");
    }

    /*
    ** Возвращает id камеры
    */
    $scope.getCameraId = function(){
        $scope.ws.methods.getCameraId(localStorage.getItem("access_token"));
    }

    /*
    ** Запуск собственной трансляции
    */
    $scope.viewer = function(){
        video = angular.element(document.querySelector("#video"))[0];
        $scope.commentValue = $scope.commentValue;

        if (!webRtcPeer) {
            var options = {
                remoteVideo: video,
                onicecandidate : $scope.onIceCandidate
            };
            webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function(error) {
                if(error) return console.log(error);
                this.generateOffer(function(error,sdpOffer){
                    if (error){
                        console.log(error);
                    } else {
                        $scope.ws.methods.viewerStart(localStorage.getItem("access_token"),sdpOffer,$scope.cameraId);
                    }
                });
            });
        }
    }

    /*
    ** Остановка собственной трансляции
    */
    $scope.disconnectViewer = function(){
        $scope.ws.methods.disconnectViewer(localStorage.getItem("access_token"));
    }

    /*
    ** Зайти в трансляцию
    */
    $scope.enterViewer = function(){
        $scope.ws.methods.enterViewer(localStorage.getItem("access_token"),oId);
    }

    /**
     * Выйти из трансляции
     */
    $scope.exitViewer = function(){
        $scope.ws.methods.exitViewer(localStorage.getItem("access_token"), oId);
    }

    /*
    ** Получение комментариев трансляции
    */
    $scope.getComments = function(){
        $http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getComments",
            method: "GET",
            params: {id : oId},
        }).then(function(result){
            $scope.comments = result.data.comments;
        });
    }

    /*
    ** Возвращает список всех юзеров, которые просматривают трансляцию
    */
    $scope.getTranslationWatchers = function() {
        $http({
            url: "https://api.eyeinc.ru/v0.9/index.php?c=api&m=getWatchersByUserId",
            method: "GET",
            params: {id : $scope.cameraId},
        }).then(function(result){
            $scope.translationWatchers = result.data.watchers.length;
        });
    }

    $scope.initWs();

    if ($scope.translationType === "business"){
        $scope.viewer()
        $scope.getComments();
        $scope.getTranslationWatchers();
        $scope.translationType = "business";
    }
    else if($scope.translationType === "Viewer"){
        $scope.enterViewer();
        $scope.getComments();
        $scope.getTranslationWatchers();
        $scope.translationType = "Viewer";
    }
    else if ($scope.translationType === "Presenter"){
        $scope.getCameraId();
        $scope.getComments();
        $scope.getTranslationWatchers();
        $scope.translationType = "Presenter"
    }

    /*
    ** Переключает режим просмотра трансляции
    */
    $scope.fullScreenVideo = function() {
    
        if($scope.cameras.length > 1) {
            $scope.showArrow = true;
        }
        
        if($scope.cameraClient == 'web') {
            $scope.isWeb = true;
        } else {
            $scope.isWeb = false;
        }
        $scope.isFullVideo = !$scope.isFullVideo;
        if($scope.isFullVideo) {
            angular.element("#accountInfo").hide();
        } else {
            $scope.isWeb = false;
            angular.element("#accountInfo").show();
        }

    }

    /*
    ** Переход на предыдущую камеру
    */
    $scope.prevCamera = function() {
        $scope.cameraIndex--;
        if($scope.cameraIndex < 0) {
            $scope.cameraIndex = $scope.cameras.length - 1;
        }
        webRtcPeer.dispose();
        webRtcPeer = null;
        $scope.cameraId = $scope.cameras[$scope.cameraIndex]['id'];
        $scope.viewer();    
    }

    /*
    ** Переход на следующую камеру
    */
   $scope.nextCamera = function() {
        $scope.cameraIndex++;
        if($scope.cameraIndex == $scope.cameras.length) {
            $scope.cameraIndex = 0;
        }
        webRtcPeer.dispose();
        webRtcPeer = null;
        $scope.cameraId = $scope.cameras[$scope.cameraIndex]['id'];
        $scope.viewer();    
   }

});