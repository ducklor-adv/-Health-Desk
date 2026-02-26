// ===== Notification System =====
// Uses Firestore when available, falls back to localStorage

function initNotifications() {
    // If Firebase is available, notifications come from Firestore (no init needed)
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        return;
    }
    // Fallback: localStorage
    if (!localStorage.getItem('healthdesk_notifications')) {
        localStorage.setItem('healthdesk_notifications', JSON.stringify(
            typeof mockNotifications !== 'undefined' ? mockNotifications : []
        ));
    }
}

function getNotifications(callback) {
    var user = JSON.parse(localStorage.getItem('healthdesk_user'));
    var patient = JSON.parse(localStorage.getItem('healthdesk_patient') || 'null');

    if (!user && !patient) {
        if (callback) callback([]);
        return [];
    }

    // Try Firestore first
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        var userId = patient ? patient.id : user.id;
        var role = patient ? 'patient' : user.role;

        if (callback) {
            FirebaseService.getNotifications(userId, role).then(callback);
            return [];
        } else {
            // Synchronous fallback — return localStorage data
            return _getNotificationsLocal(user, patient);
        }
    }

    // Fallback: localStorage
    var result = _getNotificationsLocal(user, patient);
    if (callback) callback(result);
    return result;
}

function _getNotificationsLocal(user, patient) {
    var all = JSON.parse(localStorage.getItem('healthdesk_notifications') || '[]');

    return all.filter(function(n) {
        if (user && n.forRoles && n.forRoles.indexOf(user.role) !== -1) {
            if (n.forPatientId) return false;
            return true;
        }
        if (patient && n.forRoles && n.forRoles.indexOf('patient') !== -1) {
            if (n.forPatientId) return n.forPatientId === patient.id;
            return true;
        }
        return false;
    }).sort(function(a, b) {
        return new Date(b.time || b.createdAt) - new Date(a.time || a.createdAt);
    });
}

function getUnreadNotificationCount(callback) {
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined' && callback) {
        getNotifications(function(notifs) {
            callback(notifs.filter(function(n) { return !n.read; }).length);
        });
        return 0;
    }
    var count = getNotifications().filter(function(n) { return !n.read; }).length;
    if (callback) callback(count);
    return count;
}

function markNotificationRead(notifId) {
    // Try Firestore first
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        FirebaseService.markNotificationRead(notifId).then(function() {
            updateNotificationBadge();
        });
        return;
    }

    // Fallback: localStorage
    var all = JSON.parse(localStorage.getItem('healthdesk_notifications') || '[]');
    for (var i = 0; i < all.length; i++) {
        if (all[i].id === notifId) {
            all[i].read = true;
            break;
        }
    }
    localStorage.setItem('healthdesk_notifications', JSON.stringify(all));
    updateNotificationBadge();
}

function markAllNotificationsRead() {
    var user = JSON.parse(localStorage.getItem('healthdesk_user'));
    if (!user) return;

    // Try Firestore first
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        FirebaseService.markAllNotificationsRead(user.role).then(function() {
            updateNotificationBadge();
        });
        return;
    }

    // Fallback: localStorage
    var all = JSON.parse(localStorage.getItem('healthdesk_notifications') || '[]');
    for (var i = 0; i < all.length; i++) {
        if (all[i].forRoles && all[i].forRoles.indexOf(user.role) !== -1) {
            all[i].read = true;
        }
    }
    localStorage.setItem('healthdesk_notifications', JSON.stringify(all));
    updateNotificationBadge();
}

function updateNotificationBadge() {
    var badge = document.getElementById('notifBadge');
    if (!badge) return;

    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        getUnreadNotificationCount(function(count) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
        return;
    }

    var count = getUnreadNotificationCount();
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function renderNotificationPanel() {
    var panel = document.getElementById('notifPanel');
    if (!panel) return;

    function _render(notifications) {
        if (notifications.length === 0) {
            panel.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6B7280; font-size: 1.125rem;">ไม่มีการแจ้งเตือน</div>';
            return;
        }

        var html = '<div style="padding: 1rem 1.25rem; border-bottom: 2px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">' +
            '<strong style="font-size: 1.25rem;">🔔 การแจ้งเตือน</strong>' +
            '<button onclick="markAllNotificationsRead(); renderNotificationPanel();" style="background: none; border: none; color: #4F46E5; font-weight: 700; cursor: pointer; font-family: Prompt, sans-serif; font-size: 0.9rem;">อ่านทั้งหมด</button>' +
            '</div>';

        for (var i = 0; i < notifications.length; i++) {
            var n = notifications[i];
            html += '<div onclick="markNotificationRead(\'' + n.id + '\'); renderNotificationPanel();" ' +
                'style="padding: 1rem 1.25rem; border-bottom: 1px solid #F3F4F6; cursor: pointer; background: ' + (n.read ? 'white' : '#EFF6FF') + ';">' +
                '<div style="display: flex; gap: 0.75rem; align-items: start;">' +
                '<span style="font-size: 1.5rem; flex-shrink: 0;">' + n.icon + '</span>' +
                '<div style="flex: 1; min-width: 0;">' +
                '<div style="font-weight: ' + (n.read ? '500' : '700') + '; color: #111827; margin-bottom: 0.25rem; font-size: 1rem;">' + n.title + '</div>' +
                '<div style="font-size: 0.9rem; color: #6B7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + n.message + '</div>' +
                '<div style="font-size: 0.75rem; color: #9CA3AF; margin-top: 0.25rem;">' + formatTimeAgo(n.time || n.createdAt) + '</div>' +
                '</div>' +
                (!n.read ? '<div style="width: 10px; height: 10px; background: #4F46E5; border-radius: 50%; flex-shrink: 0; margin-top: 6px;"></div>' : '') +
                '</div></div>';
        }

        panel.innerHTML = html;
    }

    // Try Firestore
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        getNotifications(_render);
    } else {
        _render(getNotifications());
    }
}

function toggleNotifications() {
    var panel = document.getElementById('notifPanel');
    if (!panel) return;
    var isVisible = panel.style.display === 'block';
    panel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) renderNotificationPanel();
}

function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
    var now = new Date();
    var date = new Date(dateStr);
    var diffMs = now - date;
    var diffMin = Math.floor(diffMs / 60000);
    var diffHr = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'เมื่อสักครู่';
    if (diffMin < 60) return diffMin + ' นาทีที่แล้ว';
    if (diffHr < 24) return diffHr + ' ชั่วโมงที่แล้ว';
    if (diffDay === 1) return 'เมื่อวาน';
    return diffDay + ' วันที่แล้ว';
}

// === Reschedule Appointment ===
function formatThaiDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

function createRescheduleNotification(patientId, oldDate, newDate, reason) {
    // Try Firestore first
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        FirebaseService.createNotification({
            type: 'reschedule',
            icon: '📅',
            title: 'เปลี่ยนแปลงนัดหมาย',
            message: 'นัดหมายเดิม ' + formatThaiDate(oldDate) + ' เปลี่ยนเป็น ' + formatThaiDate(newDate) + (reason ? ' เหตุผล: ' + reason : ''),
            forRoles: ['patient'],
            forPatientId: patientId
        });
        return;
    }

    // Fallback: localStorage
    var all = JSON.parse(localStorage.getItem('healthdesk_notifications') || '[]');
    var newNotif = {
        id: 'notif-resched-' + Date.now(),
        type: 'reschedule',
        icon: '📅',
        title: 'เปลี่ยนแปลงนัดหมาย',
        message: 'นัดหมายเดิม ' + formatThaiDate(oldDate) + ' เปลี่ยนเป็น ' + formatThaiDate(newDate) + (reason ? ' เหตุผล: ' + reason : ''),
        time: new Date().toISOString(),
        read: false,
        forRoles: ['patient'],
        forPatientId: patientId,
        oldDate: oldDate,
        newDate: newDate,
        reason: reason || ''
    };
    all.push(newNotif);
    localStorage.setItem('healthdesk_notifications', JSON.stringify(all));
}

function rescheduleAppointment(patientId, newDate, reason) {
    var patient = null;
    for (var i = 0; i < mockPatients.length; i++) {
        if (mockPatients[i].id === patientId) {
            patient = mockPatients[i];
            break;
        }
    }
    if (!patient) return false;

    var oldDate = patient.nextAppointment;
    patient.nextAppointment = newDate;

    createRescheduleNotification(patientId, oldDate, newDate, reason);

    return { oldDate: oldDate, newDate: newDate };
}
