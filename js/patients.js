/**
 * Patients List Logic
 */

let allPatients = [...mockPatients];
let filteredPatients = [...allPatients];
let currentPage = 1;
const patientsPerPage = 10;
let currentView = 'table';

// Initialize patients page
function initPatientsPage() {
    updateMiniStats();
    renderPatients();
}

// Update mini stats
function updateMiniStats() {
    document.getElementById('totalPatients').textContent = allPatients.length;
    document.getElementById('highRiskCount').textContent = allPatients.filter(p => p.riskLevel === 'high').length;

    const needFollowUp = allPatients.filter(p => {
        const nextAppt = new Date(p.nextAppointment);
        const inWeek = new Date();
        inWeek.setDate(inWeek.getDate() + 7);
        return nextAppt <= inWeek;
    }).length;
    document.getElementById('needFollowUp').textContent = needFollowUp;

    const checkedToday = allPatients.filter(p => {
        const lastCheckup = new Date(p.lastCheckup);
        const today = new Date();
        return lastCheckup.toDateString() === today.toDateString();
    }).length;
    document.getElementById('checkedToday').textContent = checkedToday;
}

// Filter patients
function filterPatients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const riskFilter = document.getElementById('riskFilter').value;
    const diseaseFilter = document.getElementById('diseaseFilter').value;
    const ageFilter = document.getElementById('ageFilter').value;

    filteredPatients = allPatients.filter(patient => {
        // Search filter
        const matchesSearch = !searchTerm ||
            patient.hn.toLowerCase().includes(searchTerm) ||
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.citizenId.includes(searchTerm);

        // Risk filter
        const matchesRisk = !riskFilter || patient.riskLevel === riskFilter;

        // Disease filter
        const matchesDisease = !diseaseFilter || patient.diseases.includes(diseaseFilter);

        // Age filter
        let matchesAge = true;
        if (ageFilter) {
            if (ageFilter === '0-18') matchesAge = patient.age <= 18;
            else if (ageFilter === '19-40') matchesAge = patient.age >= 19 && patient.age <= 40;
            else if (ageFilter === '41-60') matchesAge = patient.age >= 41 && patient.age <= 60;
            else if (ageFilter === '61+') matchesAge = patient.age >= 61;
        }

        return matchesSearch && matchesRisk && matchesDisease && matchesAge;
    });

    currentPage = 1;
    renderPatients();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('riskFilter').value = '';
    document.getElementById('diseaseFilter').value = '';
    document.getElementById('ageFilter').value = '';
    filterPatients();
}

// Render patients
function renderPatients() {
    document.getElementById('patientCount').textContent = filteredPatients.length;

    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardView();
    }

    renderPagination();
}

// Render table view
function renderTableView() {
    const tbody = document.getElementById('patientsTableBody');
    if (!tbody) return;

    const start = (currentPage - 1) * patientsPerPage;
    const end = start + patientsPerPage;
    const pagePatients = filteredPatients.slice(start, end);

    if (pagePatients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: #6B7280;">ไม่พบข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = pagePatients.map(patient => {
        const diseases = patient.diseases.length > 0
            ? patient.diseases.map(d => diseaseLabels[d] || d).join(', ')
            : '-';

        return `
            <tr>
                <td><input type="checkbox" class="patient-checkbox" data-id="${patient.id}"></td>
                <td><strong>${patient.hn}</strong></td>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.age}</td>
                <td>${patient.gender === 'male' ? 'ชาย' : 'หญิง'}</td>
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

// Render card view
function renderCardView() {
    const container = document.getElementById('cardView');
    if (!container) return;

    const start = (currentPage - 1) * patientsPerPage;
    const end = start + patientsPerPage;
    const pagePatients = filteredPatients.slice(start, end);

    if (pagePatients.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6B7280; grid-column: 1/-1;">ไม่พบข้อมูล</p>';
        return;
    }

    container.innerHTML = pagePatients.map(patient => {
        const diseases = patient.diseases.length > 0
            ? patient.diseases.map(d => diseaseLabels[d] || d).join(', ')
            : 'ไม่มี';

        return `
            <div class="patient-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="margin: 0 0 0.25rem 0; color: #111827;">${patient.firstName} ${patient.lastName}</h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #6B7280;">${patient.hn}</p>
                    </div>
                    <span class="priority-badge ${patient.riskLevel}">${riskLevelLabels[patient.riskLevel]}</span>
                </div>

                <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6B7280;">อายุ:</span>
                        <strong>${patient.age} ปี (${patient.gender === 'male' ? 'ชาย' : 'หญิง'})</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6B7280;">โรคประจำตัว:</span>
                        <strong>${diseases}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #6B7280;">ตรวจล่าสุด:</span>
                        <strong>${formatDate(patient.lastCheckup)}</strong>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    <button class="btn-action view" style="width: 100%;" onclick="viewPatient(${patient.id})">ดูข้อมูล</button>
                    <button class="btn-action edit" style="width: 100%;" onclick="editPatient(${patient.id})">แก้ไข</button>
                </div>
            </div>
        `;
    }).join('');
}

// Render pagination
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← ก่อนหน้า</button>
    `;

    // Show page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span style="padding: 0 0.5rem;">...</span>';
        }
    }

    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">ถัดไป →</button>
    `;

    container.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderPatients();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Switch view
function switchView(view) {
    currentView = view;

    // Update buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show/hide views
    if (view === 'table') {
        document.getElementById('tableView').style.display = 'block';
        document.getElementById('cardView').style.display = 'none';
    } else {
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('cardView').style.display = 'grid';
    }

    renderPatients();
}

// Toggle select all
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.patient-checkbox');

    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
}

// View patient
function viewPatient(id) {
    window.location.href = `patient-detail.html?id=${id}`;
}

// Edit patient
function editPatient(id) {
    window.location.href = `patient-edit.html?id=${id}`;
}

// Export patients
function exportPatients() {
    const selected = Array.from(document.querySelectorAll('.patient-checkbox:checked'))
        .map(cb => parseInt(cb.dataset.id));

    const toExport = selected.length > 0
        ? allPatients.filter(p => selected.includes(p.id))
        : filteredPatients;

    alert(`กำลัง Export ข้อมูล ${toExport.length} รายการ\n\nในระบบจริงจะสร้างไฟล์ Excel ให้ดาวน์โหลด`);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('patientsTableBody')) {
        initPatientsPage();

        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const filterRisk = urlParams.get('filter');
        if (filterRisk === 'high-risk') {
            document.getElementById('riskFilter').value = 'high';
            filterPatients();
        }
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterPatients,
        resetFilters,
        switchView,
        viewPatient,
        editPatient,
        exportPatients
    };
}
