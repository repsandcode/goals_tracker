importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBaMZLh3M63kz--zNpLbv_Iwx_GTEQrigI",
  authDomain: "goaltracker-a90fb.firebaseapp.com",
  projectId: "goaltracker-a90fb",
  storageBucket: "goaltracker-a90fb.firebasestorage.app",
  messagingSenderId: "453727782397",
  appId: "1:453727782397:web:2d5f1124b597fecf9d8594",
  measurementId: "G-CCR60T88JQ"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/goals_tracker/images/default.png', // Replace with your icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});