// ===== Chat System Logic =====
// Uses Firestore realtime when available, falls back to localStorage

function initChatData() {
    // If Firebase is available, no localStorage init needed
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        return;
    }
    // Fallback: localStorage
    if (!localStorage.getItem('healthdesk_conversations')) {
        localStorage.setItem('healthdesk_conversations', JSON.stringify(
            typeof mockConversations !== 'undefined' ? mockConversations : []
        ));
        localStorage.setItem('healthdesk_messages', JSON.stringify(
            typeof mockMessages !== 'undefined' ? mockMessages : {}
        ));
    }
}

function getConversations(callback) {
    // Try Firestore
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        var userId = getCurrentUserId();
        if (userId && callback) {
            FirebaseService.getConversations(userId).then(callback);
            return [];
        }
    }
    // Fallback
    var result = JSON.parse(localStorage.getItem('healthdesk_conversations') || '[]');
    if (callback) callback(result);
    return result;
}

function getMessages(convId, callback) {
    // Try Firestore
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        if (callback) {
            FirebaseService.getMessages(convId).then(callback);
            return [];
        }
    }
    // Fallback
    var allMessages = JSON.parse(localStorage.getItem('healthdesk_messages') || '{}');
    var result = allMessages[convId] || [];
    if (callback) callback(result);
    return result;
}

function getCurrentUserId() {
    var user = JSON.parse(localStorage.getItem('healthdesk_user'));
    if (user && user.id) return user.id;
    var patient = JSON.parse(localStorage.getItem('healthdesk_patient'));
    if (patient && patient.chatId) return patient.chatId;
    return null;
}

function getUnreadChatCount(callback) {
    var userId = getCurrentUserId();
    if (!userId) {
        if (callback) callback(0);
        return 0;
    }

    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined' && callback) {
        FirebaseService.getConversations(userId).then(function(convos) {
            var count = 0;
            for (var i = 0; i < convos.length; i++) {
                count += (convos[i].unreadCount && convos[i].unreadCount[userId]) || 0;
            }
            callback(count);
        });
        return 0;
    }

    var convos = getConversations();
    var count = 0;
    for (var i = 0; i < convos.length; i++) {
        if (convos[i].participants.indexOf(userId) !== -1) {
            count += (convos[i].unreadCount[userId] || 0);
        }
    }
    if (callback) callback(count);
    return count;
}

function getMyConversations(callback) {
    var userId = getCurrentUserId();
    if (!userId) {
        if (callback) callback([]);
        return [];
    }

    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined' && callback) {
        FirebaseService.getConversations(userId).then(function(convos) {
            callback(convos.sort(function(a, b) {
                return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
            }));
        });
        return [];
    }

    var convos = getConversations();
    var result = convos.filter(function(c) {
        return c.participants.indexOf(userId) !== -1;
    }).sort(function(a, b) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    if (callback) callback(result);
    return result;
}

function getParticipantInfo(participantId) {
    // Check staff
    if (typeof mockStaff !== 'undefined') {
        for (var i = 0; i < mockStaff.length; i++) {
            if (mockStaff[i].id === participantId) {
                return { name: mockStaff[i].name, role: mockStaff[i].roleLabel, type: 'staff' };
            }
        }
    }
    // Check patients
    if (typeof mockPatients !== 'undefined') {
        var patientNum = participantId.replace('patient-', '');
        for (var j = 0; j < mockPatients.length; j++) {
            var p = mockPatients[j];
            if (p.id === patientNum || p.id === parseInt(patientNum)) {
                return { name: p.firstName + ' ' + p.lastName, role: 'HN: ' + p.hn, type: 'patient' };
            }
        }
    }
    return { name: 'Unknown', role: '', type: 'unknown' };
}

function getOtherParticipant(conversation) {
    var userId = getCurrentUserId();
    for (var i = 0; i < conversation.participants.length; i++) {
        if (conversation.participants[i] !== userId) {
            return conversation.participants[i];
        }
    }
    return null;
}

function sendMessage(convId, text, callback) {
    var userId = getCurrentUserId();
    if (!userId || !text.trim()) {
        if (callback) callback(null);
        return null;
    }

    // Try Firestore
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        FirebaseService.sendMessage(convId, {
            sender: userId,
            text: text.trim()
        }).then(function(msgId) {
            var msg = { id: msgId, sender: userId, text: text.trim(), time: new Date().toISOString(), read: false };
            if (callback) callback(msg);
        });
        return null;
    }

    // Fallback: localStorage
    var allMessages = JSON.parse(localStorage.getItem('healthdesk_messages') || '{}');
    var convos = JSON.parse(localStorage.getItem('healthdesk_conversations') || '[]');

    var newMsg = {
        id: 'msg-' + Date.now(),
        sender: userId,
        text: text.trim(),
        time: new Date().toISOString(),
        read: false
    };

    if (!allMessages[convId]) allMessages[convId] = [];
    allMessages[convId].push(newMsg);

    for (var i = 0; i < convos.length; i++) {
        if (convos[i].id === convId) {
            convos[i].lastMessage = text.trim();
            convos[i].lastMessageTime = newMsg.time;
            for (var j = 0; j < convos[i].participants.length; j++) {
                var pid = convos[i].participants[j];
                if (pid !== userId) {
                    convos[i].unreadCount[pid] = (convos[i].unreadCount[pid] || 0) + 1;
                }
            }
            break;
        }
    }

    localStorage.setItem('healthdesk_messages', JSON.stringify(allMessages));
    localStorage.setItem('healthdesk_conversations', JSON.stringify(convos));

    if (callback) callback(newMsg);
    return newMsg;
}

function markConversationRead(convId) {
    var userId = getCurrentUserId();

    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        // Update unread count in Firestore
        var update = {};
        update['unreadCount.' + userId] = 0;
        db.collection('conversations').doc(convId).update(update);
        return;
    }

    // Fallback
    var convos = JSON.parse(localStorage.getItem('healthdesk_conversations') || '[]');
    for (var i = 0; i < convos.length; i++) {
        if (convos[i].id === convId) {
            convos[i].unreadCount[userId] = 0;
            break;
        }
    }
    localStorage.setItem('healthdesk_conversations', JSON.stringify(convos));
}

function createNewConversation(otherParticipantId, type, callback) {
    var userId = getCurrentUserId();

    // Try Firestore
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        // Check if conversation already exists
        FirebaseService.getConversations(userId).then(function(convos) {
            for (var i = 0; i < convos.length; i++) {
                if (convos[i].participants.indexOf(otherParticipantId) !== -1) {
                    if (callback) callback(convos[i].id);
                    return;
                }
            }
            // Create new
            FirebaseService.createConversation({
                participants: [userId, otherParticipantId],
                type: type || 'staff'
            }).then(function(convId) {
                if (callback) callback(convId);
            });
        });
        return null;
    }

    // Fallback
    var convos = JSON.parse(localStorage.getItem('healthdesk_conversations') || '[]');
    for (var i = 0; i < convos.length; i++) {
        if (convos[i].participants.indexOf(userId) !== -1 &&
            convos[i].participants.indexOf(otherParticipantId) !== -1) {
            if (callback) callback(convos[i].id);
            return convos[i].id;
        }
    }

    var newConv = {
        id: 'conv-' + Date.now(),
        participants: [userId, otherParticipantId],
        type: type || 'staff',
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: {}
    };
    newConv.unreadCount[userId] = 0;
    newConv.unreadCount[otherParticipantId] = 0;

    convos.push(newConv);
    localStorage.setItem('healthdesk_conversations', JSON.stringify(convos));

    var allMessages = JSON.parse(localStorage.getItem('healthdesk_messages') || '{}');
    allMessages[newConv.id] = [];
    localStorage.setItem('healthdesk_messages', JSON.stringify(allMessages));

    if (callback) callback(newConv.id);
    return newConv.id;
}

/**
 * Listen to messages in realtime (Firestore only)
 * @param {string} convId
 * @param {Function} callback
 * @returns {Function|null} unsubscribe function
 */
function onMessagesRealtime(convId, callback) {
    if (typeof FirebaseService !== 'undefined' && typeof db !== 'undefined') {
        return FirebaseService.onMessages(convId, callback);
    }
    return null;
}

function formatChatTime(dateStr) {
    if (!dateStr) return '';
    var date = new Date(dateStr);
    var now = new Date();
    var diffMs = now - date;
    var diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDay === 0) {
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDay === 1) {
        return 'เมื่อวาน';
    } else if (diffDay < 7) {
        return diffDay + ' วันที่แล้ว';
    } else {
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    }
}

function getAvatarInitial(name) {
    if (!name) return '?';
    return name.charAt(0);
}
