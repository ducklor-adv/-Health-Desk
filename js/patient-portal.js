/**
 * Patient Portal Logic
 */

let currentPatient = null;

// Initialize patient portal
function initPatientPortal() {
    currentPatient = updatePatientInfo();
    if (!currentPatient) return;

    updateHealthSummary();
    renderHealthAlerts();
    renderRecommendations();
    renderRecentCheckups();
    initPatientHealthChart();
}

// Update health summary cards
function updateHealthSummary() {
    if (!currentPatient || !currentPatient.healthRecords || currentPatient.healthRecords.length === 0) {
        return;
    }

    const latestRecord = currentPatient.healthRecords[0];

    // Weight and BMI
    document.getElementById('latestWeight').textContent = `${latestRecord.weight} kg`;
    document.getElementById('latestBMI').textContent = latestRecord.bmi;

    const bmiCat = getBMICategory(parseFloat(latestRecord.bmi));
    const bmiCategoryEl = document.getElementById('bmiCategory');
    if (bmiCategoryEl) {
        bmiCategoryEl.textContent = bmiCat.label;
        bmiCategoryEl.style.color = bmiCat.color;
    }

    // Blood Pressure
    document.getElementById('latestBP').textContent = `${latestRecord.systolic}/${latestRecord.diastolic}`;
    const bpCat = getBPCategory(latestRecord.systolic, latestRecord.diastolic);
    document.getElementById('bpStatus').textContent = bpCat.label;

    // Blood Sugar
    if (latestRecord.bloodSugar) {
        document.getElementById('latestSugar').textContent = `${latestRecord.bloodSugar} mg/dL`;
        const sugarCat = getSugarCategory(latestRecord.bloodSugar);
        document.getElementById('sugarStatus').textContent = sugarCat.label;
    }

    // SpO2
    if (latestRecord.oxygenLevel) {
        const spo2El = document.getElementById('latestSpO2');
        if (spo2El) spo2El.textContent = `${latestRecord.oxygenLevel}%`;
        const spo2Cat = getSpO2Category(latestRecord.oxygenLevel);
        const spo2StatusEl = document.getElementById('spo2Status');
        if (spo2StatusEl) {
            spo2StatusEl.textContent = spo2Cat.alert ? `⚠️ ${spo2Cat.label}` : `✓ ${spo2Cat.label}`;
            spo2StatusEl.className = spo2Cat.alert ? 'status-warn' : 'status-ok';
        }
    }

    // Next Appointment
    if (currentPatient.nextAppointment) {
        const nextDate = new Date(currentPatient.nextAppointment);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        document.getElementById('nextAppointment').textContent = nextDate.toLocaleDateString('th-TH', options);

        // Calculate days until
        const today = new Date();
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        document.getElementById('daysUntil').textContent = `อีก ${daysUntil} วัน`;
    }
}

// Render health alerts
function renderHealthAlerts() {
    const container = document.getElementById('healthAlerts');
    if (!container || !currentPatient) return;

    const alerts = [];
    const latestRecord = currentPatient.healthRecords[0];

    // Check BP
    const bpCat = getBPCategory(latestRecord.systolic, latestRecord.diastolic);
    if (bpCat.alert) {
        alerts.push({
            type: 'warning',
            icon: '💉',
            title: 'ความดันโลหิตสูงกว่าปกติ',
            message: `ความดันของคุณอยู่ที่ ${latestRecord.systolic}/${latestRecord.diastolic} mmHg ควรติดตามใกล้ชิดและปรับเปลี่ยนพฤติกรรม`
        });
    }

    // Check BMI
    const bmi = parseFloat(latestRecord.bmi);
    if (bmi >= 25) {
        alerts.push({
            type: 'info',
            icon: '⚖️',
            title: 'น้ำหนักเกินมาตรฐาน',
            message: `BMI ของคุณอยู่ที่ ${bmi} แนะนำให้ออกกำลังกายและควบคุมอาหาร`
        });
    }

    // Check Sugar
    if (latestRecord.bloodSugar) {
        const sugarCat = getSugarCategory(latestRecord.bloodSugar);
        if (sugarCat.alert) {
            alerts.push({
                type: 'warning',
                icon: '🩸',
                title: 'ระดับน้ำตาลสูง',
                message: `ระดับน้ำตาลในเลือดอยู่ที่ ${latestRecord.bloodSugar} mg/dL ${sugarCat.label}`
            });
        }
    }

    // Check SpO2
    if (latestRecord.oxygenLevel) {
        const spo2Cat = getSpO2Category(latestRecord.oxygenLevel);
        if (spo2Cat.alert) {
            alerts.push({
                type: spo2Cat.category === 'critical' ? 'danger' : 'warning',
                icon: '🫁',
                title: 'ระดับออกซิเจนในเลือดต่ำ',
                message: `SpO2 ของคุณอยู่ที่ ${latestRecord.oxygenLevel}% (${spo2Cat.label}) ควรพบแพทย์`
            });
        }
    }

    // Check appointment
    if (currentPatient.nextAppointment) {
        const nextDate = new Date(currentPatient.nextAppointment);
        const today = new Date();
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntil <= 7 && daysUntil > 0) {
            alerts.push({
                type: 'info',
                icon: '📅',
                title: 'นัดหมายใกล้เข้ามา',
                message: `คุณมีนัดตรวจสุขภาพในอีก ${daysUntil} วัน กรุณามาตรงเวลา`
            });
        }
    }

    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="alert-card success-alert">
                <span class="alert-icon-large">✅</span>
                <div class="alert-content">
                    <h4>สุขภาพดีมาก!</h4>
                    <p>ไม่มีเรื่องที่ต้องกังวล ขอให้รักษาสุขภาพต่อไปนะคะ</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = alerts.map(alert => `
            <div class="alert-card ${alert.type}-alert">
                <span class="alert-icon-large">${alert.icon}</span>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                </div>
            </div>
        `).join('');
    }
}

// Render recommendations
function renderRecommendations() {
    const container = document.getElementById('recommendations');
    if (!container || !currentPatient) return;

    const recommendations = [
        {
            icon: '🏃',
            title: 'ออกกำลังกาย',
            description: 'ออกกำลังกายสม่ำเสมออย่างน้อยสัปดาห์ละ 3 ครั้ง ครั้งละ 30 นาที'
        },
        {
            icon: '🥗',
            title: 'รับประทานอาหารเพื่อสุขภาพ',
            description: 'เพิ่มผักผลไม้ ลดอาหารมัน เค็ม หวาน'
        },
        {
            icon: '💧',
            title: 'ดื่มน้ำเพียงพอ',
            description: 'ดื่มน้ำวันละ 8-10 แก้ว เพื่อสุขภาพที่ดี'
        },
        {
            icon: '😴',
            title: 'พักผ่อนให้เพียงพอ',
            description: 'นอนหลับให้ได้อย่างน้อย 7-8 ชั่วโมงต่อวัน'
        }
    ];

    // Add specific recommendations based on health status
    if (currentPatient.diseases.includes('hypertension')) {
        recommendations.unshift({
            icon: '🧂',
            title: 'ลดการบริโภคเกลือ',
            description: 'งดอาหารรสจัด ลดเกลือในอาหาร เพื่อควบคุมความดัน'
        });
    }

    if (currentPatient.diseases.includes('diabetes')) {
        recommendations.unshift({
            icon: '🍬',
            title: 'ควบคุมน้ำตาล',
            description: 'งดของหวาน เลือกคาร์โบไฮเดรตเชิงซ้อน ตรวจน้ำตาลสม่ำเสมอ'
        });
    }

    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <span class="rec-icon">${rec.icon}</span>
            <div class="rec-content">
                <div class="rec-title">${rec.title}</div>
                <div class="rec-description">${rec.description}</div>
            </div>
        </div>
    `).join('');
}

// Render recent checkups
function renderRecentCheckups() {
    const container = document.getElementById('recentCheckups');
    if (!container || !currentPatient) return;

    // Mock recent checkups
    const checkups = [
        {
            date: currentPatient.lastCheckup,
            type: 'ตรวจสุขภาพประจำเดือน',
            status: 'completed',
            by: 'พยาบาลสมหญิง รักษา'
        }
    ];

    container.innerHTML = checkups.map(checkup => {
        const date = new Date(checkup.date);
        const dateStr = date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

        return `
            <div class="checkup-item">
                <div class="checkup-date">
                    <div class="date-badge">${date.getDate()}</div>
                    <div class="date-month">${date.toLocaleDateString('th-TH', { month: 'short' })}</div>
                </div>
                <div class="checkup-details">
                    <div class="checkup-type">${checkup.type}</div>
                    <div class="checkup-meta">
                        <span>📅 ${dateStr}</span>
                        <span>👨‍⚕️ ${checkup.by}</span>
                    </div>
                    <span class="status-badge success">✓ เสร็จสิ้น</span>
                </div>
                <button class="btn-view-checkup" onclick="viewCheckupDetail()">ดู</button>
            </div>
        `;
    }).join('');
}

// Initialize patient health chart
function initPatientHealthChart() {
    const ctx = document.getElementById('patientHealthTrendChart');
    if (!ctx) return;

    // Mock data for trend
    const labels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
    const bmiData = [27.2, 26.8, 26.5, 26.1, 25.8, 25.5];
    const bpSysData = [140, 138, 136, 135, 133, 130];
    const sugarData = [115, 112, 110, 108, 105, 103];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'BMI',
                    data: bmiData,
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'ความดันโลหิต (Systolic)',
                    data: bpSysData,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'น้ำตาลในเลือด',
                    data: sugarData,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 200,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: '#E5E7EB'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// View checkup detail
function viewCheckupDetail() {
    alert('รายละเอียดการตรวจ\n\nในระบบจริงจะแสดงข้อมูลการตรวจแบบละเอียด');
}

// Print health report
function printHealthReport() {
    alert('กำลังเตรียมรายงานสุขภาพ...\n\nในระบบจริงจะสร้างรายงาน PDF ให้พิมพ์');
}

// Share health data
function shareHealthData() {
    alert('แชร์ข้อมูลสุขภาพ\n\nคุณสามารถแชร์ข้อมูลสุขภาพให้แพทย์หรือครอบครัวได้\n\n(ต้องได้รับความยินยอมก่อน)');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('patientHealthTrendChart')) {
        initPatientPortal();
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPatientPortal,
        printHealthReport,
        shareHealthData
    };
}
