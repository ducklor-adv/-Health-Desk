/**
 * Data Layer for Health Desk
 * Loads data from Firestore (Firebase) with localStorage fallback
 * Utility functions (BMI, BP, Sugar, SpO2 categories) remain unchanged
 */

// ============================================================
// Global data arrays — populated from Firestore on load
// ============================================================
var mockPatients = [];
var mockActivities = [
    { id: 1, icon: "✅", text: "บันทึกข้อมูลสุขภาพของ นายสมชาย ใจดี (HN12345) เรียบร้อยแล้ว", user: "พยาบาลสมหญิง รักษา", time: "5 นาทีที่แล้ว" },
    { id: 2, icon: "📊", text: "สร้างรายงานสุขภาพชุมชนประจำเดือนกุมภาพันธ์", user: "Admin System", time: "30 นาทีที่แล้ว" },
    { id: 3, icon: "⚠️", text: "พบผู้ป่วยกลุ่มเสี่ยงสูง 3 ราย ที่ต้องติดตามภายในสัปดาห์นี้", user: "System Alert", time: "1 ชั่วโมงที่แล้ว" },
    { id: 4, icon: "👤", text: "เพิ่มผู้ป่วยใหม่ นางสาววิภา สดใส (HN10893)", user: "พยาบาลจันทร์ เจริญ", time: "2 ชั่วโมงที่แล้ว" },
    { id: 5, icon: "💊", text: "ออกใบสั่งยาให้กับ นางมานี มีสุข (HN10245)", user: "นพ.วิชัย พัฒนา", time: "3 ชั่วโมงที่แล้ว" }
];

// ============================================================
// Mock Appointments — พร้อม เวลา + สถานที่
// ============================================================
var mockAppointments = [
    // ── ผู้ป่วยที่ 1: มานี มีสุข (HN10245) ──
    { id: 'appt-1', patientId: 'patient-1', patientHN: 'HN10245', date: '2024-03-05', time: '09:00', endTime: '10:00', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามความดัน+เบาหวาน', status: 'scheduled', notes: 'งดอาหาร 8 ชม. ก่อนเจาะเลือด' },
    { id: 'appt-2', patientId: 'patient-1', patientHN: 'HN10245', date: '2024-02-20', time: '10:00', endTime: '10:30', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },
    { id: 'appt-3', patientId: 'patient-1', patientHN: 'HN10245', date: '2024-01-15', time: '14:00', endTime: '14:30', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามความดัน', status: 'completed', notes: '' },
    { id: 'appt-4', patientId: 'patient-1', patientHN: 'HN10245', date: '2024-01-05', time: '08:30', endTime: '09:00', doctorName: 'ห้องแลป', location: 'โรงพยาบาลชุมชนแม่เหียะ', reason: 'ตรวจเลือด', status: 'cancelled', notes: 'ผู้ป่วยไม่สะดวก' },

    // ── ผู้ป่วยที่ 2: ประสิทธิ์ ดีงาม (HN10567) ──
    { id: 'appt-5', patientId: 'patient-2', patientHN: 'HN10567', date: '2024-03-22', time: '10:30', endTime: '11:00', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามน้ำหนัก+ไขมัน', status: 'scheduled', notes: 'งดอาหาร 12 ชม.' },
    { id: 'appt-6', patientId: 'patient-2', patientHN: 'HN10567', date: '2024-02-22', time: '09:30', endTime: '10:00', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },

    // ── ผู้ป่วยที่ 3: สมชาย ใจดี (HN12345) ──
    { id: 'appt-7', patientId: 'patient-3', patientHN: 'HN12345', date: '2024-03-25', time: '09:00', endTime: '09:30', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามน้ำตาล', status: 'scheduled', notes: 'งดอาหาร 8 ชม. ก่อนเจาะเลือด' },
    { id: 'appt-8', patientId: 'patient-3', patientHN: 'HN12345', date: '2024-02-25', time: '13:30', endTime: '14:00', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },
    { id: 'appt-9', patientId: 'patient-3', patientHN: 'HN12345', date: '2024-01-20', time: '10:00', endTime: '10:30', doctorName: 'นพ.สมชาย พัฒนา', location: 'คลินิกหมอครอบครัวท่าศาลา', reason: 'ตรวจ FBS+HbA1c', status: 'completed', notes: '' },

    // ── ผู้ป่วยที่ 4: สมหญิง รักษา (HN10892) ──
    { id: 'appt-10', patientId: 'patient-4', patientHN: 'HN10892', date: '2024-06-23', time: '09:00', endTime: '09:30', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'scheduled', notes: '' },
    { id: 'appt-11', patientId: 'patient-4', patientHN: 'HN10892', date: '2024-02-23', time: '10:00', endTime: '10:30', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพทั่วไป', status: 'completed', notes: '' },

    // ── ผู้ป่วยที่ 5: วิชัย สุขใจ (HN11234) ──
    { id: 'appt-12', patientId: 'patient-5', patientHN: 'HN11234', date: '2024-03-01', time: '09:00', endTime: '10:00', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามหัวใจ+ไต', status: 'scheduled', notes: 'นำยาที่กินมาด้วย' },
    { id: 'appt-13', patientId: 'patient-5', patientHN: 'HN11234', date: '2024-02-18', time: '10:00', endTime: '10:30', doctorName: 'สมหญิง รักษา', location: 'บ้านผู้ป่วย (เยี่ยมบ้าน)', reason: 'เยี่ยมบ้านวัดความดัน', status: 'completed', notes: '' },
    { id: 'appt-14', patientId: 'patient-5', patientHN: 'HN11234', date: '2024-02-01', time: '08:30', endTime: '09:00', doctorName: 'ห้องแลป', location: 'โรงพยาบาลชุมชนแม่เหียะ', reason: 'ตรวจเลือด Cr+eGFR', status: 'completed', notes: '' },
    { id: 'appt-15', patientId: 'patient-5', patientHN: 'HN11234', date: '2024-01-10', time: '14:00', endTime: '15:00', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจ Echo หัวใจ', status: 'completed', notes: '' }
];

/**
 * ดึงนัดหมายของผู้ป่วยตาม HN
 * @param {string} hn - HN ของผู้ป่วย
 * @returns {Array} appointments sorted by date desc
 */
function getAppointmentsByHN(hn) {
    return mockAppointments
        .filter(function(a) { return a.patientHN === hn; })
        .sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
}

/**
 * ดึงนัดหมายครั้งถัดไป (scheduled) ของผู้ป่วย
 * @param {string} hn
 * @returns {Object|null}
 */
function getNextAppointment(hn) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var upcoming = mockAppointments
        .filter(function(a) {
            return a.patientHN === hn && a.status === 'scheduled' && new Date(a.date) >= today;
        })
        .sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    return upcoming.length > 0 ? upcoming[0] : null;
}

// ============================================================
// Disease & Risk Labels
// ============================================================
var diseaseLabels = {
    hypertension: "ความดันสูง",
    diabetes: "เบาหวาน",
    heart: "โรคหัวใจ",
    obesity: "อ้วน",
    pre_diabetes: "เสี่ยงเบาหวาน",
    dyslipidemia: "ไขมันในเลือดสูง",
    gout: "เก๊าท์",
    asthma: "หอบหืด",
    ckd: "โรคไตเรื้อรัง",
    copd: "ถุงลมโป่งพอง",
    stroke: "หลอดเลือดสมอง",
    thyroid: "ไทรอยด์",
    osteoarthritis: "ข้อเสื่อม"
};

var riskLevelLabels = {
    high: "สูง",
    medium: "ปานกลาง",
    low: "ต่ำ",
    none: "ไม่มีความเสี่ยง"
};

// ============================================================
// Health Category Functions (Pure — no Firebase dependency)
// ============================================================

// BMI Categories (Asian standard: 23/25)
function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: "underweight", label: "ผอม", color: "#60A5FA" };
    if (bmi < 23) return { category: "normal", label: "ปกติ", color: "#34D399" };
    if (bmi < 25) return { category: "overweight", label: "น้ำหนักเกิน", color: "#FBBF24" };
    return { category: "obese", label: "อ้วน", color: "#F87171" };
}

// Blood Pressure Categories
function getBPCategory(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) {
        return { category: "normal", label: "ปกติ", alert: false };
    } else if (systolic < 140 && diastolic < 90) {
        return { category: "prehypertension", label: "ความดันสูงระดับเริ่มต้น", alert: true };
    } else {
        return { category: "hypertension", label: "ความดันสูง", alert: true };
    }
}

// Blood Sugar Categories
function getSugarCategory(value, type) {
    type = type || "fasting";
    if (type === "fasting") {
        if (value < 100) return { category: "normal", label: "ปกติ", alert: false };
        if (value < 126) return { category: "prediabetes", label: "เสี่ยงเบาหวาน", alert: true };
        return { category: "diabetes", label: "เบาหวาน", alert: true };
    } else {
        if (value < 140) return { category: "normal", label: "ปกติ", alert: false };
        if (value < 200) return { category: "prediabetes", label: "เสี่ยงเบาหวาน", alert: true };
        return { category: "diabetes", label: "เบาหวาน", alert: true };
    }
}

// SpO2 Categories
function getSpO2Category(value) {
    if (value >= 95) return { category: "normal", label: "ปกติ", color: "#34D399", alert: false };
    if (value >= 90) return { category: "low", label: "ต่ำ", color: "#FBBF24", alert: true };
    return { category: "critical", label: "วิกฤต", color: "#F87171", alert: true };
}

// ============================================================
// Firestore Data Loading
// ============================================================

var _dataLoaded = false;
var _dataLoadPromise = null;

/**
 * Load patients from Firestore into mockPatients array
 * Falls back to localStorage/mock data if Firebase is not available
 */
function loadPatientsFromFirestore() {
    if (_dataLoadPromise) return _dataLoadPromise;

    _dataLoadPromise = new Promise(function(resolve) {
        // Check if Firebase is available
        if (typeof db === 'undefined' || typeof FirebaseService === 'undefined') {
            console.warn('Firebase not available, using fallback data');
            _loadFallbackData();
            resolve(mockPatients);
            return;
        }

        // Try loading from Firestore
        FirebaseService.isSeeded().then(function(seeded) {
            if (!seeded) {
                console.warn('Firestore is empty, using fallback data');
                _loadFallbackData();
                resolve(mockPatients);
                return;
            }

            return FirebaseService.getPatients().then(function(patients) {
                // Load health records for each patient
                var promises = patients.map(function(patient) {
                    return FirebaseService.getHealthRecords(patient.id, 5)
                        .then(function(records) {
                            patient.healthRecords = records;
                            return patient;
                        });
                });

                return Promise.all(promises).then(function(patientsWithRecords) {
                    mockPatients.length = 0;
                    patientsWithRecords.forEach(function(p) {
                        // Calculate age from dateOfBirth
                        if (p.dateOfBirth) {
                            var today = new Date();
                            var birth = new Date(p.dateOfBirth);
                            p.age = today.getFullYear() - birth.getFullYear();
                            var m = today.getMonth() - birth.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                                p.age--;
                            }
                        }
                        mockPatients.push(p);
                    });

                    _dataLoaded = true;
                    console.log('Loaded ' + mockPatients.length + ' patients from Firestore');
                    resolve(mockPatients);
                });
            });
        }).catch(function(error) {
            console.error('Firestore load error:', error);
            _loadFallbackData();
            resolve(mockPatients);
        });
    });

    return _dataLoadPromise;
}

/**
 * Load fallback mock data (when Firebase is not available)
 */
function _loadFallbackData() {
    if (mockPatients.length > 0) return;

    var fallbackPatients = [
        { id: 1, hn: "HN10245", firstName: "มานี", lastName: "มีสุข", citizenId: "1234567890123", dateOfBirth: "1962-05-15", age: 62, gender: "female", phone: "081-234-5678", diseases: ["hypertension", "diabetes"], riskLevel: "high", lastCheckup: "2024-02-20", nextAppointment: "2024-03-05", healthRecords: [{ date: "2024-02-20", weight: 68.5, height: 155, bmi: 28.5, systolic: 145, diastolic: 95, bloodSugar: 145, heartRate: 82, temperature: 36.7, oxygenLevel: 96 }] },
        { id: 2, hn: "HN10567", firstName: "ประสิทธิ์", lastName: "ดีงาม", citizenId: "1234567890124", dateOfBirth: "1969-08-20", age: 55, gender: "male", phone: "082-345-6789", diseases: ["obesity"], riskLevel: "medium", lastCheckup: "2024-02-22", nextAppointment: "2024-03-22", healthRecords: [{ date: "2024-02-22", weight: 92.0, height: 170, bmi: 31.8, systolic: 135, diastolic: 85, bloodSugar: 110, heartRate: 75, temperature: 36.5, oxygenLevel: 98 }] },
        { id: 3, hn: "HN12345", firstName: "สมชาย", lastName: "ใจดี", citizenId: "1234567890125", dateOfBirth: "1981-03-10", age: 45, gender: "male", phone: "083-456-7890", profilePhoto: "../img/avatar-somchai.svg", diseases: ["pre_diabetes"], riskLevel: "medium", lastCheckup: "2024-02-25", nextAppointment: "2024-03-25", healthRecords: [{ date: "2024-02-25", weight: 75.5, height: 170, bmi: 26.1, systolic: 135, diastolic: 85, bloodSugar: 110, heartRate: 78, temperature: 36.8, oxygenLevel: 97 }] },
        { id: 4, hn: "HN10892", firstName: "สมหญิง", lastName: "รักษา", citizenId: "1234567890126", dateOfBirth: "1988-11-05", age: 38, gender: "female", phone: "084-567-8901", diseases: [], riskLevel: "low", lastCheckup: "2024-02-23", nextAppointment: "2024-06-23", healthRecords: [{ date: "2024-02-23", weight: 58.0, height: 160, bmi: 22.7, systolic: 115, diastolic: 75, bloodSugar: 95, heartRate: 70, temperature: 36.6, oxygenLevel: 99 }] },
        { id: 5, hn: "HN11234", firstName: "วิชัย", lastName: "สุขใจ", citizenId: "1234567890127", dateOfBirth: "1958-01-20", age: 68, gender: "male", phone: "085-678-9012", diseases: ["hypertension", "heart"], riskLevel: "high", lastCheckup: "2024-02-18", nextAppointment: "2024-03-01", healthRecords: [{ date: "2024-02-18", weight: 72.0, height: 165, bmi: 26.4, systolic: 150, diastolic: 98, bloodSugar: 105, heartRate: 85, temperature: 36.9, oxygenLevel: 94 }] }
    ];

    // Generate additional mock patients
    var genders = ["male", "female"];
    var firstNamesMale = ["สมชาย", "สมศักดิ์", "สมหมาย", "วิชัย", "ประสิทธิ์", "บุญมี", "จรูญ", "วิทยา"];
    var firstNamesFemale = ["สมหญิง", "มานี", "ประภา", "สุภา", "วารี", "จันทร์", "วิภา", "สุดา"];
    var lastNames = ["ใจดี", "มีสุข", "ดีงาม", "สุขใจ", "รักษา", "สดใส", "เจริญ", "พัฒนา"];
    var diseases = [["hypertension"], ["diabetes"], ["obesity"], ["hypertension", "diabetes"], []];
    var riskLevels = ["high", "medium", "low", "none"];

    for (var i = 6; i <= 50; i++) {
        var gender = genders[Math.floor(Math.random() * genders.length)];
        var firstName = gender === "male"
            ? firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]
            : firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];
        var weight = Math.floor(Math.random() * 40) + 50;
        var height = Math.floor(Math.random() * 30) + 150;

        fallbackPatients.push({
            id: i,
            hn: 'HN' + (10000 + i),
            firstName: firstName,
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            citizenId: '123456789012' + i,
            age: Math.floor(Math.random() * 50) + 20,
            gender: gender,
            phone: '08' + (Math.floor(Math.random() * 9) + 1) + '-' + (Math.floor(Math.random() * 900) + 100) + '-' + (Math.floor(Math.random() * 9000) + 1000),
            diseases: diseases[Math.floor(Math.random() * diseases.length)],
            riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
            lastCheckup: '2024-02-' + (Math.floor(Math.random() * 25) + 1),
            nextAppointment: '2024-03-' + (Math.floor(Math.random() * 28) + 1),
            healthRecords: [{
                date: '2024-02-' + (Math.floor(Math.random() * 25) + 1),
                weight: weight,
                height: height,
                bmi: parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)),
                systolic: Math.floor(Math.random() * 50) + 110,
                diastolic: Math.floor(Math.random() * 30) + 70,
                bloodSugar: Math.floor(Math.random() * 50) + 90,
                heartRate: Math.floor(Math.random() * 30) + 60,
                temperature: parseFloat((36.5 + Math.random() * 0.8).toFixed(1)),
                oxygenLevel: Math.floor(Math.random() * 8) + 93
            }]
        });
    }

    mockPatients.length = 0;
    fallbackPatients.forEach(function(p) { mockPatients.push(p); });
    _dataLoaded = true;

    // Also load registered patients from localStorage
    var registered = JSON.parse(localStorage.getItem('healthdesk_registered_patients') || '[]');
    registered.forEach(function(p) {
        if (!mockPatients.some(function(existing) { return existing.citizenId === p.citizenId; })) {
            mockPatients.push(p);
        }
    });

    console.log('Loaded ' + mockPatients.length + ' patients from fallback data');
}

// Auto-load: try Firestore first, fallback to mock data
(function() {
    if (typeof db !== 'undefined' && typeof FirebaseService !== 'undefined') {
        loadPatientsFromFirestore();
    } else {
        _loadFallbackData();
    }
})();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockPatients: mockPatients,
        mockActivities: mockActivities,
        diseaseLabels: diseaseLabels,
        riskLevelLabels: riskLevelLabels,
        getBMICategory: getBMICategory,
        getBPCategory: getBPCategory,
        getSugarCategory: getSugarCategory,
        getSpO2Category: getSpO2Category,
        loadPatientsFromFirestore: loadPatientsFromFirestore
    };
}
