/**
 * Staff Authentication Logic
 * Uses Firebase Auth (email/password) with Firestore staff data
 * Falls back to mock users when Firebase is not available
 */

// Mock users (fallback when Firebase is not configured)
var mockUsers = {
    'admin@health.go.th': {
        password: 'admin123',
        id: 'staff-1',
        name: 'Admin User',
        role: 'admin',
        roleLabel: 'ผู้ดูแลระบบ'
    },
    'worker@health.go.th': {
        password: 'worker123',
        id: 'staff-2',
        name: 'สมหญิง รักษา',
        role: 'worker',
        roleLabel: 'เจ้าหน้าที่สาธารณสุข'
    },
    'doctor@health.go.th': {
        password: 'doctor123',
        id: 'staff-3',
        name: 'นพ.สมชาย พัฒนา',
        role: 'doctor',
        roleLabel: 'แพทย์'
    }
};

// Check if user is logged in
function checkAuth() {
    var user = localStorage.getItem('healthdesk_user');
    if (!user) {
        if (window.location.pathname.includes('/app/') && !window.location.pathname.includes('login.html')) {
            window.location.replace('login.html');
        }
        return null;
    }
    return JSON.parse(user);
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var submitBtn = e.target.querySelector('button[type="submit"]');

        // Disable button during login
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'กำลังเข้าสู่ระบบ...';
        }

        // Try Firebase Auth first
        if (typeof FirebaseService !== 'undefined') {
            FirebaseService.loginStaff(email, password)
                .then(function(userData) {
                    if (userData.role === 'worker') {
                        window.location.href = 'field-app.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                })
                .catch(function(error) {
                    console.warn('Firebase login failed, trying fallback:', error.message);
                    _loginWithMock(email, password, submitBtn);
                });
        } else {
            _loginWithMock(email, password, submitBtn);
        }
    });
}

function _loginWithMock(email, password, submitBtn) {
    var user = mockUsers[email];

    if (user && user.password === password) {
        localStorage.setItem('healthdesk_user', JSON.stringify({
            email: email,
            id: user.id,
            name: user.name,
            role: user.role,
            roleLabel: user.roleLabel
        }));

        if (user.role === 'worker') {
            window.location.href = 'field-app.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'เข้าสู่ระบบ';
        }
    }
}

// Logout function
function logout() {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
        localStorage.removeItem('healthdesk_user');
        if (typeof FirebaseService !== 'undefined') {
            FirebaseService.logout().then(function() {
                window.location.href = 'login.html';
            });
        } else {
            window.location.href = 'login.html';
        }
    }
}

// Update user info in nav
function updateUserInfo() {
    var user = checkAuth();
    if (user) {
        var userNameEl = document.getElementById('userName');
        var userRoleEl = document.getElementById('userRole');

        if (userNameEl) userNameEl.textContent = user.name;
        if (userRoleEl) userRoleEl.textContent = user.roleLabel;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/app/') && !window.location.pathname.includes('login.html')) {
        checkAuth();
        updateUserInfo();
    }

    var dateEl = document.getElementById('currentDate');
    if (dateEl) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('th-TH', options);
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAuth: checkAuth,
        logout: logout,
        updateUserInfo: updateUserInfo
    };
}
