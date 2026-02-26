/**
 * Field App Logic - Health Record Entry
 */

let currentPatient = null;

// Search patient
function searchPatient() {
    const query = document.getElementById('searchPatient').value.trim().toLowerCase();
    if (!query) {
        alert('กรุณากรอกข้อมูลที่ต้องการค้นหา');
        return;
    }

    const results = mockPatients.filter(p =>
        p.hn.toLowerCase().includes(query) ||
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.citizenId.includes(query)
    );

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; text-align: center; color: #6B7280;">ไม่พบข้อมูล</p>';
        return;
    }

    container.innerHTML = results.map(patient => `
        <div class="search-result-item" onclick="selectPatient(${patient.id})">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${patient.firstName} ${patient.lastName}</strong>
                    <div style="font-size: 0.875rem; color: #6B7280;">
                        HN: ${patient.hn} | อายุ ${patient.age} ปี | ${patient.gender === 'male' ? 'ชาย' : 'หญิง'}
                    </div>
                </div>
                <span style="color: #4F46E5; font-weight: 600;">เลือก →</span>
            </div>
        </div>
    `).join('');
}

// Select patient
function selectPatient(id) {
    currentPatient = mockPatients.find(p => p.id === id);
    if (!currentPatient) return;

    // Show patient info card
    const card = document.getElementById('patientInfoCard');
    if (card) {
        card.style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth' });
    }

    // Update patient info
    const avatar = document.getElementById('patientAvatar');
    const name = document.getElementById('patientName');
    const info = document.getElementById('patientInfo');

    if (avatar) avatar.textContent = currentPatient.firstName.substring(0, 2);
    if (name) name.textContent = `${currentPatient.firstName} ${currentPatient.lastName}`;
    if (info) info.textContent = `HN: ${currentPatient.hn} | อายุ ${currentPatient.age} ปี | เพศ ${currentPatient.gender === 'male' ? 'ชาย' : 'หญิง'}`;

    // Clear search results
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchPatient').value = '';

    // Reset form
    resetForm();
}

// View patient history
function viewHistory() {
    if (!currentPatient) return;
    alert(`ประวัติการรักษาของ ${currentPatient.firstName} ${currentPatient.lastName}\n\n` +
        `ตรวจล่าสุด: ${formatDate(currentPatient.lastCheckup)}\n` +
        `โรคประจำตัว: ${currentPatient.diseases.map(d => diseaseLabels[d]).join(', ') || 'ไม่มี'}\n` +
        `ระดับความเสี่ยง: ${riskLevelLabels[currentPatient.riskLevel]}`
    );
}

// Initialize form listeners
function initFormListeners() {
    const form = document.getElementById('healthRecordForm');
    if (!form) return;

    // Weight and Height - Calculate BMI
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');

    function calculateBMI() {
        const w = parseFloat(weight.value);
        const h = parseFloat(height.value);

        if (w && h && h > 0) {
            const bmi = (w / ((h / 100) ** 2)).toFixed(1);
            const category = getBMICategory(parseFloat(bmi));

            const result = document.getElementById('bmiResult');
            const value = document.getElementById('bmiValue');
            const status = document.getElementById('bmiStatus');

            if (result && value && status) {
                result.style.display = 'flex';
                value.textContent = bmi;
                status.textContent = category.label;
                status.style.color = category.color;
            }
        }
    }

    if (weight) weight.addEventListener('input', calculateBMI);
    if (height) height.addEventListener('input', calculateBMI);

    // Blood Pressure - Check alerts
    const systolic = document.getElementById('systolic');
    const diastolic = document.getElementById('diastolic');

    function checkBP() {
        const sys = parseFloat(systolic.value);
        const dia = parseFloat(diastolic.value);

        if (sys && dia) {
            const category = getBPCategory(sys, dia);
            const alert = document.getElementById('bpAlert');
            const alertText = document.getElementById('bpAlertText');

            if (category.alert && alert && alertText) {
                alert.style.display = 'flex';
                alertText.textContent = `${category.label} (${sys}/${dia} mmHg)`;
            } else if (alert) {
                alert.style.display = 'none';
            }
        }
    }

    if (systolic) systolic.addEventListener('input', checkBP);
    if (diastolic) diastolic.addEventListener('input', checkBP);

    // Blood Sugar - Check alerts
    const bloodSugar = document.getElementById('bloodSugar');
    const testType = document.getElementById('testType');

    function checkSugar() {
        const sugar = parseFloat(bloodSugar.value);
        const type = testType ? testType.value : 'fasting';

        if (sugar) {
            const category = getSugarCategory(sugar, type);
            const alert = document.getElementById('sugarAlert');
            const alertText = document.getElementById('sugarAlertText');

            if (category.alert && alert && alertText) {
                alert.style.display = 'flex';
                alertText.textContent = `${category.label} (${sugar} mg/dL)`;
            } else if (alert) {
                alert.style.display = 'none';
            }
        }
    }

    if (bloodSugar) bloodSugar.addEventListener('input', checkSugar);
    if (testType) testType.addEventListener('change', checkSugar);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveHealthRecord();
    });
}

// Save health record
function saveHealthRecord() {
    if (!currentPatient) {
        alert('กรุณาเลือกผู้ป่วยก่อน');
        return;
    }

    const formData = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        systolic: parseInt(document.getElementById('systolic').value),
        diastolic: parseInt(document.getElementById('diastolic').value),
        bloodSugar: parseFloat(document.getElementById('bloodSugar').value) || null,
        testType: document.getElementById('testType').value,
        heartRate: parseInt(document.getElementById('heartRate').value) || null,
        temperature: parseFloat(document.getElementById('temperature').value) || null,
        oxygenLevel: parseInt(document.getElementById('oxygenLevel').value) || null,
        notes: document.getElementById('notes').value || '',
        nextAppointment: document.getElementById('nextAppointment').value || null
    };

    // Calculate BMI
    formData.bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1);

    // Show summary
    showSummary(formData);

    // In real app, would send to API
    console.log('Saving health record:', formData);

    // Simulate save
    setTimeout(() => {
        alert(`✅ บันทึกข้อมูลสำเร็จ!\n\nบันทึกข้อมูลสุขภาพของ ${currentPatient.firstName} ${currentPatient.lastName} เรียบร้อยแล้ว`);
        resetForm();
        currentPatient = null;
        document.getElementById('patientInfoCard').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

// Show summary
function showSummary(data) {
    const card = document.getElementById('summaryCard');
    const content = document.getElementById('summaryContent');
    if (!card || !content) return;

    const bmiCat = getBMICategory(parseFloat(data.bmi));
    const bpCat = getBPCategory(data.systolic, data.diastolic);

    let html = `
        <div style="display: grid; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>น้ำหนัก / ส่วนสูง:</span>
                <strong>${data.weight} kg / ${data.height} cm</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>BMI:</span>
                <strong style="color: ${bmiCat.color}">${data.bmi} (${bmiCat.label})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>ความดันโลหิต:</span>
                <strong>${data.systolic}/${data.diastolic} mmHg</strong>
            </div>
    `;

    if (data.bloodSugar) {
        const sugarCat = getSugarCategory(data.bloodSugar, data.testType);
        html += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>น้ำตาล:</span>
                <strong>${data.bloodSugar} mg/dL (${sugarCat.label})</strong>
            </div>
        `;
    }

    if (data.heartRate) {
        html += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>อัตราหัวใจ:</span>
                <strong>${data.heartRate} bpm</strong>
            </div>
        `;
    }

    if (data.oxygenLevel) {
        const spo2Cat = getSpO2Category(data.oxygenLevel);
        html += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: white; border-radius: 0.375rem;">
                <span>🫁 SpO2:</span>
                <strong style="color: ${spo2Cat.color}">${data.oxygenLevel}% (${spo2Cat.label})</strong>
            </div>
        `;
    }

    html += '</div>';
    content.innerHTML = html;
    card.style.display = 'block';
}

// Reset form
function resetForm() {
    const form = document.getElementById('healthRecordForm');
    if (form) {
        form.reset();

        // Hide result cards
        const bmiResult = document.getElementById('bmiResult');
        const bpAlert = document.getElementById('bpAlert');
        const sugarAlert = document.getElementById('sugarAlert');
        const summaryCard = document.getElementById('summaryCard');

        if (bmiResult) bmiResult.style.display = 'none';
        if (bpAlert) bpAlert.style.display = 'none';
        if (sugarAlert) sugarAlert.style.display = 'none';
        if (summaryCard) summaryCard.style.display = 'none';
    }
}

// Toggle menu (for future mobile menu)
function toggleMenu() {
    alert('Menu - Coming soon!');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('healthRecordForm')) {
        initFormListeners();
    }

    // Allow Enter key to search
    const searchInput = document.getElementById('searchPatient');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPatient();
            }
        });
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchPatient,
        selectPatient,
        viewHistory,
        resetForm
    };
}
