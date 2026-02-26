/**
 * Firebase Configuration
 * Project: health-desk-community
 *
 * วิธีตั้งค่า:
 * 1. ไปที่ Firebase Console: https://console.firebase.google.com
 * 2. เลือก Project "health-desk-community"
 * 3. ไปที่ Project Settings > General > Your apps > Web app
 * 4. คัดลอก firebaseConfig มาใส่ด้านล่าง
 * 5. เปิด Authentication > Sign-in method > เปิด Anonymous + Email/Password
 * 6. เปิด Firestore Database > สร้าง database
 * 7. เปิด Storage (ถ้าต้องการเก็บรูป)
 */

var firebaseConfig = {
    apiKey: "AIzaSyAP_4wWTIovF-0F6FW_KPgfpuW7-UZlL3g",
    authDomain: "health-desk-community.firebaseapp.com",
    projectId: "health-desk-community",
    storageBucket: "health-desk-community.firebasestorage.app",
    messagingSenderId: "1092129472912",
    appId: "1:1092129472912:web:4ad8e1412a3406665e3315"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
var db = firebase.firestore();
var auth = firebase.auth();
var storage = firebase.storage();

// Firestore settings
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
    if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence: Browser not supported');
    }
});

console.log('Firebase initialized: ' + firebaseConfig.projectId);
