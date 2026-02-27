/**
 * Seed Data — Health Desk Community
 * ข้อมูลตัวอย่างสำหรับ Firestore พร้อม field ครบตามมาตรฐานสาธารณสุขไทย
 *
 * วิธีใช้:
 * 1. เปิดหน้า seed-data.html ใน browser
 * 2. กดปุ่ม "Seed Data"
 * 3. ข้อมูลจะถูกนำเข้า Firestore
 *
 * หรือเรียก seedAll() จาก console
 */

var SeedData = (function() {

    // ============================================================
    // STAFF DATA
    // ============================================================
    var staffData = [
        {
            docId: 'staff-1',
            name: 'Admin User',
            email: 'admin@health.go.th',
            role: 'admin',
            roleLabel: 'ผู้ดูแลระบบ',
            phone: '081-000-0000',
            licenseNo: '',
            healthCenter: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ',
            status: 'active'
        },
        {
            docId: 'staff-2',
            name: 'สมหญิง รักษา',
            email: 'worker@health.go.th',
            role: 'worker',
            roleLabel: 'เจ้าหน้าที่สาธารณสุข',
            phone: '082-345-6789',
            licenseNo: '',
            healthCenter: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ',
            status: 'active'
        },
        {
            docId: 'staff-3',
            name: 'นพ.สมชาย พัฒนา',
            email: 'doctor@health.go.th',
            role: 'doctor',
            roleLabel: 'แพทย์',
            phone: '083-456-7890',
            licenseNo: 'ว.12345',
            healthCenter: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ',
            status: 'active'
        },
        {
            docId: 'staff-4',
            name: 'Super Admin',
            email: 'superadmin@health.go.th',
            role: 'superadmin',
            roleLabel: 'ผู้ดูแลระบบสูงสุด',
            phone: '080-000-0000',
            licenseNo: '',
            healthCenter: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ',
            status: 'active'
        }
    ];

    // ============================================================
    // PATIENTS DATA (5 ตัวอย่างหลัก + auto-generate อีก 45)
    // ============================================================
    var patientData = [
        {
            hn: 'HN10245',
            citizenId: '1234567890123',
            title: 'นาง',
            firstName: 'มานี',
            lastName: 'มีสุข',
            dateOfBirth: '1962-05-15',
            gender: 'female',
            bloodGroup: 'O',
            phone: '081-234-5678',
            lineId: '',
            address: {
                houseNo: '123/4',
                moo: '5',
                tambon: 'บ้านใหม่',
                amphoe: 'เมือง',
                province: 'เชียงใหม่',
                zipcode: '50000'
            },
            emergencyContact: {
                name: 'สมศรี มีสุข',
                relation: 'ลูกสาว',
                phone: '089-876-5432'
            },
            healthInsurance: {
                scheme: 'UC',
                memberId: ''
            },
            diseases: ['hypertension', 'diabetes'],
            allergies: ['Penicillin'],
            currentMedications: ['Metformin 500mg 1x2 pc', 'Amlodipine 5mg 1x1 pc'],
            riskLevel: 'high',
            profilePhoto: '',
            idCardPhoto: '',
            lastCheckup: '2024-02-20',
            nextAppointment: '2024-03-05',
            status: 'active',
            healthRecords: [
                {
                    date: '2024-02-20',
                    recordedBy: 'staff-2',
                    weight: 68.5,
                    height: 155,
                    bmi: 28.5,
                    waistCircumference: 88,
                    systolic: 145,
                    diastolic: 95,
                    bpCategory: 'hypertension',
                    heartRate: 82,
                    temperature: 36.7,
                    oxygenLevel: 96,
                    respiratoryRate: 18,
                    bloodSugar: 145,
                    bloodSugarType: 'fasting',
                    hba1c: 7.2,
                    cholesterol: 220,
                    triglyceride: 180,
                    hdl: 45,
                    ldl: 140,
                    creatinine: 1.1,
                    egfr: 75,
                    smokingStatus: 'never',
                    alcoholUse: 'never',
                    exerciseLevel: 'light',
                    riskLevel: 'high',
                    riskReason: 'ความดันสูง + เบาหวานควบคุมไม่ได้',
                    notes: 'แนะนำลดเค็ม ออกกำลังกาย ควบคุมอาหาร',
                    diagnosis: 'Essential hypertension + DM type 2 uncontrolled',
                    treatmentPlan: 'ปรับยา Metformin เป็น 850mg 1x2, เพิ่ม Amlodipine 10mg, นัดติดตาม 2 สัปดาห์',
                    prescription: 'Metformin 850mg 1x2 pc, Amlodipine 10mg 1x1 pc'
                },
                {
                    date: '2024-01-15',
                    recordedBy: 'staff-2',
                    weight: 69.0,
                    height: 155,
                    bmi: 28.7,
                    waistCircumference: 89,
                    systolic: 150,
                    diastolic: 98,
                    bpCategory: 'hypertension',
                    heartRate: 85,
                    temperature: 36.6,
                    oxygenLevel: 97,
                    bloodSugar: 155,
                    bloodSugarType: 'fasting',
                    smokingStatus: 'never',
                    alcoholUse: 'never',
                    exerciseLevel: 'none',
                    riskLevel: 'high',
                    riskReason: 'ความดันสูงมาก น้ำตาลสูง',
                    notes: 'ส่งพบแพทย์ปรับยา',
                    diagnosis: 'Uncontrolled HT, DM with hyperglycemia',
                    treatmentPlan: 'ส่งพบแพทย์ปรับยา ติดตามความดัน+น้ำตาลทุก 2 สัปดาห์',
                    prescription: 'Metformin 500mg 1x2 pc, Amlodipine 5mg 1x1 pc'
                }
            ]
        },
        {
            hn: 'HN10567',
            citizenId: '1234567890124',
            title: 'นาย',
            firstName: 'ประสิทธิ์',
            lastName: 'ดีงาม',
            dateOfBirth: '1969-08-20',
            gender: 'male',
            bloodGroup: 'B',
            phone: '082-345-6789',
            lineId: '',
            address: {
                houseNo: '45',
                moo: '3',
                tambon: 'บ้านใหม่',
                amphoe: 'เมือง',
                province: 'เชียงใหม่',
                zipcode: '50000'
            },
            emergencyContact: {
                name: 'สมจิต ดีงาม',
                relation: 'ภรรยา',
                phone: '082-111-2222'
            },
            healthInsurance: {
                scheme: 'UC',
                memberId: ''
            },
            diseases: ['obesity'],
            allergies: [],
            currentMedications: [],
            riskLevel: 'medium',
            profilePhoto: '',
            idCardPhoto: '',
            lastCheckup: '2024-02-22',
            nextAppointment: '2024-03-22',
            status: 'active',
            healthRecords: [
                {
                    date: '2024-02-22',
                    recordedBy: 'staff-2',
                    weight: 92.0,
                    height: 170,
                    bmi: 31.8,
                    waistCircumference: 102,
                    systolic: 135,
                    diastolic: 85,
                    bpCategory: 'prehypertension',
                    heartRate: 75,
                    temperature: 36.5,
                    oxygenLevel: 98,
                    respiratoryRate: 16,
                    bloodSugar: 110,
                    bloodSugarType: 'fasting',
                    cholesterol: 245,
                    triglyceride: 200,
                    hdl: 38,
                    ldl: 155,
                    smokingStatus: 'former',
                    alcoholUse: 'occasional',
                    exerciseLevel: 'none',
                    riskLevel: 'medium',
                    riskReason: 'อ้วนมาก ไขมันสูง',
                    notes: 'แนะนำลดน้ำหนัก ออกกำลังกาย',
                    diagnosis: 'Obesity class I, Dyslipidemia',
                    treatmentPlan: 'ลดน้ำหนัก 5-10% ภายใน 6 เดือน, ออกกำลังกาย 30 นาที/วัน, ควบคุมอาหาร',
                    prescription: 'Atorvastatin 20mg 1x1 hs'
                }
            ]
        },
        {
            hn: 'HN12345',
            citizenId: '1234567890125',
            title: 'นาย',
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            dateOfBirth: '1981-03-10',
            gender: 'male',
            bloodGroup: 'A',
            phone: '083-456-7890',
            lineId: 'somchai.jaidee',
            address: {
                houseNo: '99/1',
                moo: '2',
                tambon: 'บ้านใหม่',
                amphoe: 'เมือง',
                province: 'เชียงใหม่',
                zipcode: '50000'
            },
            emergencyContact: {
                name: 'สมศรี ใจดี',
                relation: 'ภรรยา',
                phone: '083-222-3333'
            },
            healthInsurance: {
                scheme: 'SSS',
                memberId: 'SSS-9876543'
            },
            diseases: ['pre_diabetes'],
            allergies: [],
            currentMedications: [],
            riskLevel: 'medium',
            profilePhoto: '../img/avatar-somchai.svg',
            idCardPhoto: '',
            lastCheckup: '2024-02-25',
            nextAppointment: '2024-03-25',
            status: 'active',
            healthRecords: [
                {
                    date: '2024-02-25',
                    recordedBy: 'staff-2',
                    weight: 75.5,
                    height: 170,
                    bmi: 26.1,
                    waistCircumference: 90,
                    systolic: 135,
                    diastolic: 85,
                    bpCategory: 'prehypertension',
                    heartRate: 78,
                    temperature: 36.8,
                    oxygenLevel: 97,
                    respiratoryRate: 17,
                    bloodSugar: 110,
                    bloodSugarType: 'fasting',
                    hba1c: 6.0,
                    cholesterol: 195,
                    triglyceride: 150,
                    hdl: 50,
                    ldl: 115,
                    smokingStatus: 'never',
                    alcoholUse: 'occasional',
                    exerciseLevel: 'moderate',
                    riskLevel: 'medium',
                    riskReason: 'น้ำตาลเริ่มสูง',
                    notes: 'ควบคุมอาหาร ออกกำลังกายสม่ำเสมอ',
                    diagnosis: 'Pre-diabetes (IFG)',
                    treatmentPlan: 'ปรับพฤติกรรม ลดแป้ง/น้ำตาล, ออกกำลังกาย 150 นาที/สัปดาห์, นัดตรวจ FBS+HbA1c อีก 3 เดือน',
                    prescription: ''
                }
            ]
        },
        {
            hn: 'HN10892',
            citizenId: '1234567890126',
            title: 'นางสาว',
            firstName: 'สมหญิง',
            lastName: 'รักษา',
            dateOfBirth: '1988-11-05',
            gender: 'female',
            bloodGroup: 'AB',
            phone: '084-567-8901',
            lineId: '',
            address: {
                houseNo: '67',
                moo: '1',
                tambon: 'บ้านใหม่',
                amphoe: 'เมือง',
                province: 'เชียงใหม่',
                zipcode: '50000'
            },
            emergencyContact: {
                name: 'ประยูร รักษา',
                relation: 'พ่อ',
                phone: '084-333-4444'
            },
            healthInsurance: {
                scheme: 'UC',
                memberId: ''
            },
            diseases: [],
            allergies: ['Sulfa'],
            currentMedications: [],
            riskLevel: 'low',
            profilePhoto: '',
            idCardPhoto: '',
            lastCheckup: '2024-02-23',
            nextAppointment: '2024-06-23',
            status: 'active',
            healthRecords: [
                {
                    date: '2024-02-23',
                    recordedBy: 'staff-2',
                    weight: 58.0,
                    height: 160,
                    bmi: 22.7,
                    waistCircumference: 72,
                    systolic: 115,
                    diastolic: 75,
                    bpCategory: 'normal',
                    heartRate: 70,
                    temperature: 36.6,
                    oxygenLevel: 99,
                    respiratoryRate: 16,
                    bloodSugar: 95,
                    bloodSugarType: 'fasting',
                    cholesterol: 180,
                    triglyceride: 120,
                    hdl: 55,
                    ldl: 100,
                    smokingStatus: 'never',
                    alcoholUse: 'never',
                    exerciseLevel: 'active',
                    riskLevel: 'low',
                    riskReason: '',
                    notes: 'สุขภาพดี',
                    diagnosis: 'Healthy, no significant findings',
                    treatmentPlan: 'ตรวจสุขภาพประจำปี นัดตรวจอีก 6 เดือน',
                    prescription: ''
                }
            ]
        },
        {
            hn: 'HN11234',
            citizenId: '1234567890127',
            title: 'นาย',
            firstName: 'วิชัย',
            lastName: 'สุขใจ',
            dateOfBirth: '1958-01-20',
            gender: 'male',
            bloodGroup: 'O',
            phone: '085-678-9012',
            lineId: '',
            address: {
                houseNo: '15',
                moo: '7',
                tambon: 'บ้านใหม่',
                amphoe: 'เมือง',
                province: 'เชียงใหม่',
                zipcode: '50000'
            },
            emergencyContact: {
                name: 'สมจิต สุขใจ',
                relation: 'ภรรยา',
                phone: '085-444-5555'
            },
            healthInsurance: {
                scheme: 'UC',
                memberId: ''
            },
            diseases: ['hypertension', 'heart'],
            allergies: ['Aspirin'],
            currentMedications: ['Losartan 50mg 1x1 pc', 'Atorvastatin 20mg 1x1 hs'],
            riskLevel: 'high',
            profilePhoto: '',
            idCardPhoto: '',
            lastCheckup: '2024-02-18',
            nextAppointment: '2024-03-01',
            status: 'active',
            healthRecords: [
                {
                    date: '2024-02-18',
                    recordedBy: 'staff-2',
                    weight: 72.0,
                    height: 165,
                    bmi: 26.4,
                    waistCircumference: 94,
                    systolic: 150,
                    diastolic: 98,
                    bpCategory: 'hypertension',
                    heartRate: 85,
                    temperature: 36.9,
                    oxygenLevel: 94,
                    respiratoryRate: 20,
                    bloodSugar: 105,
                    bloodSugarType: 'fasting',
                    cholesterol: 250,
                    triglyceride: 190,
                    hdl: 40,
                    ldl: 160,
                    creatinine: 1.3,
                    egfr: 60,
                    smokingStatus: 'former',
                    alcoholUse: 'occasional',
                    exerciseLevel: 'light',
                    riskLevel: 'high',
                    riskReason: 'ความดันสูงมาก โรคหัวใจ ไตเริ่มเสื่อม',
                    notes: 'ต้องติดตามใกล้ชิด ส่งพบแพทย์ทุกเดือน',
                    diagnosis: 'Hypertensive heart disease, CKD stage 3a',
                    treatmentPlan: 'ปรับยาลดความดัน เพิ่ม Losartan 100mg, เลี่ยง NSAIDs, ตรวจ Cr+eGFR ทุก 3 เดือน, นัดพบแพทย์ทุกเดือน',
                    prescription: 'Losartan 100mg 1x1 pc, Atorvastatin 40mg 1x1 hs, Aspirin 81mg 1x1 pc'
                }
            ]
        }
    ];

    // Auto-generate additional patients
    var firstNamesMale = ['สมชาย', 'สมศักดิ์', 'สมหมาย', 'วิชัย', 'ประสิทธิ์', 'บุญมี', 'จรูญ', 'วิทยา', 'สุชาติ', 'สำราญ'];
    var firstNamesFemale = ['สมหญิง', 'มานี', 'ประภา', 'สุภา', 'วารี', 'จันทร์', 'วิภา', 'สุดา', 'พิมพ์', 'อรุณ'];
    var lastNames = ['ใจดี', 'มีสุข', 'ดีงาม', 'สุขใจ', 'รักษา', 'สดใส', 'เจริญ', 'พัฒนา', 'ก้าวหน้า', 'มั่นคง'];
    var titles = { male: ['นาย'], female: ['นาง', 'นางสาว'] };
    var bloodGroups = ['A', 'B', 'AB', 'O'];
    var provinces = ['เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'แพร่'];
    var tambons = ['บ้านใหม่', 'ป่าแดง', 'ท่าศาลา', 'สันทราย', 'แม่เหียะ'];
    var diseaseGroups = [
        ['hypertension'], ['diabetes'], ['obesity'], ['hypertension', 'diabetes'],
        ['pre_diabetes'], ['dyslipidemia'], ['hypertension', 'dyslipidemia'],
        ['gout'], ['asthma'], ['ckd'], ['heart'], []
    ];
    var riskLevels = ['high', 'medium', 'low', 'none'];
    var insuranceSchemes = ['UC', 'SSS', 'CSMBS', 'UC', 'UC']; // UC is most common
    var allergyOptions = ['Penicillin', 'Sulfa', 'Aspirin', 'NSAIDs', 'Iodine', 'ACE Inhibitors', 'Cephalosporin', 'Tetracycline'];
    var medicationsByDisease = {
        'hypertension': ['Amlodipine 5mg 1x1 pc', 'Losartan 50mg 1x1 pc', 'Enalapril 5mg 1x1 pc', 'HCTZ 25mg 1x1 เช้า'],
        'diabetes': ['Metformin 500mg 1x2 pc', 'Glipizide 5mg 1x1 ac', 'Metformin 850mg 1x2 pc'],
        'dyslipidemia': ['Atorvastatin 20mg 1x1 hs', 'Simvastatin 20mg 1x1 hs'],
        'heart': ['Aspirin 81mg 1x1 pc', 'Atorvastatin 40mg 1x1 hs', 'Warfarin 3mg ตามแพทย์สั่ง'],
        'gout': ['Allopurinol 100mg 1x1 pc', 'Colchicine 0.6mg prn'],
        'asthma': ['Salbutamol MDI 2 puffs prn', 'Budesonide 200mcg 2 puffs bid'],
        'ckd': ['Losartan 50mg 1x1 pc', 'Sodium Bicarbonate 300mg 1x3 pc'],
        'copd': ['Salbutamol MDI 2 puffs prn', 'Ipratropium MDI 2 puffs tid']
    };

    // Diagnosis & treatment templates by disease
    var diagnosisByDisease = {
        'hypertension': ['Essential hypertension', 'Hypertension stage 1', 'Hypertension stage 2, uncontrolled'],
        'diabetes': ['DM type 2', 'DM type 2, uncontrolled', 'DM type 2, controlled'],
        'obesity': ['Obesity class I', 'Obesity class II', 'Overweight with metabolic risk'],
        'pre_diabetes': ['Pre-diabetes (IFG)', 'Impaired fasting glucose'],
        'dyslipidemia': ['Dyslipidemia', 'Mixed hyperlipidemia', 'Hypercholesterolemia'],
        'gout': ['Gout, acute', 'Chronic gout', 'Hyperuricemia'],
        'asthma': ['Bronchial asthma, mild persistent', 'Asthma, partly controlled'],
        'ckd': ['CKD stage 3a', 'CKD stage 3b', 'CKD stage 2'],
        'heart': ['Hypertensive heart disease', 'Ischemic heart disease', 'Heart failure, NYHA II'],
        'copd': ['COPD, moderate', 'COPD, mild']
    };
    var treatmentByDisease = {
        'hypertension': ['ควบคุมความดัน ลดเค็ม ออกกำลังกาย', 'ปรับยาลดความดัน ติดตาม 2 สัปดาห์', 'ลดน้ำหนัก งดแอลกอฮอล์ นัดตรวจ 1 เดือน'],
        'diabetes': ['ควบคุมอาหาร ลดแป้ง/หวาน ออกกำลังกาย', 'ปรับยา ตรวจ HbA1c ทุก 3 เดือน', 'ควบคุมดี ตรวจตาตรวจเท้าปีละครั้ง'],
        'obesity': ['ลดน้ำหนัก 5-10% ใน 6 เดือน ออกกำลังกาย 30 นาที/วัน', 'ควบคุมอาหาร คำนวณแคลอรี่'],
        'pre_diabetes': ['ปรับพฤติกรรม ลดแป้ง/น้ำตาล ตรวจ FBS ทุก 3 เดือน', 'ออกกำลังกาย 150 นาที/สัปดาห์'],
        'dyslipidemia': ['ควบคุมอาหาร ลดไขมัน ออกกำลังกาย', 'เริ่มยาลดไขมัน ตรวจ lipid ทุก 3 เดือน'],
        'gout': ['หลีกเลี่ยงอาหาร purine สูง ดื่มน้ำมาก', 'ยา Allopurinol ตรวจ uric acid ทุก 3 เดือน'],
        'asthma': ['พ่นยาสม่ำเสมอ หลีกเลี่ยงสิ่งกระตุ้น', 'นัดตรวจสมรรถภาพปอด ปรับยาพ่น'],
        'ckd': ['จำกัดโปรตีน ลดเค็ม เลี่ยง NSAIDs ตรวจ Cr ทุก 3 เดือน', 'ส่งพบ nephrologist'],
        'heart': ['ยาต่อเนื่อง ออกกำลังกายเบาๆ ติดตามทุกเดือน', 'ตรวจ Echo ปีละครั้ง'],
        'copd': ['เลิกบุหรี่ พ่นยาสม่ำเสมอ', 'ฝึกหายใจ นัดตรวจสมรรถภาพปอด']
    };
    var staffRecorders = ['staff-2', 'staff-2', 'staff-2', 'staff-3', 'staff-3']; // mix staff

    for (var i = 6; i <= 50; i++) {
        var gender = Math.random() < 0.5 ? 'male' : 'female';
        var fNames = gender === 'male' ? firstNamesMale : firstNamesFemale;
        var firstName = fNames[Math.floor(Math.random() * fNames.length)];
        var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        var titleOptions = titles[gender];
        var title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
        var birthYear = 1950 + Math.floor(Math.random() * 45);
        var birthMonth = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
        var birthDay = ('0' + (Math.floor(Math.random() * 28) + 1)).slice(-2);
        var diseases = diseaseGroups[Math.floor(Math.random() * diseaseGroups.length)];
        var risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

        // Generate allergies (30% chance)
        var patientAllergies = [];
        if (Math.random() < 0.3) {
            var numAllergies = Math.floor(Math.random() * 2) + 1;
            for (var ai = 0; ai < numAllergies; ai++) {
                var allergy = allergyOptions[Math.floor(Math.random() * allergyOptions.length)];
                if (patientAllergies.indexOf(allergy) === -1) patientAllergies.push(allergy);
            }
        }

        // Generate medications based on diseases
        var patientMeds = [];
        diseases.forEach(function(d) {
            var medsForDisease = medicationsByDisease[d];
            if (medsForDisease) {
                var med = medsForDisease[Math.floor(Math.random() * medsForDisease.length)];
                if (patientMeds.indexOf(med) === -1) patientMeds.push(med);
            }
        });
        var weight = Math.floor(Math.random() * 40) + 50;
        var height = Math.floor(Math.random() * 30) + 150;
        var systolic = Math.floor(Math.random() * 50) + 110;
        var diastolic = Math.floor(Math.random() * 30) + 70;

        var bpCat = 'normal';
        if (systolic >= 140 || diastolic >= 90) bpCat = 'hypertension';
        else if (systolic >= 120 || diastolic >= 80) bpCat = 'prehypertension';

        patientData.push({
            hn: 'HN' + (10000 + i),
            citizenId: '123456789012' + i,
            title: title,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: birthYear + '-' + birthMonth + '-' + birthDay,
            gender: gender,
            bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
            phone: '08' + (Math.floor(Math.random() * 9) + 1) + '-' + (Math.floor(Math.random() * 900) + 100) + '-' + (Math.floor(Math.random() * 9000) + 1000),
            lineId: '',
            address: {
                houseNo: '' + (Math.floor(Math.random() * 200) + 1),
                moo: '' + (Math.floor(Math.random() * 10) + 1),
                tambon: tambons[Math.floor(Math.random() * tambons.length)],
                amphoe: 'เมือง',
                province: provinces[Math.floor(Math.random() * provinces.length)],
                zipcode: '50000'
            },
            emergencyContact: {
                name: '',
                relation: '',
                phone: ''
            },
            healthInsurance: {
                scheme: insuranceSchemes[Math.floor(Math.random() * insuranceSchemes.length)],
                memberId: ''
            },
            diseases: diseases,
            allergies: patientAllergies,
            currentMedications: patientMeds,
            riskLevel: risk,
            profilePhoto: '',
            idCardPhoto: '',
            lastCheckup: '2024-02-' + ('0' + (Math.floor(Math.random() * 25) + 1)).slice(-2),
            nextAppointment: '2024-03-' + ('0' + (Math.floor(Math.random() * 28) + 1)).slice(-2),
            status: 'active',
            healthRecords: (function() {
                var recorder = staffRecorders[Math.floor(Math.random() * staffRecorders.length)];
                // Build diagnosis from diseases
                var diagParts = [];
                var treatParts = [];
                var rxParts = [];
                diseases.forEach(function(d) {
                    if (diagnosisByDisease[d]) {
                        var diagOptions = diagnosisByDisease[d];
                        diagParts.push(diagOptions[Math.floor(Math.random() * diagOptions.length)]);
                    }
                    if (treatmentByDisease[d]) {
                        var treatOptions = treatmentByDisease[d];
                        treatParts.push(treatOptions[Math.floor(Math.random() * treatOptions.length)]);
                    }
                    if (medicationsByDisease[d]) {
                        var medOptions = medicationsByDisease[d];
                        rxParts.push(medOptions[Math.floor(Math.random() * medOptions.length)]);
                    }
                });
                return [{
                    date: '2024-02-' + ('0' + (Math.floor(Math.random() * 25) + 1)).slice(-2),
                    recordedBy: recorder,
                    weight: weight,
                    height: height,
                    bmi: parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1)),
                    systolic: systolic,
                    diastolic: diastolic,
                    bpCategory: bpCat,
                    heartRate: Math.floor(Math.random() * 30) + 60,
                    temperature: parseFloat((36.5 + Math.random() * 0.8).toFixed(1)),
                    oxygenLevel: Math.floor(Math.random() * 8) + 93,
                    respiratoryRate: Math.floor(Math.random() * 8) + 14,
                    bloodSugar: Math.floor(Math.random() * 50) + 90,
                    bloodSugarType: 'fasting',
                    hba1c: diseases.indexOf('diabetes') !== -1 ? parseFloat((5.5 + Math.random() * 3.5).toFixed(1)) : null,
                    cholesterol: Math.floor(Math.random() * 80) + 160,
                    triglyceride: Math.floor(Math.random() * 100) + 100,
                    hdl: Math.floor(Math.random() * 30) + 35,
                    ldl: Math.floor(Math.random() * 60) + 100,
                    creatinine: parseFloat((0.7 + Math.random() * 0.8).toFixed(1)),
                    egfr: Math.floor(Math.random() * 40) + 60,
                    smokingStatus: ['never', 'never', 'never', 'former', 'current'][Math.floor(Math.random() * 5)],
                    alcoholUse: ['never', 'never', 'occasional', 'occasional', 'regular'][Math.floor(Math.random() * 5)],
                    exerciseLevel: ['none', 'light', 'moderate', 'active'][Math.floor(Math.random() * 4)],
                    riskLevel: risk,
                    notes: treatParts.length > 0 ? treatParts[0] : '',
                    diagnosis: diagParts.length > 0 ? diagParts.join(', ') : '',
                    treatmentPlan: treatParts.join(', '),
                    prescription: rxParts.join(', ')
                }];
            })()
        });
    }

    // ============================================================
    // APPOINTMENTS DATA — พร้อม เวลา + สถานที่
    // ============================================================
    var appointmentData = [
        // ── มานี มีสุข (patient-1 / HN10245) ──
        { docId: 'appt-1', patientId: 'patient-1', patientHN: 'HN10245', patientName: 'นางมานี มีสุข', date: '2024-03-05', time: '09:00', endTime: '10:00', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามความดัน+เบาหวาน', status: 'scheduled', notes: 'งดอาหาร 8 ชม. ก่อนเจาะเลือด' },
        { docId: 'appt-2', patientId: 'patient-1', patientHN: 'HN10245', patientName: 'นางมานี มีสุข', date: '2024-02-20', time: '10:00', endTime: '10:30', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },
        { docId: 'appt-3', patientId: 'patient-1', patientHN: 'HN10245', patientName: 'นางมานี มีสุข', date: '2024-01-15', time: '14:00', endTime: '14:30', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามความดัน', status: 'completed', notes: '' },
        { docId: 'appt-4', patientId: 'patient-1', patientHN: 'HN10245', patientName: 'นางมานี มีสุข', date: '2024-01-05', time: '08:30', endTime: '09:00', doctorId: '', doctorName: 'ห้องแลป', location: 'โรงพยาบาลชุมชนแม่เหียะ', reason: 'ตรวจเลือด', status: 'cancelled', notes: 'ผู้ป่วยไม่สะดวก' },

        // ── ประสิทธิ์ ดีงาม (patient-2 / HN10567) ──
        { docId: 'appt-5', patientId: 'patient-2', patientHN: 'HN10567', patientName: 'นายประสิทธิ์ ดีงาม', date: '2024-03-22', time: '10:30', endTime: '11:00', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามน้ำหนัก+ไขมัน', status: 'scheduled', notes: 'งดอาหาร 12 ชม.' },
        { docId: 'appt-6', patientId: 'patient-2', patientHN: 'HN10567', patientName: 'นายประสิทธิ์ ดีงาม', date: '2024-02-22', time: '09:30', endTime: '10:00', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },

        // ── สมชาย ใจดี (patient-3 / HN12345) ──
        { docId: 'appt-7', patientId: 'patient-3', patientHN: 'HN12345', patientName: 'นายสมชาย ใจดี', date: '2024-03-25', time: '09:00', endTime: '09:30', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามน้ำตาล', status: 'scheduled', notes: 'งดอาหาร 8 ชม. ก่อนเจาะเลือด' },
        { docId: 'appt-8', patientId: 'patient-3', patientHN: 'HN12345', patientName: 'นายสมชาย ใจดี', date: '2024-02-25', time: '13:30', endTime: '14:00', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'completed', notes: '' },
        { docId: 'appt-9', patientId: 'patient-3', patientHN: 'HN12345', patientName: 'นายสมชาย ใจดี', date: '2024-01-20', time: '10:00', endTime: '10:30', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'คลินิกหมอครอบครัวท่าศาลา', reason: 'ตรวจ FBS+HbA1c', status: 'completed', notes: '' },

        // ── สมหญิง รักษา (patient-4 / HN10892) ──
        { docId: 'appt-10', patientId: 'patient-4', patientHN: 'HN10892', patientName: 'นางสาวสมหญิง รักษา', date: '2024-06-23', time: '09:00', endTime: '09:30', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพประจำปี', status: 'scheduled', notes: '' },
        { docId: 'appt-11', patientId: 'patient-4', patientHN: 'HN10892', patientName: 'นางสาวสมหญิง รักษา', date: '2024-02-23', time: '10:00', endTime: '10:30', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'รพ.สต.บ้านใหม่', reason: 'ตรวจสุขภาพทั่วไป', status: 'completed', notes: '' },

        // ── วิชัย สุขใจ (patient-5 / HN11234) ──
        { docId: 'appt-12', patientId: 'patient-5', patientHN: 'HN11234', patientName: 'นายวิชัย สุขใจ', date: '2024-03-01', time: '09:00', endTime: '10:00', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจติดตามหัวใจ+ไต', status: 'scheduled', notes: 'นำยาที่กินมาด้วย' },
        { docId: 'appt-13', patientId: 'patient-5', patientHN: 'HN11234', patientName: 'นายวิชัย สุขใจ', date: '2024-02-18', time: '10:00', endTime: '10:30', doctorId: 'staff-2', doctorName: 'สมหญิง รักษา', location: 'บ้านผู้ป่วย (เยี่ยมบ้าน)', reason: 'เยี่ยมบ้านวัดความดัน', status: 'completed', notes: '' },
        { docId: 'appt-14', patientId: 'patient-5', patientHN: 'HN11234', patientName: 'นายวิชัย สุขใจ', date: '2024-02-01', time: '08:30', endTime: '09:00', doctorId: '', doctorName: 'ห้องแลป', location: 'โรงพยาบาลชุมชนแม่เหียะ', reason: 'ตรวจเลือด Cr+eGFR', status: 'completed', notes: '' },
        { docId: 'appt-15', patientId: 'patient-5', patientHN: 'HN11234', patientName: 'นายวิชัย สุขใจ', date: '2024-01-10', time: '14:00', endTime: '15:00', doctorId: 'staff-3', doctorName: 'นพ.สมชาย พัฒนา', location: 'ศูนย์สุขภาพชุมชนบ้านสุขใจ', reason: 'ตรวจ Echo หัวใจ', status: 'completed', notes: '' }
    ];

    // ============================================================
    // CONVERSATIONS DATA
    // ============================================================
    var conversationData = [
        {
            docId: 'conv-1',
            participants: ['staff-2', 'staff-3'],
            type: 'staff',
            lastMessage: 'ผู้ป่วย HN10245 ความดันสูงมาก ต้องพบแพทย์ด่วน',
            lastMessageTime: new Date('2024-02-26T10:30:00'),
            unreadCount: { 'staff-2': 0, 'staff-3': 2 },
            messages: [
                { sender: 'staff-2', text: 'สวัสดีค่ะ คุณหมอ ลงพื้นที่เยี่ยมบ้านผู้ป่วยวันนี้ค่ะ', time: new Date('2024-02-26T09:00:00'), read: true },
                { sender: 'staff-3', text: 'ดีครับ มีอะไรต้องปรึกษาไหม?', time: new Date('2024-02-26T09:05:00'), read: true },
                { sender: 'staff-2', text: 'คุณมานี HN10245 ความดันวัดได้ 160/100 mmHg ค่ะ สูงมาก', time: new Date('2024-02-26T10:25:00'), read: false },
                { sender: 'staff-2', text: 'ผู้ป่วย HN10245 ความดันสูงมาก ต้องพบแพทย์ด่วน', time: new Date('2024-02-26T10:30:00'), read: false }
            ]
        },
        {
            docId: 'conv-2',
            participants: ['staff-2', 'patient-3'],
            type: 'patient',
            lastMessage: 'นัดตรวจวันที่ 25 มีนาคม อย่าลืมงดอาหารก่อน 8 ชม.',
            lastMessageTime: new Date('2024-02-25T14:00:00'),
            unreadCount: { 'staff-2': 1, 'patient-3': 0 },
            messages: [
                { sender: 'staff-2', text: 'สวัสดีค่ะ คุณสมชาย แจ้งเรื่องนัดตรวจค่ะ', time: new Date('2024-02-25T13:50:00'), read: true },
                { sender: 'patient-3', text: 'สวัสดีครับ วันไหนครับ?', time: new Date('2024-02-25T13:55:00'), read: true },
                { sender: 'staff-2', text: 'นัดตรวจวันที่ 25 มีนาคม อย่าลืมงดอาหารก่อน 8 ชม.', time: new Date('2024-02-25T14:00:00'), read: false }
            ]
        },
        {
            docId: 'conv-3',
            participants: ['staff-3', 'patient-1'],
            type: 'patient',
            lastMessage: 'ผลตรวจเลือดปกติดีค่ะ ควบคุมอาหารต่อไปนะคะ',
            lastMessageTime: new Date('2024-02-24T09:15:00'),
            unreadCount: { 'staff-3': 0, 'patient-1': 0 },
            messages: [
                { sender: 'staff-3', text: 'คุณมานีครับ ผลตรวจเลือดออกแล้ว', time: new Date('2024-02-24T09:10:00'), read: true },
                { sender: 'patient-1', text: 'ผลเป็นยังไงคะ คุณหมอ?', time: new Date('2024-02-24T09:12:00'), read: true },
                { sender: 'staff-3', text: 'ผลตรวจเลือดปกติดีค่ะ ควบคุมอาหารต่อไปนะคะ', time: new Date('2024-02-24T09:15:00'), read: true }
            ]
        }
    ];

    // ============================================================
    // NOTIFICATIONS DATA
    // ============================================================
    var notificationData = [
        {
            type: 'patient_alert',
            icon: '🚨',
            title: 'ค่าสุขภาพผิดปกติ',
            message: 'นางมานี มีสุข (HN10245) ความดัน 160/100 - สูงมาก',
            forRoles: ['doctor', 'worker'],
            forPatientId: '',
            read: false
        },
        {
            type: 'new_message',
            icon: '💬',
            title: 'ข้อความใหม่',
            message: 'เจ้าหน้าที่สมหญิง ส่งข้อความเรื่องผู้ป่วย',
            forRoles: ['doctor'],
            forPatientId: '',
            read: false
        },
        {
            type: 'appointment',
            icon: '📅',
            title: 'นัดหมายวันนี้',
            message: 'มีผู้ป่วยนัดตรวจ 3 ราย ในวันนี้',
            forRoles: ['doctor', 'worker'],
            forPatientId: '',
            read: true
        },
        {
            type: 'task',
            icon: '📋',
            title: 'งานที่ได้รับมอบหมาย',
            message: 'ติดตามผู้ป่วย HN11234 - นพ.สมชาย สั่งให้ติดตามอาการ',
            forRoles: ['worker'],
            forPatientId: '',
            read: false
        },
        {
            type: 'patient_alert',
            icon: '⚠️',
            title: 'ครบกำหนดติดตาม',
            message: 'ผู้ป่วยเฝ้าระวัง 5 ราย ครบกำหนดติดตามสัปดาห์นี้',
            forRoles: ['worker'],
            forPatientId: '',
            read: true
        },
        {
            type: 'review',
            icon: '📝',
            title: 'รอตรวจสอบ',
            message: 'มีข้อมูลผู้ป่วยใหม่ 2 ราย รอการตรวจสอบจากแพทย์',
            forRoles: ['doctor'],
            forPatientId: '',
            read: false
        }
    ];

    // ============================================================
    // SEED FUNCTIONS
    // ============================================================

    function seedStaff() {
        var batch = db.batch();
        staffData.forEach(function(staff) {
            var docId = staff.docId;
            delete staff.docId;
            staff.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            batch.set(db.collection('staff').doc(docId), staff);
        });
        return batch.commit().then(function() {
            console.log('Seeded ' + staffData.length + ' staff members');
        });
    }

    function seedPatients() {
        var promises = [];

        patientData.forEach(function(patient, index) {
            var records = patient.healthRecords || [];
            delete patient.healthRecords;

            patient.registeredAt = firebase.firestore.FieldValue.serverTimestamp();
            patient.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            patient.registeredBy = 'staff-2';

            // Use sequential doc IDs for backward compatibility
            var docId = 'patient-' + (index + 1);

            var promise = db.collection('patients').doc(docId).set(patient)
                .then(function() {
                    // Add health records as subcollection
                    var recordPromises = [];
                    records.forEach(function(record) {
                        record.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                        recordPromises.push(
                            db.collection('patients').doc(docId)
                                .collection('healthRecords').add(record)
                        );
                    });
                    return Promise.all(recordPromises);
                });

            promises.push(promise);
        });

        return Promise.all(promises).then(function() {
            console.log('Seeded ' + patientData.length + ' patients with health records');
        });
    }

    function seedAppointments() {
        var batch = db.batch();
        appointmentData.forEach(function(appt) {
            var docId = appt.docId;
            delete appt.docId;
            appt.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            appt.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            batch.set(db.collection('appointments').doc(docId), appt);
        });
        return batch.commit().then(function() {
            console.log('Seeded ' + appointmentData.length + ' appointments');
        });
    }

    function seedConversations() {
        var promises = [];

        conversationData.forEach(function(conv) {
            var docId = conv.docId;
            var messages = conv.messages || [];
            delete conv.docId;
            delete conv.messages;

            var promise = db.collection('conversations').doc(docId).set(conv)
                .then(function() {
                    var msgPromises = [];
                    messages.forEach(function(msg) {
                        msgPromises.push(
                            db.collection('conversations').doc(docId)
                                .collection('messages').add(msg)
                        );
                    });
                    return Promise.all(msgPromises);
                });

            promises.push(promise);
        });

        return Promise.all(promises).then(function() {
            console.log('Seeded ' + conversationData.length + ' conversations');
        });
    }

    function seedNotifications() {
        var batch = db.batch();
        notificationData.forEach(function(notif, index) {
            notif.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            notif.createdBy = 'system';
            notif.readAt = null;
            batch.set(db.collection('notifications').doc('notif-' + (index + 1)), notif);
        });
        return batch.commit().then(function() {
            console.log('Seeded ' + notificationData.length + ' notifications');
        });
    }

    /**
     * Seed all data into Firestore
     * @returns {Promise}
     */
    function seedAll() {
        console.log('Starting seed...');
        return seedStaff()
            .then(function() { return seedPatients(); })
            .then(function() { return seedAppointments(); })
            .then(function() { return seedConversations(); })
            .then(function() { return seedNotifications(); })
            .then(function() {
                console.log('All seed data imported successfully!');
            })
            .catch(function(error) {
                console.error('Seed error:', error);
                throw error;
            });
    }

    /**
     * Clear all Firestore data (use with caution!)
     * @returns {Promise}
     */
    function clearAll() {
        var collections = ['patients', 'staff', 'appointments', 'notifications', 'conversations'];
        var promises = collections.map(function(col) {
            return db.collection(col).get().then(function(snapshot) {
                var batch = db.batch();
                snapshot.forEach(function(doc) {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            });
        });
        return Promise.all(promises).then(function() {
            console.log('All data cleared');
        });
    }

    return {
        seedAll: seedAll,
        seedStaff: seedStaff,
        seedPatients: seedPatients,
        seedAppointments: seedAppointments,
        seedConversations: seedConversations,
        seedNotifications: seedNotifications,
        clearAll: clearAll
    };

})();
