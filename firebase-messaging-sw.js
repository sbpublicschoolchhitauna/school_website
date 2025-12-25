importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC5vKP3huufopaFif_4KzMjVl_xJyCO4h0",
  authDomain: "sb-public-school-notification.firebaseapp.com",
  projectId: "sb-public-school-notification",
  messagingSenderId: "92374733560",
  appId: "1:92374733560:web:f90f2b6d1f4f482f24a10d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || "S.B. PUBLIC SCHOOL";
  const options = {
    body: payload.notification?.body || "नई सूचना",
    icon: "/icons/icon-192.png"
  };
  self.registration.showNotification(title, options);
});
