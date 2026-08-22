/* CivicBuzz Admin Portal - all dashboard interactions live in this file. */

const userId = "USR10245";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const chartSets = {
  week: {
    labels: ["May 8", "May 9", "May 10", "May 11", "May 12", "May 13", "May 14"],
    reported: [111, 105, 80, 57, 94, 72, 53],
    resolved: [142, 135, 134, 112, 133, 115, 104],
  },
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Today"],
    reported: [125, 97, 117, 71, 89, 46, 61],
    resolved: [158, 126, 145, 109, 116, 88, 99],
  },
  quarter: {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    reported: [140, 116, 128, 91, 79, 62, 48],
    resolved: [172, 144, 149, 127, 111, 84, 72],
  },
};

let toastTimer;

const translations = {
  // Global / Sidebar / Topbar
  "Admin Portal": "एडमिन पोर्टल",
  Dashboard: "डैशबोर्ड",
  "Issue Queue": "समस्या सूची",
  "Track Issues": "समस्याएं ट्रैक करें",
  "Map & Hotspots": "मानचित्र और हॉटस्पॉट",
  Departments: "विभाग",
  Budgeting: "बजट",
  Analytics: "विश्लेषण",
  Settings: "सेटिंग्स",
  "Super Admin": "सुपर एडमिन",
  "Aditya Kumar Shyam": "आदित्य कुमार श्याम",
  "ADMIN-001": "एडमिन-001",
  "Dark Mode": "डार्क मोड",
  "Light Mode": "लाइट मोड",
  Logout: "लॉगआउट",
  "My Profile": "मेरी प्रोफाइल",
  "My Reports": "मेरी रिपोर्ट",
  "Budgeting & Tenders": "बजट और निविदाएं",
  "Administrator Profile": "व्यवस्थापक प्रोफाइल",
  "Admin ID": "एडमिन आईडी",
  "Account Status": "खाता स्थिति",
  "Active & Verified ✓": "सक्रिय और सत्यापित ✓",
  Jurisdiction: "कार्यक्षेत्र",
  "Access Level": "पहुँच स्तर",
  "Tier-1 Super Admin (Full Read/Write)": "टियर-1 सुपर एडमिन (पूर्ण अधिकार)",
  Close: "बंद करें",

  // Dashboard Overview
  "TUESDAY, 18 AUGUST 2026": "मंगलवार, 18 अगस्त 2026",
  "Good morning, Admin": "सुप्रभात, एडमिन",
  "Here is what is happening across your city today.": "आज आपके शहर में क्या हो रहा है, यहाँ देखें।",
  "Create issue": "समस्या बनाएं",
  "Issues Reported": "रिपोर्ट की गई समस्याएं",
  "Issues Resolved": "हल की गई समस्याएं",
  "Open Issues": "खुली समस्याएं",
  Overdue: "विलंबित",
  "vs last month": "पिछले महीने की तुलना में",
  "Reported vs Resolved Trend": "रिपोर्ट और समाधान का रुझान",
  Reported: "रिपोर्ट की गई",
  Resolved: "हल की गई",
  "Last 7 days": "पिछले 7 दिन",
  "Last 30 days": "पिछले 30 दिन",
  "This quarter": "यह तिमाही",
  "Priority Alerts": "प्राथमिकता अलर्ट",
  "View all": "सभी देखें",
  "Pothole on MG Road": "एमजी रोड पर गड्ढा",
  "Near Metro Station, MG Road": "मेट्रो स्टेशन के पास, एमजी रोड",
  "2h ago": "2 घंटे पहले",
  "Garbage Overflow": "कचरा भरा हुआ",
  "Sector 15, Nehru Park": "सेक्टर 15, नेहरू पार्क",
  "4h ago": "4 घंटे पहले",
  "Water Leakage": "पानी का रिसाव",
  "Block A, Green View Apartments": "ब्लॉक A, ग्रीन व्यू अपार्टमेंट",
  High: "उच्च",
  "6h ago": "6 घंटे पहले",
  "View priority queue": "प्राथमिकता सूची देखें",
  "Live Issue Map": "लाइव समस्या मानचित्र",
  "View full map ↗": "पूरा मानचित्र देखें ↗",
  Indiranagar: "इंदिरानगर",
  Koramangala: "कोरमंगला",
  "HSR Layout": "एचएसआर लेआउट",
  Urgent: "तत्काल",
  Open: "खुली",
  "AI Routing Queue": "एआई रूटिंग सूची",
  "Reports awaiting department assignment": "विभाग आवंटन की प्रतीक्षा कर रही रिपोर्टें",
  Issue: "समस्या",
  "Duplicate match": "डुप्लिकेट मिलान",
  "Suggested department": "सुझाया गया विभाग",
  "Pothole on 5th Main St": "5वीं मेन स्ट्रीट पर गड्ढा",
  "Roads & Potholes": "सड़कें और गड्ढे",
  "Garbage not collected": "कचरा एकत्र नहीं किया गया",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street light not working": "स्ट्रीट लाइट काम नहीं कर रही",
  "Street Lights": "स्ट्रीट लाइटें",
  "Resolution Rate": "समाधान दर",
  "8,240 resolved": "8,240 हल किए गए",
  "2,335 pending": "2,335 लंबित",
  "Recent Activity": "हाल की गतिविधि",
  "Latest updates from your departments": "आपके विभागों से नवीनतम अपडेट",
  "Issue #CB-12480 resolved": "समस्या #CB-12480 हल हो गई",
  "By Roads & Potholes Department": "सड़क और गड्ढे विभाग द्वारा",
  "New issue #CB-12481 reported": "नई समस्या #CB-12481 रिपोर्ट की गई",
  "Water leakage in Sector 9": "सेक्टर 9 में पानी का रिसाव",
  "Department assigned #CB-12482": "विभाग आवंटित #CB-12482",
  "Public comment on #CB-12479": "#CB-12479 पर सार्वजनिक टिप्पणी",
  "Additional details added": "अतिरिक्त विवरण जोड़ा गया",
  "10m ago": "10 मिनट पहले",
  "25m ago": "25 मिनट पहले",
  "35m ago": "35 मिनट पहले",
  "1h ago": "1 घंटे पहले",

  // Issue Queue & Triage Section
  "ADMIN • ISSUE QUEUE": "एडमिन • समस्या सूची",
  "Track & Triage Issues": "समस्याएं ट्रैक और प्रबंधित करें",
  "View, filter, triage, and manage citizen reported issues in real-time.": "नागरिकों द्वारा रिपोर्ट की गई समस्याओं को वास्तविक समय में देखें, फ़िल्टर करें और प्रबंधित करें।",
  "Total Issues": "कुल समस्याएं",
  "All reported issues": "सभी रिपोर्ट की गई समस्याएं",
  "Pending": "लंबित",
  "Awaiting action": "कार्रवाई की प्रतीक्षा में",
  "In Progress": "प्रगति पर",
  "Under work": "कार्य जारी",
  "Resolved": "हल की गई",
  "Awaiting verification": "सत्यापन की प्रतीक्षा में",
  "High Priority": "उच्च प्राथमिकता",
  "Requires attention": "ध्यान देने योग्य",
  "Status": "स्थिति",
  "All Status": "सभी स्थितियां",
  "All Statuses": "सभी स्थितियां",
  "Verified": "सत्यापित",
  "Rejected": "अस्वीकृत",
  "Priority": "प्राथमिकता",
  "All Priority": "सभी प्राथमिकताएं",
  "All Priorities": "सभी प्राथमिकताएं",
  "Critical": "गंभीर",
  "Medium": "मध्यम",
  "Low": "कम",
  "Category": "श्रेणी",
  "All Category": "सभी श्रेणियां",
  "All Categories": "सभी श्रेणियां",
  "Road": "सड़क",
  "Electricity": "बिजली",
  "Water": "पानी",
  "Garbage": "कचरा",
  "Drainage": "जल निकासी",
  "Date": "तिथि",
  "All Time": "सभी समय",
  "Today": "आज",
  "This Week": "इस सप्ताह",
  "This Month": "इस महीने",
  "Issue ID": "समस्या आईडी",
  "User ID": "यूज़र आईडी",
  "Action": "कार्रवाई",
  "Street Light Not Working": "स्ट्रीट लाइट काम नहीं कर रही",
  "Garbage Not Collected": "कचरा नहीं उठाया गया",
  "Water Pipeline Leakage": "पानी की पाइपलाइन लीकेज",
  "Dangerous Pothole on Flyover": "फ्लाईओवर पर खतरनाक गड्ढा",
  "18 Aug 2026": "18 अगस्त 2026",
  "17 Aug 2026": "17 अगस्त 2026",
  "16 Aug 2026": "16 अगस्त 2026",
  "15 Aug 2026": "15 अगस्त 2026",

  // Issue Details Slide-out Panel
  "Citizen Issue Details": "नागरिक समस्या विवरण",
  "Reported By": "रिपोर्टकर्ता",
  "Location": "स्थान",
  "Sector 4, Main Market": "सेक्टर 4, मुख्य बाजार",
  "Assigned Department": "आवंटित विभाग",
  "Street Lighting & Electricity": "स्ट्रीट लाइटिंग और बिजली",
  "Description": "विवरण",
  "Street light has been flickering and completely off for the last 3 days causing safety concerns near the junction.": "स्ट्रीट लाइट पिछले 3 दिनों से झिलमिला रही है और पूरी तरह बंद है जिससे चौराहे के पास सुरक्षा संबंधी चिंताएं बढ़ गई हैं।",
  "Citizen Verification Status": "नागरिक सत्यापन स्थिति",
  "Original Reporter": "मूल रिपोर्टकर्ता",
  "Nearby Citizen 1": "निकटवर्ती नागरिक 1",
  "Nearby Citizen 2": "निकटवर्ती नागरिक 2",
  "Assign": "आवंटित करें",
  "Reject": "अस्वीकार करें",
  "Mark Resolved": "हल के रूप में चिह्नित करें",

  // Departments Section
  "ADMIN • DEPARTMENTS": "एडमिन • विभाग",
  "Department Directory": "विभाग निर्देशिका",
  "Government departments responsible for resolving reported civic grievances.": "रिपोर्ट की गई नागरिक समस्याओं के समाधान के लिए जिम्मेदार सरकारी विभाग।",
  "+ Add Department": "+ विभाग जोड़ें",
  "Total Departments": "कुल विभाग",
  "Registered in system": "सिस्टम में पंजीकृत",
  "Active Departments": "सक्रिय विभाग",
  "Taking assignments": "कार्यभार ले रहे हैं",
  "Open Issues Assigned": "आवंटित खुली समस्याएं",
  "Across all wards": "सभी वार्डों में",
  "Avg. Resolution Time": "औसत समाधान समय",
  "Department Workload & Contacts": "विभाग कार्यभार और संपर्क",
  "Active": "सक्रिय",
  "Understaffed": "कर्मचारियों की कमी",
  "Roads & Potholes": "सड़कें और गड्ढे",
  "Road surface repairs, potholes, asphalt resurfacing, and pavement maintenance.": "सड़क मरम्मत, गड्ढे, डामरीकरण और फुटपाथ रखरखाव।",
  "Head:": "प्रमुख:",
  "Email:": "ईमेल:",
  "Phone:": "फोन:",
  "open issues": "खुली समस्याएं",
  "3.1d avg": "3.1 दिन औसत",
  "Street Lighting": "स्ट्रीट लाइटिंग",
  "Broken light poles, LED replacements, timer failures, and dark spot coverage.": "टूटे हुए लाइट पोल, एलईडी प्रतिस्थापन, टाइमर विफलता और अंधेरे स्थानों का समाधान।",
  "2.4d avg": "2.4 दिन औसत",
  "Sanitation & Waste": "स्वच्छता और कचरा प्रबंधन",
  "Garbage collection route monitoring, bin clearing, and illegal dumping remediation.": "कचरा संग्रहण निगरानी, डस्टबिन सफाई और अवैध कचरा निवारण।",
  "1.8d avg": "1.8 दिन औसत",
  "Water Supply & Drainage": "जल आपूर्ति और जल निकासी",
  "Pipe leaks, low water pressure, contaminated water, stormwater drainage, and sewage overflow.": "पाइप रिसाव, कम पानी का दबाव, दूषित पानी, जल निकासी और सीवेज ओवरफ्लो।",
  "4.9d avg": "4.9 दिन औसत",
  "Parks & Urban Greenery": "पार्क और शहरी हरियाली",
  "Park upkeep, playground maintenance, fallen tree removal, and roadside tree trimming.": "पार्क का रखरखाव, खेल के मैदान, गिरे हुए पेड़ों को हटाना और छंटाई।",
  "2.2d avg": "2.2 दिन औसत",

  // Budgeting & Tenders Section
  "ADMIN • PARTICIPATORY BUDGETING": "एडमिन • सहभागी बजट",
  "Budget & Tenders": "बजट और निविदाएं",
  "Create and manage government tenders generated from verified civic grievance clusters.": "सत्यापित नागरिक शिकायत समूहों से उत्पन्न सरकारी निविदाएं बनाएं और प्रबंधित करें।",
  "+ Add Tender": "+ निविदा जोड़ें",
  "Open tenders": "सक्रिय निविदाएं",
  "Currently published": "वर्तमान में प्रकाशित",
  "Draft tenders": "ड्राफ्ट निविदाएं",
  "Awaiting publication": "प्रकाशन की प्रतीक्षा में",
  "Allocated budget": "आवंटित बजट",
  "Across active projects": "सक्रिय परियोजनाओं में",
  "In progress": "प्रगति में",
  "Work currently tracked": "वर्तमान में ट्रैक किया जा रहा कार्य",
  "TENDER MANAGEMENT": "निविदा प्रबंधन",
  "Government projects": "सरकारी परियोजनाएं",
  "Manage tenders created from verified issue clusters.": "सत्यापित समस्या समूहों से बनाई गई निविदाओं का प्रबंधन करें।",
  "All": "सभी",
  "Draft": "ड्राफ्ट",
  "Published": "प्रकाशित",
  "Completed": "पूर्ण",
  "Priority road patching — Ward 15": "प्राथमिकता सड़क मरम्मत — वार्ड 15",
  "Repair the most-reported pothole locations across Ward 15.": "वार्ड 15 में सबसे अधिक रिपोर्ट किए गए गड्ढों की मरम्मत।",
  "Ward 15": "वार्ड 15",
  "8 verified complaints": "8 सत्यापित शिकायतें",
  "Estimated budget": "अनुमानित बजट",
  "Deadline": "समय सीमा",
  "24 Aug 2026": "24 अगस्त 2026",
  "Tender progress · 58%": "निविदा प्रगति · 58%",
  "Manage Tender": "निविदा प्रबंधित करें",
  "Drainage improvement — School Road": "जल निकासी सुधार — स्कूल रोड",
  "Resolve recurring drainage complaints near the primary school.": "प्राथमिक विद्यालय के पास बार-बार होने वाली जल निकासी समस्याओं का समाधान।",
  "Ward 12": "वार्ड 12",
  "12 verified complaints": "12 सत्यापित शिकायतें",
  "Target duration": "लक्षित अवधि",
  "45 days": "45 दिन",
  "Draft completion · 20%": "ड्राफ्ट पूर्णता · 20%",
  "Continue Draft": "ड्राफ्ट जारी रखें",
  "LED streetlight installation": "एलईडी स्ट्रीटलाइट स्थापना",
  "Install 20 LED streetlights around market and school corridors.": "बाजार और स्कूल क्षेत्रों में 20 एलईडी स्ट्रीटलाइट स्थापित करें।",
  "Ward 8": "वार्ड 8",
  "5 verified complaints": "5 सत्यापित शिकायतें",
  "Contractor": "ठेकेदार",
  "Work progress · 72%": "कार्य प्रगति · 72%",
  "Track Work": "कार्य ट्रैक करें",
  "Market sanitation upgrade": "बाजार स्वच्छता उन्नयन",
  "Improve waste collection points and sanitation facilities.": "कचरा संग्रहण स्थल और स्वच्छता सुविधाओं में सुधार।",
  "Ward 9": "वार्ड 9",
  "7 verified complaints": "7 सत्यापित शिकायतें",
  "Final cost": "अंतिम लागत",
  "Project completed · QR ready": "परियोजना पूर्ण · क्यूआर कोड तैयार",
  "View Project Trail": "परियोजना ट्रेल देखें",
  "PROJECT LIFECYCLE": "परियोजना जीवनचक्र",
  "Tender workflow": "निविदा कार्यप्रवाह",
  "One seamless status flow from citizen cluster verification to public QR audit trail.": "नागरिक समूह सत्यापन से लेकर सार्वजनिक क्यूआर ऑडिट ट्रेल तक एक निर्बाध स्थिति प्रवाह।",
  "Selected: CB-T-0015": "चयनित: CB-T-0015",
  "Cluster confirmed": "समूह की पुष्टि",
  "Draft Created": "ड्राफ्ट तैयार किया गया",
  "Budget prepared": "बजट तैयार",
  "Open for bids": "बोलियों के लिए खुला",
  "Contractor Awarded": "ठेकेदार आवंटित",
  "Selection done": "चयन पूर्ण",
  "Work in Progress": "कार्य प्रगति पर है",
  "Field updates": "मैदानी अपडेट",
  "Verification": "सत्यापन",
  "QR Trail": "क्यूआर ट्रेल",
  "Public audit": "सार्वजनिक ऑडिट",

  // Modals & Forms
  "NEW DEPARTMENT": "नया विभाग",
  "Add Department": "विभाग जोड़ें",
  "Department Name": "विभाग का नाम",
  "Department Head": "विभागाध्यक्ष",
  "Official Email": "आधिकारिक ईमेल",
  "Responsibility / Scope": "जिम्मेदारी / दायरा",
  "Cancel": "रद्द करें",
  "Save Department": "विभाग सहेजें",
  "NEW PROJECT": "नई परियोजना",
  "Add Tender": "निविदा जोड़ें",
  "Project Title": "परियोजना शीर्षक",
  "Ward / Location": "वार्ड / स्थान",
  "Budget (₹)": "बजट (₹)",
  "Target Completion": "लक्षित समापन",
  "Publish Tender": "निविदा प्रकाशित करें",

  // Footer & Miscellaneous
  "Quick Links": "त्वरित लिंक",
  "Making every civic issue visible,": "हर नागरिक समस्या को दृश्यमान,",
  "actionable and accountable.": "कार्रवाई योग्य और जवाबदेह बनाना।",
  "Empowering citizens to report problems": "नागरिकों को समस्याएं रिपोर्ट करने",
  "and build better communities together.": "और मिलकर बेहतर समुदाय बनाने के लिए सशक्त बनाना।",
  Home: "होम",
  "Report an Issue": "समस्या रिपोर्ट करें",
  "Track Complaint": "शिकायत ट्रैक करें",
  Community: "समुदाय",
  "About CivicBuzz": "सिविकबज़ के बारे में",
  "Civic Services": "नागरिक सेवाएं",
  "Road & Potholes": "सड़क और गड्ढे",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street Lights": "स्ट्रीट लाइटें",
  "Water & Drainage": "पानी और जल निकासी",
  "Public Infrastructure": "सार्वजनिक अवसंरचना",
  "Need Help?": "मदद चाहिए?",
  FAQs: "अक्सर पूछे जाने वाले प्रश्न",
  "How to Report": "रिपोर्ट कैसे करें",
  "How Tracking Works": "ट्रैकिंग कैसे काम करती है",
  "Contact Support": "सहायता से संपर्क करें",
  "Have a question?": "कोई प्रश्न है?",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम और शर्तें",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Built with": "बेहतर समुदायों के लिए",
  "for better communities.": "के साथ बनाया गया।",
  "Active Citizens": "सक्रिय नागरिक",
  Communities: "समुदाय",

  "May 8": "8 मई",
  "May 9": "9 मई",
  "May 10": "10 मई",
  "May 11": "11 मई",
  "May 12": "12 मई",
  "May 13": "13 मई",
  "May 14": "14 मई",
  "Week 1": "सप्ताह 1",
  "Week 2": "सप्ताह 2",
  "Week 3": "सप्ताह 3",
  "Week 4": "सप्ताह 4",
  "Week 5": "सप्ताह 5",
  "Week 6": "सप्ताह 6",
  Today: "आज",
  Jun: "जून",
  Jul: "जुलाई",
  Aug: "अगस्त",
  Sep: "सितंबर",
  Oct: "अक्टूबर",
  Nov: "नवंबर",
  Dec: "दिसंबर",
};

const attributeTranslations = {
  "Search issues, locations, departments...": "समस्याएं, स्थान, विभाग खोजें...",
  "Search by Issue ID, Title, User ID, Location...": "समस्या आईडी, शीर्षक, यूज़र आईडी, स्थान से खोजें...",
  "Search departments, heads, emails...": "विभाग, प्रमुख, ईमेल खोजें...",
  "Choose language": "भाषा चुनें",
  "Select Language": "भाषा चुनें",
  Notifications: "सूचनाएं",
  "Open navigation": "नेविगेशन खोलें",
  "Open profile menu": "प्रोफाइल मेनू खोलें",
  "Account options": "खाता विकल्प",
  "Switch to light mode": "लाइट मोड पर स्विच करें",
  "Switch to dark mode": "डार्क मोड पर स्विच करें",
  "Close panel": "पैनल बंद करें",
  "Close": "बंद करें",
  "Search": "खोजें",
  "View Details": "विवरण देखें",
  "e.g. Traffic Management": "उदा. यातायात प्रबंधन",
  "e.g. R. K. Gupta": "उदा. आर. के. गुप्ता",
  "traffic@civicbuzz.gov": "traffic@civicbuzz.gov",
  "Describe the scope of this department...": "इस विभाग के कार्यक्षेत्र का विवरण दें...",
  "e.g. Ward 15 Road Resurfacing": "उदा. वार्ड 15 सड़क मरम्मत",
  "e.g. Ward 15": "उदा. वार्ड 15",
};

const toastTranslations = {
  "Opening all priority alerts": "सभी प्राथमिकता अलर्ट खोले जा रहे हैं",
  "Opening the priority issue queue": "प्राथमिकता समस्या सूची खोली जा रही है",
  "Full map opened": "पूरा मानचित्र खोला गया",
  "Opening all AI recommendations": "सभी एआई सिफारिशें खोली जा रही हैं",
  "Opening complete activity history": "पूरी गतिविधि हिस्ट्री खोली जा रही है",
  "My Reports will open here.": "मेरी रिपोर्ट यहां खुलेगी।",
  "Logout is a demo action in this dashboard.": "लॉगआउट इस डैशबोर्ड में डेमो एक्शन है।",
  "Dark mode enabled.": "डार्क मोड चालू हो गया।",
  "Light mode enabled.": "लाइट मोड चालू हो गया।",
  "You have 3 priority issue notifications.": "आपके पास 3 प्राथमिकता समस्या सूचनाएं हैं।",
  "New issue workflow opened in the routing queue.": "रूटिंग सूची में नई समस्या वर्कफ्लो खोला गया।",
  "Department assignment updated.": "विभाग आवंटन अपडेट किया गया।",
  "Assigned issue to recommended department.": "समस्या अनुशंसित विभाग को आवंटित कर दी गई।",
  "Issue marked as rejected.": "समस्या को अस्वीकृत चिह्नित किया गया।",
  "Issue marked as resolved. Waiting for citizen verification.": "समस्या को हल चिह्नित किया गया। नागरिक सत्यापन की प्रतीक्षा है।",
  "FAQs page will open here.": "FAQ पेज यहां खुलेगा।",
  "How-to-report guide will open here.": "रिपोर्ट गाइड यहां खुलेगी।",
  "Complaint tracking guide will open here.": "शिकायत ट्रैकिंग गाइड यहां खुलेगी।",
  "Support contact options will open here.": "सपोर्ट संपर्क विकल्प यहां खुलेंगे।",
  "About CivicBuzz page will open here.": "CivicBuzz के बारे में पेज यहां खुलेगा।",
  "Privacy policy will open here.": "गोपनीयता नीति यहां खुलेगी।",
  "Terms and conditions will open here.": "नियम और शर्तें यहां खुलेंगी।",
  "Accessibility settings will open here.": "सुगम्यता सेटिंग्स यहां खुलेंगी।",
  "CivicBuzz LinkedIn profile will open here.": "CivicBuzz लिंक्डइन प्रोफाइल यहां खुलेंगी।",
};

const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function currentLanguage() {
  return document.documentElement.lang === "hi" ? "hi" : "en";
}

function t(value) {
  return currentLanguage() === "hi" ? translations[value] || value : value;
}

function localizeToast(message) {
  if (currentLanguage() !== "hi") {
    return message;
  }

  return toastTranslations[message] || translations[message] || message;
}

function translatePage(language) {
  const isHindi = language === "hi";

  document.documentElement.lang = language;
  document.documentElement.dir = "ltr";

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement && node.parentElement.closest("script, style")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);
    const key = original.trim();

    if (!key || !translations[key]) {
      return;
    }

    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];

    node.nodeValue = isHindi
      ? `${leading}${translations[key]}${trailing}`
      : original;
  });

  $$("select option").forEach((option) => {
    if (!originalText.has(option)) {
      originalText.set(option, option.textContent);
    }
    const orig = originalText.get(option);
    const key = orig.trim();
    if (translations[key]) {
      option.textContent = isHindi ? translations[key] : orig;
    }
  });

  $$("[placeholder], [aria-label]").forEach((element) => {
    if (!originalAttributes.has(element)) {
      originalAttributes.set(element, {
        placeholder: element.getAttribute("placeholder"),
        ariaLabel: element.getAttribute("aria-label"),
      });
    }

    const original = originalAttributes.get(element);

    if (original.placeholder) {
      element.setAttribute(
        "placeholder",
        isHindi
          ? attributeTranslations[original.placeholder] || translations[original.placeholder] || original.placeholder
          : original.placeholder,
      );
    }

    if (original.ariaLabel) {
      element.setAttribute(
        "aria-label",
        isHindi
          ? attributeTranslations[original.ariaLabel] || translations[original.ariaLabel] || original.ariaLabel
          : original.ariaLabel,
      );
    }
  });
}

function setupLanguage() {

  const languageSelector =
    document.querySelector(".language-selector");

  const languageButton =
    document.getElementById("languageButton");

  const languageDropdown =
    document.getElementById("languageDropdown");

  const languageCurrent =
    document.getElementById("languageCurrent");

  const languageOptions =
    document.querySelectorAll(".language-option");

  if (
    !languageSelector ||
    !languageButton ||
    !languageDropdown
  ) {
    return;
  }

  let language = "en";

  try {
    language =
      localStorage.getItem("civicbuzz-admin-language") || "en";
  } catch (_) {
    language = "en";
  }

  if (language !== "hi") {
    language = "en";
  }

  // Current language
  if (languageCurrent) {
    languageCurrent.textContent =
      language === "hi" ? "हिन्दी" : "English";
  }

  // Active option
  languageOptions.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.language === language
    );
  });

  // Translate saved language
  translatePage(language);

  // Open / close dropdown
  languageButton.addEventListener("click", (event) => {

    event.stopPropagation();

    const isOpen =
      languageSelector.classList.contains("open");

    languageSelector.classList.toggle(
      "open",
      !isOpen
    );

    languageButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  });

  // Language selection
  languageOptions.forEach((option) => {

    option.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      const selectedLanguage =
        option.dataset.language === "hi"
          ? "hi"
          : "en";

      // Update button text
      if (languageCurrent) {
        languageCurrent.textContent =
          selectedLanguage === "hi"
            ? "हिन्दी"
            : "English";
      }

      // Update active option
      languageOptions.forEach((item) => {
        item.classList.toggle(
          "active",
          item === option
        );
      });

      // Translate complete page
      translatePage(selectedLanguage);

      // Update chart
      updateTrendChart(
        $("#trendRange")?.value || "week"
      );

      // Close dropdown
      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );

      // Save language
      try {
        localStorage.setItem(
          "civicbuzz-admin-language",
          selectedLanguage
        );
      } catch (_) { }
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (event) => {

    if (!languageSelector.contains(event.target)) {

      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  // Close with Escape
  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });
}

function showToast(message) {
  const toast = $("#toast");

  if (!toast) {
    return;
  }

  const localized = localizeToast(message);

  window.clearTimeout(toastTimer);

  toast.textContent = localized;
  toast.classList.add("show");

  toastTimer = window.setTimeout(
    () => toast.classList.remove("show"),
    2600
  );
}

function updateTrendChart(range) {
  const data = chartSets[range];

  if (!data) {
    return;
  }

  const toPoints = (values) =>
    values
      .map((value, index) => {
        const x =
          index === 0
            ? 10
            : index === values.length - 1
              ? 720
              : 10 + (710 / (values.length - 1)) * index;

        return `${x.toFixed(1)},${value}`;
      })
      .join(" ");

  const addPoints = (groupId, values, className) => {
    const group = $(groupId);

    if (!group) {
      return;
    }

    group.innerHTML = values
      .map((value, index) => {
        const x =
          index === 0
            ? 10
            : index === values.length - 1
              ? 720
              : 10 + (710 / (values.length - 1)) * index;

        return `<circle class="${className}" cx="${x.toFixed(
          1
        )}" cy="${value}" r="4.3"></circle>`;
      })
      .join("");
  };

  const reportedLine = $("#reportedLine");
  const resolvedLine = $("#resolvedLine");

  if (reportedLine) {
    reportedLine.setAttribute(
      "points",
      toPoints(data.reported)
    );
  }

  if (resolvedLine) {
    resolvedLine.setAttribute(
      "points",
      toPoints(data.resolved)
    );
  }

  addPoints(
    "#reportedPoints",
    data.reported,
    "reported-point"
  );

  addPoints(
    "#resolvedPoints",
    data.resolved,
    "resolved-point"
  );

  const labelRow = $("#chartLabels");

  if (labelRow) {
    labelRow.innerHTML = data.labels
      .map((label) => `<span>${t(label)}</span>`)
      .join("");
  }
}

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle(
    "dark-theme",
    isDark
  );

  const toggle = $("#profileThemeToggle");
  const icon = $("#themeIcon");
  const label = $("#themeLabel");
  const switchControl = $("#themeSwitch");

  if (toggle) {
    toggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );

    toggle.setAttribute(
      "aria-label",
      isDark
        ? t("Switch to light mode")
        : t("Switch to dark mode")
    );
  }

  if (icon) {
    icon.className = `fa-solid ${isDark ? "fa-sun" : "fa-moon"
      }`;
  }

  if (label) {
    label.textContent = isDark
      ? t("Light Mode")
      : t("Dark Mode");
  }

  if (switchControl) {
    switchControl.classList.toggle(
      "is-dark",
      isDark
    );
  }

  try {
    localStorage.setItem(
      "civicbuzz-admin-theme",
      theme
    );
  } catch (_) {
    // The dashboard still works when browser storage is unavailable.
  }
}

function activateNav(link) {
  $$(".nav-link").forEach((item) =>
    item.classList.remove("active")
  );

  link.classList.add("active");

  const section =
    link.dataset.section ||
    link.textContent.trim();

  const breadcrumb = $("#breadcrumbCurrent");
  if (breadcrumb) {
    breadcrumb.textContent = t(section);
  }

  showSection(section);
}

function showSection(sectionName) {
  const normalized = (sectionName || "dashboard").toLowerCase().replace(/[^a-z0-9]/g, "");

  const viewMap = {
    dashboard: "#section-dashboard",
    home: "#section-dashboard",
    issuequeue: "#section-issue-queue",
    trackissues: "#section-issue-queue",
    departments: "#section-departments",
    department: "#section-departments",
    budgeting: "#section-budgeting",
    tenders: "#section-budgeting",
    maphotspots: "#section-dashboard",
    map: "#section-dashboard",
    analytics: "#section-dashboard",
  };

  const targetSelector = viewMap[normalized] || "#section-dashboard";

  $$(".admin-view").forEach((view) => {
    view.classList.add("hidden");
  });

  const targetView = $(targetSelector);
  if (targetView) {
    targetView.classList.remove("hidden");
  }

  translatePage(currentLanguage());

  if (normalized === "maphotspots" || normalized === "map") {
    $("#map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else if (normalized === "analytics") {
    $(".trend-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function setupNavigation() {
  const sidebar = $(".sidebar");
  const mobileMenu = $("#mobileMenu");

  mobileMenu?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    mobileMenu.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    mobileMenu.textContent = isOpen
      ? "×"
      : "☰";
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        history.pushState(null, "", href);
      }
      activateNav(link);

      if (
        window.matchMedia(
          "(max-width: 760px)"
        ).matches
      ) {
        sidebar.classList.remove("open");

        mobileMenu?.setAttribute(
          "aria-expanded",
          "false"
        );

        if (mobileMenu) {
          mobileMenu.textContent = "☰";
        }
      }
    });
  });

  // Handle in-page nav targets (e.g. View Priority Queue button)
  $$("[data-nav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetHash = btn.dataset.navTarget;
      const matchedLink = $(`a[href='${targetHash}']`);
      if (matchedLink) {
        matchedLink.click();
      } else if (targetHash === "#issue-queue") {
        showSection("issuequeue");
        const b = $("#breadcrumbCurrent");
        if (b) b.textContent = t("Issue Queue");
      }
    });
  });

  // Handle initial hash routing
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const matchedLink = $(`a[href='#${hash}']`);
      if (matchedLink) {
        activateNav(matchedLink);
      } else {
        showSection(hash);
      }
    }
  });

  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "");
    const matchedLink = $(`a[href='#${hash}']`);
    if (matchedLink) {
      activateNav(matchedLink);
    } else {
      showSection(hash);
    }
  }

  document.addEventListener("click", (event) => {
    if (
      !window.matchMedia(
        "(max-width: 760px)"
      ).matches ||
      !sidebar.classList.contains("open")
    ) {
      return;
    }

    if (
      !sidebar.contains(event.target) &&
      !mobileMenu?.contains(event.target)
    ) {
      sidebar.classList.remove("open");

      mobileMenu?.setAttribute(
        "aria-expanded",
        "false"
      );

      if (mobileMenu) {
        mobileMenu.textContent = "☰";
      }
    }
  });
}

// =========================================================
// SUBMODULE: ISSUE QUEUE & TRIAGE (DATABASE CONNECTED)
// =========================================================

let currentActiveIssueId = null;

function setupIssueQueue() {
  const searchInput = $("#issueSearch");
  const statusFilter = $("#statusFilter");
  const priorityFilter = $("#priorityFilter");
  const categoryFilter = $("#categoryFilter");
  const dateFilter = $("#dateFilter");
  const tableBody = $("#issuesTableBody");

  const sidePanel = $("#issueDetailsPanel");
  const panelOverlay = $("#issuePanelOverlay");
  const closePanelBtn = $("#closeIssuePanel");

  function filterIssues() {
    const q = searchInput?.value.trim().toLowerCase() || "";
    const st = statusFilter?.value || "all";
    const pr = priorityFilter?.value || "all";
    const cat = categoryFilter?.value || "all";

    const rows = $$("tr", tableBody);
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowStatus = row.dataset.status || "";
      const rowPriority = row.dataset.priority || "";
      const rowCat = row.dataset.category || "";
      const rowText = row.textContent.toLowerCase();

      const matchQ = !q || rowText.includes(q);
      const matchSt = st === "all" || rowStatus.toLowerCase() === st.toLowerCase();
      const matchPr = pr === "all" || rowPriority.toLowerCase() === pr.toLowerCase();
      const matchCat = cat === "all" || rowCat.toLowerCase() === cat.toLowerCase();

      if (matchQ && matchSt && matchPr && matchCat) {
        row.hidden = false;
        visibleCount++;
      } else {
        row.hidden = true;
      }
    });

    const totalEl = $("#queueTotalCount");
    if (totalEl) totalEl.textContent = visibleCount;
  }

  searchInput?.addEventListener("input", filterIssues);
  statusFilter?.addEventListener("change", filterIssues);
  priorityFilter?.addEventListener("change", filterIssues);
  categoryFilter?.addEventListener("change", filterIssues);
  dateFilter?.addEventListener("change", filterIssues);

  function openIssueDetails(issueData) {
    if (!sidePanel || !panelOverlay) return;

    currentActiveIssueId = issueData.rawId || (issueData.id ? issueData.id.replace("#", "") : "ISS-1024");

    const pId = $("#panelIssueId");
    const pTitle = $("#panelIssueTitle");
    const pUser = $("#panelUserId");
    const pDate = $("#panelDate");
    const pLoc = $("#panelLocation");
    const pCat = $("#panelCategory");
    const pPri = $("#panelPriority");
    const pSt = $("#panelStatus");
    const pAss = $("#panelAssigned");
    const pDesc = $("#panelDescription");

    if (pId) pId.textContent = issueData.id || "#ISS-1024";
    if (pTitle) pTitle.textContent = issueData.title || "Civic Issue";
    if (pUser) pUser.textContent = issueData.user || "USR-2045";
    if (pDate) pDate.textContent = issueData.date || "Today";
    if (pLoc) pLoc.textContent = issueData.location || "Janpath Road, Ward 12";
    if (pCat) pCat.textContent = issueData.category || "🛣️ Road";
    if (pPri) {
      pPri.className = `priority-badge ${(issueData.priority || "high").toLowerCase()}`;
      pPri.textContent = issueData.priority || "High";
    }
    if (pSt) {
      pSt.className = `status-badge ${(issueData.status || "pending").toLowerCase()}`;
      pSt.textContent = issueData.status || "Pending";
    }
    if (pAss) pAss.textContent = issueData.dept || "Roads & Potholes Department";
    if (pDesc) pDesc.textContent = issueData.desc || "Reported civic issue awaiting verification and triage.";

    sidePanel.classList.add("open");
    panelOverlay.classList.add("active");
    translatePage(currentLanguage());
  }

  function closeIssueDetails() {
    sidePanel?.classList.remove("open");
    panelOverlay?.classList.remove("active");
  }

  closePanelBtn?.addEventListener("click", closeIssueDetails);
  panelOverlay?.addEventListener("click", closeIssueDetails);

  tableBody?.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-issue-btn") || e.target.closest("tr");
    if (btn) {
      const row = btn.closest("tr") || btn;
      const cells = row.querySelectorAll("td");
      if (cells.length >= 7) {
        const rawIdText = cells[0]?.textContent.trim();
        openIssueDetails({
          rawId: rawIdText.replace("#", ""),
          id: rawIdText,
          title: cells[1]?.textContent.trim(),
          user: cells[2]?.textContent.trim(),
          category: cells[3]?.textContent.trim(),
          priority: cells[4]?.textContent.trim(),
          date: cells[5]?.textContent.trim(),
          status: cells[6]?.textContent.trim(),
          location: "Janpath Road, Ward 12",
          dept: "Roads & Potholes Department",
          desc: `${cells[1]?.textContent.trim()} reported on ${cells[5]?.textContent.trim()}. Priority: ${cells[4]?.textContent.trim()}.`,
        });
      }
    }
  });

  $("#assignIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "ASSIGN", "ROADS_AND_POTHOLES");
      } catch (_) {}
    }
    showToast("Assigned issue to recommended department.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  $("#rejectIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "REJECT");
      } catch (_) {}
    }
    showToast("Issue marked as rejected.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  $("#resolveIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "RESOLVE");
      } catch (_) {}
    }
    showToast("Issue marked as resolved. Waiting for citizen verification.");
    const verRep = $("#verRep");
    if (verRep) {
      verRep.textContent = "Verified ✓";
      verRep.className = "ver-badge verified";
    }
    closeIssueDetails();
    loadLiveComplaints();
  });

  async function loadLiveComplaints() {
    if (!window.CivicBuzzAPI) return;
    try {
      const res = await window.CivicBuzzAPI.public.listComplaints();
      if (res && res.data && res.data.length > 0) {
        const comps = res.data;
        const totalCount = comps.length;
        const totalCountEl = $("#queueTotalCount");
        if (totalCountEl) totalCountEl.textContent = totalCount;
        const sideCount = $("#sidebarIssueCount");
        if (sideCount) sideCount.textContent = totalCount;

        let pendingCount = 0;
        let progressCount = 0;
        let resolvedCount = 0;

        let rowsHtml = "";
        comps.forEach((c) => {
          const catIcons = {
            roads_potholes: "🛣️ Road",
            streetlights: "💡 Electricity",
            water_supply: "🚰 Water",
            garbage_sanitation: "🗑️ Garbage",
            drainage: "🌊 Drainage",
          };
          const catLabel = catIcons[c.category] || `📍 ${c.category || "General"}`;
          const pr = (c.priority_level || c.priority?.level || "MEDIUM").toLowerCase();
          const rawSt = (c.status || "SUBMITTED").toLowerCase();
          const st = rawSt.replace(/_/g, " ");

          if (rawSt.includes("subm") || rawSt.includes("pend")) pendingCount++;
          else if (rawSt.includes("prog") || rawSt.includes("assign")) progressCount++;
          else if (rawSt.includes("resolv") || rawSt.includes("verif")) resolvedCount++;

          rowsHtml += `
            <tr data-status="${st}" data-priority="${pr}" data-category="${c.category || 'road'}">
              <td><strong>#${c.complaint_id}</strong></td>
              <td>${c.title}</td>
              <td>${c.user_uid || 'CIT-1001'}</td>
              <td><span class="category-chip">${catLabel}</span></td>
              <td><span class="priority-badge ${pr}">${pr}</span></td>
              <td>${new Date(c.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td><span class="status-badge ${st}">${st}</span></td>
              <td><button class="view-issue-btn" type="button" data-issue-id="${c.complaint_id}" title="View Details">👁</button></td>
            </tr>
          `;
        });

        if (tableBody) {
          tableBody.innerHTML = rowsHtml;
          translatePage(currentLanguage());
        }

        const qPending = $("#queuePendingCount");
        const qProg = $("#queueProgressCount");
        const qRes = $("#queueResolvedCount");
        if (qPending && pendingCount > 0) qPending.textContent = pendingCount;
        if (qProg && progressCount > 0) qProg.textContent = progressCount;
        if (qRes && resolvedCount > 0) qRes.textContent = resolvedCount;
      }
    } catch (_) {}
  }

  loadLiveComplaints();
}

// =========================================================
// SUBMODULE: DEPARTMENTS (DATABASE CONNECTED)
// =========================================================

function setupDepartments() {
  const searchInput = $("#departmentSearch");
  const deptGrid = $("#departmentGrid");
  const modal = $("#departmentModal");
  const openBtn = $("#openAddDepartment");
  const closeBtn = $("#closeDeptModal");
  const cancelBtn = $("#cancelDeptModal");
  const form = $("#departmentForm");

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    $$(".dept-card", deptGrid).forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.hidden = !(!q || text.includes(q));
    });
  });

  function openDeptModal() {
    if (modal) modal.hidden = false;
  }
  function closeDeptModal() {
    if (modal) modal.hidden = true;
  }

  openBtn?.addEventListener("click", openDeptModal);
  closeBtn?.addEventListener("click", closeDeptModal);
  cancelBtn?.addEventListener("click", closeDeptModal);

  async function loadDepartmentsFromDB() {
    if (!window.CivicBuzzAPI?.admin?.listDepartments) return;
    try {
      const res = await window.CivicBuzzAPI.admin.listDepartments();
      if (res && res.data && res.data.length > 0 && deptGrid) {
        let gridHtml = "";
        res.data.forEach((d) => {
          const icon = d.name.toLowerCase().includes("light") ? "💡" :
                       d.name.toLowerCase().includes("sanit") || d.name.toLowerCase().includes("waste") ? "🗑️" :
                       d.name.toLowerCase().includes("water") || d.name.toLowerCase().includes("drain") ? "🚰" :
                       d.name.toLowerCase().includes("park") || d.name.toLowerCase().includes("green") ? "🌳" : "🛣️";
          gridHtml += `
            <article class="dept-card" data-name="${d.name.toLowerCase()}">
              <div class="card-topline">
                <span class="dept-icon">${icon}</span>
                <span class="badge-active">${d.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <h3>${d.name}</h3>
              <p class="dept-desc">${d.description || 'Municipal department handling civic grievance triage.'}</p>
              <div class="dept-meta">
                <div><strong>Head:</strong> <span>${d.name.split(' ')[0]} Head</span></div>
                <div><strong>Email:</strong> <span>${d.contact_email || `${d.code.toLowerCase()}@civicbuzz.gov`}</span></div>
                <div><strong>Phone:</strong> <span>${d.contact_phone || '+91 80 2297 5000'}</span></div>
              </div>
              <div class="dept-footer">
                <span><strong>${d.open_issues || 0}</strong> open issues</span>
                <span class="pill-stat">${d.avg_resolution_days || 2.5}d avg</span>
              </div>
            </article>
          `;
        });
        deptGrid.innerHTML = gridHtml;
        const statTotal = $("#statTotal");
        if (statTotal) statTotal.textContent = res.data.length;
        translatePage(currentLanguage());
      }
    } catch (_) {}
  }

  loadDepartmentsFromDB();

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#deptName")?.value.trim();
    const head = $("#deptHead")?.value.trim();
    const email = $("#deptEmail")?.value.trim();
    const desc = $("#deptDesc")?.value.trim();

    if (name && deptGrid) {
      if (window.CivicBuzzAPI?.admin?.createDepartment) {
        try {
          await window.CivicBuzzAPI.admin.createDepartment({
            name,
            head_name: head,
            contact_email: email,
            description: desc,
          });
        } catch (_) {}
      }

      const card = document.createElement("article");
      card.className = "dept-card";
      card.setAttribute("data-name", name.toLowerCase());
      card.innerHTML = `
        <div class="card-topline">
          <span class="dept-icon">🏛️</span>
          <span class="badge-active">Active</span>
        </div>
        <h3>${name}</h3>
        <p class="dept-desc">${desc || 'Department registered for civic grievance triage.'}</p>
        <div class="dept-meta">
          <div><strong>Head:</strong> <span>${head}</span></div>
          <div><strong>Email:</strong> <span>${email}</span></div>
        </div>
        <div class="dept-footer">
          <span><strong>0</strong> open issues</span>
          <span class="pill-stat">New</span>
        </div>
      `;
      deptGrid.prepend(card);
      translatePage(currentLanguage());

      const statTotal = $("#statTotal");
      if (statTotal) {
        statTotal.textContent = String(Number(statTotal.textContent || 6) + 1);
      }

      showToast(`Department "${name}" stored in database.`);
      form.reset();
      closeDeptModal();
    }
  });
}

// =========================================================
// SUBMODULE: BUDGETING & TENDERS (DATABASE CONNECTED)
// =========================================================

function setupBudgeting() {
  const filterBtns = $$("#statusFilters .filter-button");
  const tenderTrack = $("#tenderTrack");
  const modal = $("#tenderModal");
  const openBtn = $("#openTenderModal");
  const closeBtn = $("#closeTenderModal");
  const cancelBtn = $("#cancelTenderModal");
  const form = $("#tenderForm");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter || "all";
      $$(".tender-card", tenderTrack).forEach((card) => {
        const st = card.dataset.status || "";
        card.hidden = !(filter === "all" || st === filter);
      });
    });
  });

  function openTModal() {
    if (modal) modal.hidden = false;
  }
  function closeTModal() {
    if (modal) modal.hidden = true;
  }

  openBtn?.addEventListener("click", openTModal);
  closeBtn?.addEventListener("click", closeTModal);
  cancelBtn?.addEventListener("click", closeTModal);

  async function loadTendersFromDB() {
    if (!window.CivicBuzzAPI?.tenders?.list) return;
    try {
      const res = await window.CivicBuzzAPI.tenders.list();
      if (res && res.data && res.data.length > 0 && tenderTrack) {
        let tendersHtml = "";
        res.data.forEach((t) => {
          const stClass = (t.status || "published").toLowerCase();
          tendersHtml += `
            <article class="tender-card" data-status="${stClass}">
              <div class="card-topline"><span class="status-badge-sm ${stClass}">${t.status || 'Published'}</span><span class="tender-id">${t.tender_id}</span></div>
              <h3>${t.title}</h3>
              <p class="card-description">${t.description || 'Civic infrastructure project generated from verified citizen clusters.'}</p>
              <div class="card-meta"><span>📍 Ward ${t.ward_id || 15}</span><span>✓ ${t.verified_locations_count || 5} verified complaints</span></div>
              <div class="budget-row"><div><span>Estimated budget</span><strong>₹${Number(t.estimated_budget || 250000).toLocaleString('en-IN')}</strong></div><div><span>Deadline</span><strong>${t.submission_deadline || '24 Aug 2026'}</strong></div></div>
              <div class="mini-progress"><span style="width:${t.progress_percentage || 20}%"></span></div>
              <p class="progress-label">Tender progress · ${t.progress_percentage || 20}%</p>
              <button class="outline-button view-tender" data-tender="${t.tender_id}">Manage Tender</button>
            </article>
          `;
        });
        tenderTrack.innerHTML = tendersHtml;
        translatePage(currentLanguage());
      }
    } catch (_) {}
  }

  loadTendersFromDB();

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = $("#tenderTitle")?.value.trim();
    const ward = $("#tenderWard")?.value.trim();
    const budget = $("#tenderBudget")?.value.trim();
    const deadline = $("#tenderDeadline")?.value.trim();

    if (title && tenderTrack) {
      const numBudget = Number(budget) || 250000;
      let newTid = `CB-T-00${Math.floor(20 + Math.random() * 80)}`;

      if (window.CivicBuzzAPI?.admin?.createTender) {
        try {
          const res = await window.CivicBuzzAPI.admin.createTender({
            title,
            description: `Tender created from verified complaint cluster in ${ward}.`,
            ward_id: 15,
            category: "Infrastructure",
            location: ward,
            estimated_budget: numBudget,
            duration_days: 45,
            submission_deadline: deadline,
          });
          if (res?.data?.tender_id) newTid = res.data.tender_id;
        } catch (_) {}
      }

      const card = document.createElement("article");
      card.className = "tender-card";
      card.setAttribute("data-status", "published");
      card.innerHTML = `
        <div class="card-topline"><span class="status-badge-sm published">Published</span><span class="tender-id">${newTid}</span></div>
        <h3>${title}</h3>
        <p class="card-description">Civic project tender created from citizen grievance clusters.</p>
        <div class="card-meta"><span>📍 ${ward}</span><span>✓ Verified cluster</span></div>
        <div class="budget-row"><div><span>Estimated budget</span><strong>₹${numBudget.toLocaleString('en-IN')}</strong></div><div><span>Deadline</span><strong>${deadline}</strong></div></div>
        <div class="mini-progress"><span style="width:10%"></span></div>
        <p class="progress-label">Tender progress · 10%</p>
        <button class="outline-button view-tender" data-tender="${newTid}">Manage Tender</button>
      `;
      tenderTrack.prepend(card);
      translatePage(currentLanguage());

      showToast(`Tender "${title}" stored in database.`);
      form.reset();
      closeTModal();
    }
  });

  // Lifecycle steps interactive click
  $$(".lifecycle-step").forEach((step) => {
    step.addEventListener("click", () => {
      $$(".lifecycle-step").forEach((s) => s.classList.remove("active"));
      step.classList.add("active");
      showToast(`Lifecycle milestone selected: ${step.querySelector("strong")?.textContent}`);
    });
  });
}

function setupActions() {
  const newIssue = $("#newIssue");

  newIssue?.addEventListener("click", () => {
    showSection("issuequeue");
    showToast("Navigated to Issue Queue.");
  });

  $$("[data-toast]").forEach((button) => {
    button.addEventListener("click", () =>
      showToast(button.dataset.toast)
    );
  });

  $(".notification")?.addEventListener(
    "click",
    () => {
      showToast("No unread system alerts.");
    }
  );
}

function setupProfileMenu() {
  const wrapper = $("#profileWrapper");
  const button = $("#profileButton");
  const dropdown = $("#profileDropdown");
  const profileModal = $("#profileModal");
  const closeProfileModal = $("#closeProfileModal");
  const closeProfileModalBtn = $("#closeProfileModalBtn");
  const modalLogoutBtn = $("#modalLogoutBtn");
  const userIdButton = $("#userIdButton");

  if (!wrapper || !button || !dropdown) {
    return;
  }

  // Populate dynamic logged-in user profile from localStorage
  try {
    const savedUser = JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
    let name = "Administrator";
    let roleText = "Super Admin";
    let uid = "ADMIN-001";

    if (savedUser) {
      if (savedUser.full_name) {
        name = savedUser.full_name;
      } else if (savedUser.email && savedUser.email.includes("@")) {
        name = savedUser.email.split("@")[0].replace(/[._-]/g, " ").split(" ").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      }
      if (savedUser.role) roleText = savedUser.role;
      if (savedUser.user_uid) uid = savedUser.user_uid;
    }

    const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "AD";
    
    button.textContent = initials;
    
    const largeAvatar = $(".profile-avatar-large", dropdown);
    if (largeAvatar) largeAvatar.textContent = initials;
    
    const nameEl = $("#headerProfileName");
    if (nameEl) nameEl.textContent = name;
    
    const roleEl = $("#headerProfileRole");
    if (roleEl) roleEl.textContent = roleText;
    
    const uidEl = $("#userIdText");
    if (uidEl) uidEl.textContent = uid;

    // Sidebar bottom mini profile
    const sideStrong = $(".admin-mini strong");
    if (sideStrong) sideStrong.textContent = name;
    
    const sideSmall = $(".admin-mini small");
    if (sideSmall) sideSmall.textContent = roleText;
    
    const sideAvatar = $(".admin-mini .avatar-small");
    if (sideAvatar) sideAvatar.textContent = initials;
  } catch (_) {}

  const closeMenu = () => {
    wrapper.classList.remove("is-open", "open");
    dropdown.classList.remove("is-open", "open");
    button.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    wrapper.classList.add("is-open", "open");
    dropdown.classList.add("is-open", "open");
    button.setAttribute("aria-expanded", "true");
    dropdown.setAttribute("aria-hidden", "false");
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wrapper.classList.contains("is-open") || wrapper.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Copy Admin ID
  userIdButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const uidText = $("#userIdText")?.textContent || "ADMIN-001";
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(uidText).then(() => {
        showToast(`Admin ID (${uidText}) copied!`);
      }).catch(() => {
        showToast(`Admin ID: ${uidText}`);
      });
    } else {
      showToast(`Admin ID: ${uidText}`);
    }
  });

  function openAdminProfileModal() {
    if (!profileModal) return;
    try {
      const savedUser = JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
      let name = "Administrator";
      let roleText = "Super Administrator";
      let email = "admin@civicbuzz.in";
      let uid = "ADMIN-001";

      if (savedUser) {
        if (savedUser.full_name) {
          name = savedUser.full_name;
        } else if (savedUser.email && savedUser.email.includes("@")) {
          name = savedUser.email.split("@")[0].replace(/[._-]/g, " ").split(" ").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
        }
        if (savedUser.role) roleText = savedUser.role;
        if (savedUser.email) email = savedUser.email;
        if (savedUser.user_uid) uid = savedUser.user_uid;
      }

      const initials = name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "AD";

      const mAvatar = $("#modalAvatarLarge");
      if (mAvatar) mAvatar.textContent = initials;
      const mName = $("#modalProfileFullName");
      if (mName) mName.textContent = name;
      const mRole = $("#modalProfileRole");
      if (mRole) mRole.textContent = roleText;
      const mEmail = $("#modalProfileEmail");
      if (mEmail) mEmail.textContent = email;
      const mUid = $("#modalProfileUid");
      if (mUid) mUid.textContent = uid;
    } catch (_) {}

    profileModal.hidden = false;
  }

  function closeAdminProfileModal() {
    if (profileModal) profileModal.hidden = true;
  }

  closeProfileModal?.addEventListener("click", closeAdminProfileModal);
  closeProfileModalBtn?.addEventListener("click", closeAdminProfileModal);
  modalLogoutBtn?.addEventListener("click", () => {
    closeAdminProfileModal();
    performLogout();
  });

  function performLogout() {
    if (window.CivicBuzzAPI) {
      try {
        window.CivicBuzzAPI.auth.logout();
      } catch (_) {}
    }
    localStorage.removeItem("civicbuzz_token");
    localStorage.removeItem("civicbuzz_user");
    showToast("Logged out successfully.");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 300);
  }

  dropdown.addEventListener("click", (event) => {
    const item = event.target.closest("[data-action]");
    if (!item) return;

    event.preventDefault();
    event.stopPropagation();
    const action = item.dataset.action;

    if (action === "theme") {
      setTheme(document.body.classList.contains("dark-theme") ? "light" : "dark");
      showToast(document.body.classList.contains("dark-theme") ? "Dark mode enabled." : "Light mode enabled.");
      return;
    }

    if (action === "logout") {
      performLogout();
      return;
    }

    if (action === "profile") {
      openAdminProfileModal();
      closeMenu();
      return;
    }

    closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeAdminProfileModal();
      button.focus();
    }
  });
}

function initialiseDashboard() {
  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("civicbuzz-admin-theme") || "light";
  } catch (_) {
    savedTheme = "light";
  }

  setTheme(savedTheme);

  setupLanguage();

  updateTrendChart("week");

  setupNavigation();

  setupIssueQueue();

  setupDepartments();

  setupBudgeting();

  setupSearch();

  setupActions();

  setupFooterActions();

  setupProfileMenu();

  // Synchronize authenticated admin profile from backend database
  if (window.CivicBuzzAPI?.auth?.getMe && window.CivicBuzzAPI?.getToken?.()) {
    window.CivicBuzzAPI.auth.getMe().then((res) => {
      if (res && res.data && res.data.full_name) {
        localStorage.setItem("civicbuzz_user", JSON.stringify(res.data));
        setupProfileMenu();
        if (typeof applyLoggedInAdminProfile === "function") {
          applyLoggedInAdminProfile();
        }
      }
    }).catch((_) => {});
  }

  // Load live stats if API available
  if (window.CivicBuzzAPI) {
    window.CivicBuzzAPI.public.getStats().then((res) => {
      if (res && res.data) {
        const s = res.data;
        if (s.total_reported !== undefined) {
          const el = $("#metricReported");
          if (el) el.textContent = `${s.total_reported}`;
        }
        if (s.total_resolved !== undefined) {
          const el = $("#metricResolved");
          if (el) el.textContent = `${s.total_resolved}`;
        }
        if (s.active_reports !== undefined) {
          const el = $("#metricOpen");
          if (el) el.textContent = `${s.active_reports}`;
        }
      }
    }).catch((_) => {});
  }

  $("#trendRange")?.addEventListener("change", (event) => {
    updateTrendChart(event.target.value);
    showToast(`Trend updated: ${event.target.options[event.target.selectedIndex].text}.`);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseDashboard);
} else {
  initialiseDashboard();
}

