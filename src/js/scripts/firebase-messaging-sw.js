importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js');



var config = {
    apiKey: "AIzaSyB3j0KvUCaZf63wXsu2a1kpoUk8cCdzu0s",
    authDomain: "eyenotifications.firebaseapp.com",
    databaseURL: "https://eyenotifications.firebaseio.com",
    storageBucket: "eyenotifications.appspot.com",
    projectId: "eyenotifications",
    messagingSenderId: "234649458498"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js'></script>
 <script src="https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js"></script>');

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': 'YOUR-SENDER-ID'
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 **/


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'EYE';
    let notificationOptions = {
        body: payload.notification.name+": "+payload.notification.body,
        icon: 'https://eyeinc.ru/api/assets/avatar/'+payload.data.avatar
    };
    if (!payload.data.avatar){
        notificationOptions.icon='/favicon.png';
    }

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});