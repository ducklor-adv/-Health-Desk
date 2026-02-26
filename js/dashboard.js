/**
 * Dashboard Logic
 */

// Initialize dashboard
function initDashboard() {
    updateStats();
    renderHighRiskTable();
    renderActivityFeed();
    initCharts();
}

// Update statistics
function updateStats() {
    const totalPopulation = mockPatients.length;
    const screenedThisMonth = mockPatients.filter(p => {
        const lastCheckup = new Date(p.lastCheckup);
        const now = new Date();
        return lastCheckup.getMonth() === now.getMonth();
    }).length;
    const riskGroup = mockPatients.filter(p => p.riskLevel === 'high').length;
    const followUp = mockPatients.filter(p => {
        const nextAppt = new Date(p.nextAppointment);
        const inWeek = new Date();
        inWeek.setDate(inWeek.getDate() + 7);
        return nextAppt <= inWeek;
    }).length;

    // Animate numbers
    animateNumber('totalPopulation', totalPopulation);
    animateNumber('screenedThisMonth', screenedThisMonth);
    animateNumber('riskGroup', riskGroup);
    animateNumber('followUp', followUp);
}

// Animate number counting
function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('th-TH');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('th-TH');
        }
    }, 20);
}

// Render high risk patients table
function renderHighRiskTable() {
    const tbody = document.getElementById('highRiskTable');
    if (!tbody) return;

    const highRiskPatients = mockPatients
        .filter(p => p.riskLevel === 'high')
        .slice(0, 5);

    tbody.innerHTML = highRiskPatients.map(patient => {
        const diseases = patient.diseases.map(d => diseaseLabels[d] || d).join(', ');

        return `
            <tr>
                <td>${patient.hn}</td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.age}</td>
                <td>${diseases}</td>
                <td>${formatDate(patient.lastCheckup)}</td>
                <td><span class="priority-badge ${patient.riskLevel}">${riskLevelLabels[patient.riskLevel]}</span></td>
                <td>
                    <button class="btn-action view" onclick="viewPatient(${patient.id})">ดู</button>
                    <button class="btn-action edit" onclick="editPatient(${patient.id})">แก้ไข</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render activity feed
function renderActivityFeed() {
    const list = document.getElementById('activityList');
    if (!list) return;

    list.innerHTML = mockActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">โดย ${activity.user} • ${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Initialize charts
function initCharts() {
    initHealthTrendChart();
    initBMIChart();
}

// Health Trend Chart
function initHealthTrendChart() {
    const ctx = document.getElementById('healthTrendChart');
    if (!ctx) return;

    const labels = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'ความดันโลหิตสูง',
                    data: [145, 148, 142, 146, 150, 152],
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'น้ำตาลในเลือด',
                    data: [98, 102, 105, 108, 110, 112],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'BMI เฉลี่ย',
                    data: [24.5, 24.8, 25.0, 25.2, 25.4, 25.6],
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
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
                    display: false
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

// BMI Distribution Chart
function initBMIChart() {
    const ctx = document.getElementById('bmiChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ผอม', 'ปกติ', 'เกิน', 'อ้วน'],
            datasets: [{
                data: [15, 48, 27, 10],
                backgroundColor: [
                    '#60A5FA',
                    '#34D399',
                    '#FBBF24',
                    '#F87171'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// View patient
function viewPatient(id) {
    window.location.href = `patient-detail.html?id=${id}`;
}

// Edit patient
function editPatient(id) {
    window.location.href = `patient-edit.html?id=${id}`;
}

// Export report
function exportReport() {
    alert('กำลังสร้างรายงาน...\n\nในระบบจริงจะสร้างไฟล์ PDF/Excel ให้ดาวน์โหลด');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('healthTrendChart')) {
        initDashboard();
    }

    // Period selector
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            console.log('Period changed to:', this.value);
            // In real app, would reload data for selected period
            updateStats();
        });
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        viewPatient,
        editPatient,
        exportReport
    };
}
