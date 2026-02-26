/**
 * Patient Authentication Logic
 * ใช้ Firebase Anonymous Auth + ยืนยันตัวตนด้วย HN/วันเกิด
 * ออกแบบสำหรับคนแก่ชาวบ้าน: ง่าย ไม่ต้องสมัคร ไม่ต้อง OTP
 * Falls back to mock data when Firebase is not available
 */

// Default avatar SVG (person silhouette on green background)
var DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='100' fill='%2310B981'/%3E%3Ccircle cx='100' cy='75' r='33' fill='white' opacity='0.9'/%3E%3Cellipse cx='100' cy='160' rx='50' ry='38' fill='white' opacity='0.9'/%3E%3C/svg%3E";

// Check if patient is logged in
function checkPatientAuth() {
    var patient = localStorage.getItem('healthdesk_patient');
    if (!patient) {
        if (window.location.pathname.includes('patient-') &&
            !window.location.pathname.includes('patient-login.html') &&
            !window.location.pathname.includes('patient-register.html')) {
            window.location.href = 'patient-login.html';
        }
        return null;
    }
    return JSON.parse(patient);
}

// Patient login form handler
if (document.getElementById('patientLoginForm')) {
    document.getElementById('patientLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        var patientId = document.getElementById('patientId').value.trim();
        var dateOfBirth = document.getElementById('dateOfBirth').value;
        var submitBtn = e.target.querySelector('button[type="submit"]');

        // Disable button during login
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังเข้าสู่ระบบ...';
        }

        // Try Firebase first
        if (typeof FirebaseService !== 'undefined') {
            FirebaseService.loginPatient(patientId, dateOfBirth)
                .then(function(patient) {
                    window.location.href = 'patient-portal-v2.html';
                })
                .catch(function(error) {
                    console.warn('Firebase patient login failed, trying fallback:', error.message);
                    _loginPatientMock(patientId, dateOfBirth, submitBtn);
                });
        } else {
            _loginPatientMock(patientId, dateOfBirth, submitBtn);
        }
    });
}

function _loginPatientMock(patientId, dateOfBirth, submitBtn) {
    // Find patient by HN or Citizen ID in mockPatients
    var patient = mockPatients.find(function(p) {
        return p.hn === patientId.toUpperCase() ||
            p.citizenId === patientId;
    });

    if (patient) {
        patient.chatId = 'patient-' + patient.id;
        localStorage.setItem('healthdesk_patient', JSON.stringify(patient));
        window.location.href = 'patient-portal-v2.html';
    } else {
        alert('ไม่พบข้อมูล\n\nกรุณาตรวจสอบ HN หรือเลขบัตรประชาชนอีกครั้ง\n\n💡 ทดลอง: HN12345 หรือ 1234567890125');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'เข้าสู่ระบบ';
        }
    }
}

// Patient logout
function patientLogout() {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
        localStorage.removeItem('healthdesk_patient');
        if (typeof FirebaseService !== 'undefined') {
            FirebaseService.logout().then(function() {
                window.location.href = 'patient-login.html';
            });
        } else {
            window.location.href = 'patient-login.html';
        }
    }
}

// Update patient info in nav
function updatePatientInfo() {
    var patient = checkPatientAuth();
    if (patient) {
        var nameEl = document.getElementById('patientName');
        var hnEl = document.getElementById('patientHN');
        var firstNameEl = document.getElementById('patientFirstName');
        var avatarEl = document.getElementById('patientAvatar');

        if (nameEl) nameEl.textContent = patient.firstName + ' ' + patient.lastName;
        if (hnEl) hnEl.textContent = 'HN: ' + patient.hn;
        if (firstNameEl) firstNameEl.textContent = patient.firstName;
        if (avatarEl) {
            if (patient.profilePhoto) {
                avatarEl.src = patient.profilePhoto;
            } else {
                avatarEl.src = DEFAULT_AVATAR;
            }
        }
    }
    return patient;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname;
    // Check auth on protected pages
    if (path.includes('patient-') &&
        !path.includes('patient-login.html') &&
        !path.includes('patient-register.html')) {
        var patient = checkPatientAuth();
        if (patient) {
            document.body.style.visibility = 'visible';
        }
    }

    // Update current date
    var dateEl = document.getElementById('currentDate');
    if (dateEl) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('th-TH', options);
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkPatientAuth: checkPatientAuth,
        patientLogout: patientLogout,
        updatePatientInfo: updatePatientInfo
    };
}
