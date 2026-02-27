/**
 * Firebase Service Layer — Health Desk
 * Abstraction layer สำหรับ Firestore CRUD operations
 * ออกแบบให้สามารถเปลี่ยน backend ได้ในอนาคต
 */

var FirebaseService = (function() {

    // ============================================================
    // PATIENTS
    // ============================================================

    /**
     * ดึงรายชื่อผู้ป่วยทั้งหมด
     * @param {Object} filters - { riskLevel, disease, search }
     * @returns {Promise<Array>}
     */
    function getPatients(filters) {
        var query = db.collection('patients');

        return query.get().then(function(snapshot) {
            var patients = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                if (data.status && data.status !== 'active') return;
                patients.push(data);
            });

            // Sort by lastName client-side
            patients.sort(function(a, b) {
                return (a.lastName || '').localeCompare(b.lastName || '', 'th');
            });

            if (filters && filters.riskLevel) {
                patients = patients.filter(function(p) {
                    return p.riskLevel === filters.riskLevel;
                });
            }

            // Client-side filtering for search and disease
            if (filters && filters.search) {
                var s = filters.search.toLowerCase();
                patients = patients.filter(function(p) {
                    return p.firstName.toLowerCase().indexOf(s) !== -1 ||
                        p.lastName.toLowerCase().indexOf(s) !== -1 ||
                        p.hn.toLowerCase().indexOf(s) !== -1 ||
                        (p.citizenId && p.citizenId.indexOf(s) !== -1);
                });
            }

            if (filters && filters.disease) {
                patients = patients.filter(function(p) {
                    return p.diseases && p.diseases.indexOf(filters.disease) !== -1;
                });
            }

            return patients;
        });
    }

    /**
     * ดึงผู้ป่วยรายคน โดย document ID
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    function getPatientById(id) {
        return db.collection('patients').doc(id).get().then(function(doc) {
            if (!doc.exists) return null;
            var data = doc.data();
            data.id = doc.id;
            return data;
        });
    }

    /**
     * ค้นหาผู้ป่วยด้วย HN
     * @param {string} hn
     * @returns {Promise<Object|null>}
     */
    function getPatientByHN(hn) {
        return db.collection('patients')
            .where('hn', '==', hn.toUpperCase())
            .limit(1)
            .get()
            .then(function(snapshot) {
                if (snapshot.empty) return null;
                var doc = snapshot.docs[0];
                var data = doc.data();
                data.id = doc.id;
                return data;
            });
    }

    /**
     * ค้นหาผู้ป่วยด้วยเลขบัตรประชาชน
     * @param {string} citizenId
     * @returns {Promise<Object|null>}
     */
    function getPatientByCitizenId(citizenId) {
        return db.collection('patients')
            .where('citizenId', '==', citizenId)
            .limit(1)
            .get()
            .then(function(snapshot) {
                if (snapshot.empty) return null;
                var doc = snapshot.docs[0];
                var data = doc.data();
                data.id = doc.id;
                return data;
            });
    }

    /**
     * สร้างผู้ป่วยใหม่
     * @param {Object} data
     * @returns {Promise<string>} document ID
     */
    function createPatient(data) {
        data.registeredAt = firebase.firestore.FieldValue.serverTimestamp();
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        data.status = data.status || 'active';

        return db.collection('patients').add(data).then(function(docRef) {
            return docRef.id;
        });
    }

    /**
     * อัพเดทข้อมูลผู้ป่วย
     * @param {string} id - document ID
     * @param {Object} data - fields to update
     * @returns {Promise}
     */
    function updatePatient(id, data) {
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        return db.collection('patients').doc(id).update(data);
    }

    /**
     * ค้นหาผู้ป่วย (search by name, HN, citizenId)
     * @param {string} search
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    function searchPatients(search, limit) {
        limit = limit || 10;
        // Firestore doesn't support full-text search, so we fetch active patients and filter client-side
        return db.collection('patients')
            .where('status', '==', 'active')
            .get()
            .then(function(snapshot) {
                var results = [];
                var s = search.toLowerCase();
                snapshot.forEach(function(doc) {
                    var p = doc.data();
                    p.id = doc.id;
                    if (p.firstName.toLowerCase().indexOf(s) !== -1 ||
                        p.lastName.toLowerCase().indexOf(s) !== -1 ||
                        p.hn.toLowerCase().indexOf(s) !== -1 ||
                        (p.citizenId && p.citizenId.indexOf(s) !== -1)) {
                        results.push(p);
                    }
                });
                return results.slice(0, limit);
            });
    }

    // ============================================================
    // HEALTH RECORDS (SubCollection)
    // ============================================================

    /**
     * เพิ่มข้อมูลการตรวจสุขภาพ
     * @param {string} patientId
     * @param {Object} record
     * @returns {Promise<string>}
     */
    function addHealthRecord(patientId, record) {
        record.date = record.date || firebase.firestore.FieldValue.serverTimestamp();
        record.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        // Auto-calculate BMI
        if (record.weight && record.height) {
            record.bmi = parseFloat((record.weight / Math.pow(record.height / 100, 2)).toFixed(1));
        }

        // Auto-calculate BP category
        if (record.systolic && record.diastolic) {
            if (record.systolic < 120 && record.diastolic < 80) {
                record.bpCategory = 'normal';
            } else if (record.systolic < 140 && record.diastolic < 90) {
                record.bpCategory = 'prehypertension';
            } else {
                record.bpCategory = 'hypertension';
            }
        }

        return db.collection('patients').doc(patientId)
            .collection('healthRecords').add(record)
            .then(function(docRef) {
                // Update patient's lastCheckup
                updatePatient(patientId, {
                    lastCheckup: record.date
                });
                return docRef.id;
            });
    }

    /**
     * ดึงประวัติการตรวจสุขภาพ
     * @param {string} patientId
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    function getHealthRecords(patientId, limit) {
        var query = db.collection('patients').doc(patientId)
            .collection('healthRecords')
            .orderBy('date', 'desc');

        if (limit) {
            query = query.limit(limit);
        }

        return query.get().then(function(snapshot) {
            var records = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                // Convert Firestore Timestamp to date string
                if (data.date && data.date.toDate) {
                    data.date = data.date.toDate().toISOString().split('T')[0];
                }
                if (data.followUpDate && data.followUpDate.toDate) {
                    data.followUpDate = data.followUpDate.toDate().toISOString().split('T')[0];
                }
                records.push(data);
            });
            return records;
        });
    }

    // ============================================================
    // STAFF
    // ============================================================

    /**
     * ดึงข้อมูล staff จาก Firestore (by auth uid)
     * @param {string} uid - Firebase Auth UID
     * @returns {Promise<Object|null>}
     */
    function getStaffByUid(uid) {
        return db.collection('staff').doc(uid).get().then(function(doc) {
            if (!doc.exists) return null;
            var data = doc.data();
            data.id = doc.id;
            return data;
        });
    }

    /**
     * ดึงข้อมูล staff จาก email
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    function getStaffByEmail(email) {
        return db.collection('staff')
            .where('email', '==', email)
            .limit(1)
            .get()
            .then(function(snapshot) {
                if (snapshot.empty) return null;
                var doc = snapshot.docs[0];
                var data = doc.data();
                data.id = doc.id;
                return data;
            });
    }

    /**
     * ดึง staff ทั้งหมด
     * @returns {Promise<Array>}
     */
    function getAllStaff() {
        return db.collection('staff')
            .where('status', '==', 'active')
            .get()
            .then(function(snapshot) {
                var staff = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    staff.push(data);
                });
                return staff;
            });
    }

    // ============================================================
    // AUTH
    // ============================================================

    /**
     * Staff Login — Firebase Auth Email/Password
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>} staff data
     */
    function loginStaff(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
            .then(function(credential) {
                return getStaffByEmail(email).then(function(staffData) {
                    if (!staffData) {
                        throw new Error('ไม่พบข้อมูลเจ้าหน้าที่ในระบบ');
                    }
                    // Store in localStorage for backward compatibility
                    var userData = {
                        email: email,
                        id: staffData.id,
                        uid: credential.user.uid,
                        name: staffData.name,
                        role: staffData.role,
                        roleLabel: staffData.roleLabel
                    };
                    localStorage.setItem('healthdesk_user', JSON.stringify(userData));
                    return userData;
                });
            });
    }

    /**
     * Patient Login — Anonymous Auth + HN/วันเกิด verification
     * ออกแบบสำหรับคนแก่ชาวบ้าน: แค่กรอก HN + วันเกิด
     * @param {string} hnOrCid - HN หรือ เลขบัตรประชาชน
     * @param {string} dateOfBirth - วันเกิด format YYYY-MM-DD
     * @returns {Promise<Object>} patient data
     */
    function loginPatient(hnOrCid, dateOfBirth) {
        // Step 1: Query Firestore for matching patient
        var lookupPromise;
        if (hnOrCid.toUpperCase().startsWith('HN')) {
            lookupPromise = getPatientByHN(hnOrCid);
        } else {
            lookupPromise = getPatientByCitizenId(hnOrCid);
        }

        return lookupPromise.then(function(patient) {
            if (!patient) {
                throw new Error('ไม่พบข้อมูล กรุณาตรวจสอบ HN หรือเลขบัตรประชาชน');
            }

            // Step 2: Verify date of birth
            if (dateOfBirth && patient.dateOfBirth && patient.dateOfBirth !== dateOfBirth) {
                throw new Error('วันเกิดไม่ตรงกับข้อมูลในระบบ');
            }

            // Step 3: Sign in anonymously
            return auth.signInAnonymously().then(function() {
                // Store patient data for backward compatibility
                patient.chatId = 'patient-' + patient.id;
                localStorage.setItem('healthdesk_patient', JSON.stringify(patient));
                return patient;
            });
        });
    }

    /**
     * Logout
     * @returns {Promise}
     */
    function logout() {
        localStorage.removeItem('healthdesk_user');
        localStorage.removeItem('healthdesk_patient');
        return auth.signOut();
    }

    /**
     * ดึง user ปัจจุบัน
     * @returns {Object|null}
     */
    function getCurrentUser() {
        return auth.currentUser;
    }

    /**
     * ดึง staff/patient data จาก localStorage (backward compat)
     * @returns {Object|null}
     */
    function getCurrentStaff() {
        var data = localStorage.getItem('healthdesk_user');
        return data ? JSON.parse(data) : null;
    }

    function getCurrentPatient() {
        var data = localStorage.getItem('healthdesk_patient');
        return data ? JSON.parse(data) : null;
    }

    // ============================================================
    // APPOINTMENTS
    // ============================================================

    /**
     * ดึงนัดหมายของผู้ป่วย
     * @param {string} patientId
     * @returns {Promise<Array>}
     */
    function getAppointments(patientId) {
        return db.collection('appointments').get()
            .then(function(snapshot) {
                var appointments = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    if (data.patientId !== patientId) return;
                    if (data.date && data.date.toDate) {
                        data.date = data.date.toDate().toISOString();
                    }
                    appointments.push(data);
                });
                appointments.sort(function(a, b) {
                    return new Date(b.date || 0) - new Date(a.date || 0);
                });
                return appointments;
            });
    }

    /**
     * สร้างนัดหมายใหม่
     * @param {Object} data
     * @returns {Promise<string>}
     */
    function createAppointment(data) {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.status = data.status || 'scheduled';

        return db.collection('appointments').add(data).then(function(docRef) {
            // Update patient's nextAppointment
            if (data.patientId && data.date) {
                updatePatient(data.patientId, { nextAppointment: data.date });
            }
            return docRef.id;
        });
    }

    /**
     * เลื่อนนัดหมาย
     * @param {string} appointmentId
     * @param {string} newDate - ISO date string
     * @param {string} reason
     * @returns {Promise}
     */
    function rescheduleAppointment(appointmentId, newDate, reason) {
        return db.collection('appointments').doc(appointmentId).get()
            .then(function(doc) {
                if (!doc.exists) throw new Error('ไม่พบนัดหมาย');
                var appt = doc.data();
                var oldDate = appt.date;

                // Update appointment
                return doc.ref.update({
                    date: new Date(newDate),
                    rescheduledFrom: oldDate,
                    rescheduleReason: reason || '',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                    // Update patient's nextAppointment
                    if (appt.patientId) {
                        updatePatient(appt.patientId, { nextAppointment: new Date(newDate) });
                    }
                    // Create notification for patient
                    createNotification({
                        type: 'reschedule',
                        icon: '📅',
                        title: 'เปลี่ยนแปลงนัดหมาย',
                        message: 'นัดหมายเปลี่ยนเป็นวันที่ ' + new Date(newDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) + (reason ? ' เหตุผล: ' + reason : ''),
                        forRoles: ['patient'],
                        forPatientId: appt.patientId
                    });
                    return { oldDate: oldDate, newDate: newDate };
                });
            });
    }

    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    /**
     * ดึง notifications
     * @param {string} userId - staff ID or patient ID
     * @param {string} role - 'doctor', 'worker', 'patient'
     * @returns {Promise<Array>}
     */
    function getNotifications(userId, role) {
        return db.collection('notifications').get().then(function(snapshot) {
            var notifs = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                if (data.createdAt && data.createdAt.toDate) {
                    data.time = data.createdAt.toDate().toISOString();
                }

                // Filter by role or patient
                if (role === 'patient') {
                    if (data.forPatientId === userId) notifs.push(data);
                } else {
                    if (data.forRoles && data.forRoles.indexOf(role) !== -1 && !data.forPatientId) {
                        notifs.push(data);
                    }
                }
            });

            // Sort by time desc
            notifs.sort(function(a, b) {
                return new Date(b.time || 0) - new Date(a.time || 0);
            });

            return notifs;
        });
    }

    /**
     * สร้าง notification ใหม่
     * @param {Object} data
     * @returns {Promise<string>}
     */
    function createNotification(data) {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.read = false;
        data.readAt = null;
        data.createdBy = data.createdBy || '';

        return db.collection('notifications').add(data).then(function(docRef) {
            return docRef.id;
        });
    }

    /**
     * Mark notification as read
     * @param {string} notifId
     * @returns {Promise}
     */
    function markNotificationRead(notifId) {
        return db.collection('notifications').doc(notifId).update({
            read: true,
            readAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    /**
     * Mark all notifications read for a role
     * @param {string} role
     * @returns {Promise}
     */
    function markAllNotificationsRead(role) {
        return db.collection('notifications').get()
            .then(function(snapshot) {
                var batch = db.batch();
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    if (data.forRoles && data.forRoles.indexOf(role) !== -1 && !data.read) {
                        batch.update(doc.ref, {
                            read: true,
                            readAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                });
                return batch.commit();
            });
    }

    /**
     * Listen to notifications in realtime
     * @param {string} role
     * @param {Function} callback
     * @returns {Function} unsubscribe function
     */
    function onNotifications(role, callback) {
        return db.collection('notifications')
            .onSnapshot(function(snapshot) {
                var notifs = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    if (data.createdAt && data.createdAt.toDate) {
                        data.time = data.createdAt.toDate().toISOString();
                    }
                    if (data.forRoles && data.forRoles.indexOf(role) !== -1) {
                        notifs.push(data);
                    }
                });
                notifs.sort(function(a, b) {
                    return new Date(b.time || 0) - new Date(a.time || 0);
                });
                callback(notifs);
            });
    }

    // ============================================================
    // CHAT (Realtime)
    // ============================================================

    /**
     * ดึง conversations ของ user
     * @param {string} userId
     * @returns {Promise<Array>}
     */
    function getConversations(userId) {
        return db.collection('conversations').get()
            .then(function(snapshot) {
                var convos = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    if (data.participants && data.participants.indexOf(userId) === -1) return;
                    if (data.lastMessageTime && data.lastMessageTime.toDate) {
                        data.lastMessageTime = data.lastMessageTime.toDate().toISOString();
                    }
                    convos.push(data);
                });
                convos.sort(function(a, b) {
                    return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
                });
                return convos;
            });
    }

    /**
     * ดึงข้อความในห้องแชท
     * @param {string} conversationId
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    function getMessages(conversationId, limit) {
        var query = db.collection('conversations').doc(conversationId)
            .collection('messages')
            .orderBy('time', 'asc');

        if (limit) {
            query = query.limitToLast(limit);
        }

        return query.get().then(function(snapshot) {
            var messages = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                if (data.time && data.time.toDate) {
                    data.time = data.time.toDate().toISOString();
                }
                messages.push(data);
            });
            return messages;
        });
    }

    /**
     * ส่งข้อความ
     * @param {string} conversationId
     * @param {Object} message - { sender, text }
     * @returns {Promise<string>}
     */
    function sendMessage(conversationId, message) {
        message.time = firebase.firestore.FieldValue.serverTimestamp();
        message.read = false;

        var convRef = db.collection('conversations').doc(conversationId);

        return convRef.collection('messages').add(message).then(function(docRef) {
            // Update conversation metadata
            return convRef.update({
                lastMessage: message.text,
                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                return docRef.id;
            });
        });
    }

    /**
     * Listen to messages in realtime
     * @param {string} conversationId
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    function onMessages(conversationId, callback) {
        return db.collection('conversations').doc(conversationId)
            .collection('messages')
            .orderBy('time', 'asc')
            .onSnapshot(function(snapshot) {
                var messages = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    if (data.time && data.time.toDate) {
                        data.time = data.time.toDate().toISOString();
                    }
                    messages.push(data);
                });
                callback(messages);
            });
    }

    /**
     * สร้าง conversation ใหม่
     * @param {Object} data - { participants, type }
     * @returns {Promise<string>}
     */
    function createConversation(data) {
        data.lastMessage = '';
        data.lastMessageTime = firebase.firestore.FieldValue.serverTimestamp();
        data.unreadCount = {};
        data.participants.forEach(function(p) {
            data.unreadCount[p] = 0;
        });

        return db.collection('conversations').add(data).then(function(docRef) {
            return docRef.id;
        });
    }

    // ============================================================
    // STORAGE (Images)
    // ============================================================

    /**
     * Upload image to Firebase Storage
     * @param {File|Blob|string} file - File object or data URL
     * @param {string} path - storage path e.g. 'patients/HN12345/profile.jpg'
     * @returns {Promise<string>} download URL
     */
    function uploadImage(file, path) {
        var ref = storage.ref(path);

        if (typeof file === 'string' && file.startsWith('data:')) {
            // Data URL
            return ref.putString(file, 'data_url').then(function(snapshot) {
                return snapshot.ref.getDownloadURL();
            });
        } else {
            return ref.put(file).then(function(snapshot) {
                return snapshot.ref.getDownloadURL();
            });
        }
    }

    // ============================================================
    // DATA PORTABILITY (Export/Import)
    // ============================================================

    /**
     * Export patient data as JSON
     * @param {string} patientId
     * @returns {Promise<Object>}
     */
    function exportPatientData(patientId) {
        var result = {};

        return getPatientById(patientId).then(function(patient) {
            result.patient = patient;
            return getHealthRecords(patientId);
        }).then(function(records) {
            result.healthRecords = records;
            return getAppointments(patientId);
        }).then(function(appointments) {
            result.appointments = appointments;
            result.exportDate = new Date().toISOString();
            result.system = 'Health Desk Community';
            return result;
        });
    }

    /**
     * Import patient data from JSON
     * @param {Object} data - exported data
     * @returns {Promise<string>} new patient ID
     */
    function importPatientData(data) {
        if (!data.patient) throw new Error('Invalid import data');

        var patientData = data.patient;
        delete patientData.id; // Remove old ID

        return createPatient(patientData).then(function(newId) {
            // Import health records
            var promises = [];
            if (data.healthRecords) {
                data.healthRecords.forEach(function(record) {
                    delete record.id;
                    promises.push(addHealthRecord(newId, record));
                });
            }
            return Promise.all(promises).then(function() {
                return newId;
            });
        });
    }

    // ============================================================
    // SEED DATA (Initial data setup)
    // ============================================================

    /**
     * Check if Firestore has been seeded
     * @returns {Promise<boolean>}
     */
    function isSeeded() {
        return db.collection('patients').limit(1).get().then(function(snapshot) {
            return !snapshot.empty;
        });
    }

    // ============================================================
    // SUPER ADMIN — Staff CRUD, Stats, Audit Log, Export
    // ============================================================

    function createStaff(data) {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        data.status = data.status || 'active';
        if (data.docId) {
            var docId = data.docId;
            delete data.docId;
            return db.collection('staff').doc(docId).set(data).then(function() {
                return docId;
            });
        }
        return db.collection('staff').add(data).then(function(docRef) {
            return docRef.id;
        });
    }

    function updateStaff(id, data) {
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        return db.collection('staff').doc(id).update(data);
    }

    function deleteStaff(id) {
        return db.collection('staff').doc(id).update({
            status: 'inactive',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    function getAllStaffIncludeInactive() {
        return db.collection('staff').get().then(function(snapshot) {
            var staff = [];
            snapshot.forEach(function(doc) {
                var data = doc.data();
                data.id = doc.id;
                staff.push(data);
            });
            return staff;
        });
    }

    function getSystemStats() {
        var stats = {};
        return db.collection('patients').get().then(function(snap) {
            stats.totalPatients = snap.size;
            stats.activePatients = 0;
            stats.riskHigh = 0;
            stats.riskMedium = 0;
            snap.forEach(function(doc) {
                var d = doc.data();
                if (d.status === 'active') stats.activePatients++;
                if (d.riskLevel === 'high') stats.riskHigh++;
                if (d.riskLevel === 'medium') stats.riskMedium++;
            });
            return db.collection('staff').get();
        }).then(function(snap) {
            stats.totalStaff = snap.size;
            stats.activeStaff = 0;
            snap.forEach(function(doc) {
                if (doc.data().status === 'active') stats.activeStaff++;
            });
            return db.collection('appointments').get();
        }).then(function(snap) {
            stats.totalAppointments = snap.size;
            stats.scheduledAppointments = 0;
            snap.forEach(function(doc) {
                if (doc.data().status === 'scheduled') stats.scheduledAppointments++;
            });
            return db.collection('conversations').get();
        }).then(function(snap) {
            stats.totalConversations = snap.size;
            return db.collection('notifications').get();
        }).then(function(snap) {
            stats.totalNotifications = snap.size;
            return stats;
        });
    }

    function addAuditLog(entry) {
        entry.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        return db.collection('audit_log').add(entry).then(function(docRef) {
            return docRef.id;
        });
    }

    function getAuditLog(limit) {
        limit = limit || 50;
        return db.collection('audit_log')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get()
            .then(function(snapshot) {
                var logs = [];
                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    data.id = doc.id;
                    if (data.timestamp && data.timestamp.toDate) {
                        data.timestamp = data.timestamp.toDate().toISOString();
                    }
                    logs.push(data);
                });
                return logs;
            });
    }

    function exportAllData() {
        var result = { exportDate: new Date().toISOString(), system: 'Health Desk Community' };
        return db.collection('patients').get().then(function(snap) {
            result.patients = [];
            snap.forEach(function(doc) {
                var d = doc.data(); d.id = doc.id;
                result.patients.push(d);
            });
            return db.collection('staff').get();
        }).then(function(snap) {
            result.staff = [];
            snap.forEach(function(doc) {
                var d = doc.data(); d.id = doc.id;
                result.staff.push(d);
            });
            return db.collection('appointments').get();
        }).then(function(snap) {
            result.appointments = [];
            snap.forEach(function(doc) {
                var d = doc.data(); d.id = doc.id;
                result.appointments.push(d);
            });
            return db.collection('notifications').get();
        }).then(function(snap) {
            result.notifications = [];
            snap.forEach(function(doc) {
                var d = doc.data(); d.id = doc.id;
                result.notifications.push(d);
            });
            return result;
        });
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        // Patients
        getPatients: getPatients,
        getPatientById: getPatientById,
        getPatientByHN: getPatientByHN,
        getPatientByCitizenId: getPatientByCitizenId,
        createPatient: createPatient,
        updatePatient: updatePatient,
        searchPatients: searchPatients,

        // Health Records
        addHealthRecord: addHealthRecord,
        getHealthRecords: getHealthRecords,

        // Staff
        getStaffByUid: getStaffByUid,
        getStaffByEmail: getStaffByEmail,
        getAllStaff: getAllStaff,

        // Auth
        loginStaff: loginStaff,
        loginPatient: loginPatient,
        logout: logout,
        getCurrentUser: getCurrentUser,
        getCurrentStaff: getCurrentStaff,
        getCurrentPatient: getCurrentPatient,

        // Appointments
        getAppointments: getAppointments,
        createAppointment: createAppointment,
        rescheduleAppointment: rescheduleAppointment,

        // Notifications
        getNotifications: getNotifications,
        createNotification: createNotification,
        markNotificationRead: markNotificationRead,
        markAllNotificationsRead: markAllNotificationsRead,
        onNotifications: onNotifications,

        // Chat
        getConversations: getConversations,
        getMessages: getMessages,
        sendMessage: sendMessage,
        onMessages: onMessages,
        createConversation: createConversation,

        // Storage
        uploadImage: uploadImage,

        // Data Portability
        exportPatientData: exportPatientData,
        importPatientData: importPatientData,

        // Super Admin
        createStaff: createStaff,
        updateStaff: updateStaff,
        deleteStaff: deleteStaff,
        getAllStaffIncludeInactive: getAllStaffIncludeInactive,
        getSystemStats: getSystemStats,
        addAuditLog: addAuditLog,
        getAuditLog: getAuditLog,
        exportAllData: exportAllData,

        // Utils
        isSeeded: isSeeded
    };

})();
