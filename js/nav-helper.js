// ===== Role-Based Navigation Helper =====

function renderBottomNav(activePage) {
    var user = JSON.parse(localStorage.getItem('healthdesk_user'));
    if (!user) return;

    var role = user.role;
    var navItems = [];

    if (role === 'worker') {
        navItems = [
            { page: 'field-app.html', icon: '📱', label: 'บันทึก' },
            { page: 'patients.html', icon: '👥', label: 'ผู้ป่วย' },
            { page: 'chat.html', icon: '💬', label: 'แชท', hasBadge: true }
        ];
    } else if (role === 'doctor') {
        navItems = [
            { page: 'dashboard.html', icon: '📊', label: 'Dashboard' },
            { page: 'patients.html', icon: '👥', label: 'ผู้ป่วย' },
            { page: 'chat.html', icon: '💬', label: 'แชท', hasBadge: true }
        ];
    } else {
        navItems = [
            { page: 'dashboard.html', icon: '📊', label: 'Dashboard' },
            { page: 'patients.html', icon: '👥', label: 'ผู้ป่วย' },
            { page: 'field-app.html', icon: '📱', label: 'บันทึก' }
        ];
    }

    var navEl = document.querySelector('.bottom-nav');
    if (!navEl) return;

    var html = '';
    for (var i = 0; i < navItems.length; i++) {
        var item = navItems[i];
        var isActive = activePage === item.page;
        var badgeHTML = item.hasBadge ? '<span class="nav-badge" id="navBadgeChat" style="display:none; position:absolute; top:-6px; right:-10px; background:#EF4444; color:white; font-size:0.7rem; font-weight:700; min-width:18px; height:18px; border-radius:9px; align-items:center; justify-content:center; padding:0 4px;"></span>' : '';

        html += '<a href="' + item.page + '" class="nav-btn ' + (isActive ? 'on' : '') + '">' +
            '<span class="nav-icon" style="position:relative; display:inline-block;">' + item.icon + badgeHTML + '</span>' +
            '<span class="nav-text">' + item.label + '</span>' +
            '</a>';
    }

    navEl.innerHTML = html;
    updateNavBadges();
}

function updateNavBadges() {
    if (typeof getUnreadChatCount === 'function') {
        var unread = getUnreadChatCount();
        var chatBadge = document.getElementById('navBadgeChat');
        if (chatBadge) {
            if (unread > 0) {
                chatBadge.textContent = unread;
                chatBadge.style.display = 'flex';
            } else {
                chatBadge.style.display = 'none';
            }
        }
    }
}

// Render notification bell HTML for header
function renderNotifBell() {
    return '<div style="position:relative; cursor:pointer; padding: 0.5rem;" onclick="toggleNotifications()">' +
        '🔔' +
        '<span id="notifBadge" style="display:none; position:absolute; top:0; right:0; background:#EF4444; color:white; font-size:0.65rem; font-weight:700; min-width:16px; height:16px; border-radius:8px; align-items:center; justify-content:center; padding:0 3px;"></span>' +
        '</div>';
}

// Render notification panel HTML
function renderNotifPanelHTML() {
    return '<div id="notifPanel" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:white; z-index:2000; overflow-y:auto;"></div>';
}

// Initialize all navigation-related features
function initNavFeatures(activePage) {
    if (typeof initChatData === 'function') initChatData();
    if (typeof initNotifications === 'function') initNotifications();
    renderBottomNav(activePage);
    if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
}
