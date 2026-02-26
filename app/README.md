# 🚀 Health Desk - Working Prototype

This is a fully functional prototype of the Health Desk application.

## 📱 Demo Accounts

Use these credentials to login:

### Admin Account
- **Email**: `admin@health.go.th`
- **Password**: `admin123`
- **Access**: Full dashboard, reports, patient management

### Field Worker Account
- **Email**: `worker@health.go.th`
- **Password**: `worker123`
- **Access**: Mobile field app for data entry

### Doctor Account
- **Email**: `doctor@health.go.th`
- **Password**: `doctor123`
- **Access**: Dashboard and patient viewing

## 🎯 Features Implemented

### ✅ Authentication System
- Login page with email/password
- Mock authentication
- Session management with localStorage
- Role-based redirects

### ✅ Admin Dashboard
- Real-time statistics (animated counters)
- Interactive Charts (Chart.js)
  - Health trend line chart
  - BMI distribution doughnut chart
- High-risk patients table
- Activity feed
- Period selector (today, week, month, year)
- Export functionality

### ✅ Field Worker Mobile App
- Patient search (by HN, name, citizen ID)
- Health data entry form
  - Weight & Height (auto-calculate BMI)
  - Blood Pressure (with alerts)
  - Blood Sugar (with alerts)
  - Heart Rate, Temperature, Oxygen Level
  - Notes and next appointment
- Real-time validation and alerts
- Summary before save
- Mobile-optimized UI with bottom navigation

### ✅ Patient Management
- Patient list with filters
  - Search by name, HN, citizen ID
  - Filter by risk level
  - Filter by disease
  - Filter by age group
- Table view and Card view toggle
- Pagination
- Mini statistics
- Export to Excel (mock)
- Bulk select functionality

### ✅ Mock Data
- 50+ mock patients with realistic data
- Various risk levels and diseases
- Health records with vital signs
- Activity logs

## 📂 File Structure

```
app/
├── login.html              # Login page
├── dashboard.html          # Admin dashboard
├── field-app.html          # Mobile field worker app
├── patients.html           # Patient list & management
├── reports.html            # Reports (coming soon)
└── README.md              # This file

js/
├── mock-data.js           # Mock patient data (50+ patients)
├── auth.js                # Authentication logic
├── dashboard.js           # Dashboard logic & charts
├── field-app.js           # Field app logic & validation
└── patients.js            # Patient list logic & filters

css/
├── styles.css             # Base styles
└── app-styles.css         # App-specific styles
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface
- **Animated Elements**: Smooth transitions and counter animations
- **Interactive Charts**: Using Chart.js for data visualization
- **Real-time Validation**: Instant feedback on health data entry
- **Alert System**: Warnings for abnormal health values
- **BMI Calculator**: Auto-calculates and categorizes BMI
- **Health Status Indicators**: Color-coded risk levels

## 🔧 Technical Implementation

### Frontend
- Pure HTML5, CSS3, JavaScript (no build process needed)
- Chart.js for data visualization
- LocalStorage for session management
- Responsive CSS Grid and Flexbox
- Mobile-first approach

### Data Flow
1. Mock data in `mock-data.js`
2. Authentication in `auth.js`
3. Page-specific logic in separate JS files
4. All data stored in memory (no backend yet)

## 📊 Sample Data

The prototype includes:
- 50+ mock patients
- Various health conditions (hypertension, diabetes, obesity, heart disease)
- Different risk levels (high, medium, low, none)
- Age range: 20-70 years
- Realistic vital signs data

## 🚀 Getting Started

1. Start the local server (already running on port 8000)
2. Open http://localhost:8000/app/login.html
3. Login with demo credentials
4. Explore the features!

## ⚡ Quick Tour

### As Admin:
1. Login with `admin@health.go.th / admin123`
2. View dashboard with statistics and charts
3. Click on "ผู้ป่วย" to see patient list
4. Try filtering and searching patients
5. Switch between table and card view

### As Field Worker:
1. Login with `worker@health.go.th / worker123`
2. Search for a patient (try "HN12345" or "สมชาย")
3. Enter health data
4. Watch real-time BMI calculation
5. See alerts for abnormal values
6. Save the record

## 💡 Demo Tips

- Try entering different blood pressure values to see alerts
- BMI is calculated automatically when you enter weight and height
- Search accepts HN, name, or citizen ID
- Filters can be combined for precise results
- All data is stored in memory only

## 🎯 What's Next?

This is Phase 1 (MVP). Future phases will include:

**Phase 2:**
- Offline mode with service workers
- Real backend API integration
- Push notifications
- Advanced analytics
- Appointment scheduling

**Phase 3:**
- AI health risk prediction
- Integration with NHSO and HDC
- Mobile native apps
- Multi-language support
- Advanced reporting

## 🐛 Known Limitations

- Data is not persisted (refreshing page loses data)
- No actual API calls (all mock data)
- No backend authentication
- No real data validation against database
- Reports page is placeholder only

## 📝 Notes

This is a **working prototype** designed to demonstrate:
- Core functionality
- User interface and experience
- Data flow and interactions
- Technical feasibility

Perfect for:
- Stakeholder demos
- User testing
- Requirements validation
- Development planning

---

**Built with ❤️ for Health Desk Project**

*Version: 1.0.0-prototype*
*Date: February 25, 2024*
