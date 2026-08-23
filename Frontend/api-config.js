/**
 * CivicBuzz Frontend Universal API Integration & Live Data Synchronization Client
 * Connects all frontend modules to the FastAPI backend and maintains a synchronized
 * local data store for realtime cross-tab metrics, triage, and live charts.
 */

var API_CONFIG = window.API_CONFIG || {
  BASE_URL: "http://localhost:8000/api/v1",
<<<<<<< HEAD
  TIMEOUT_MS: 1200,
};
window.API_CONFIG = API_CONFIG;

// =========================================================================
// UNIFIED REAL COMPLAINT STORE (Synchronized across tabs via BroadcastChannel & Storage)
// =========================================================================

const SEED_COMPLAINTS = [
  {
    complaint_id: "CB-12480",
    title: "Damaged Road & Potholes near Metro Station",
    description: "Deep potholes causing severe traffic jams and water stagnation on Janpath Road near Metro Station.",
    category: "roads_potholes",
    sub_category: "potholes",
    severity: "HIGH",
    priority_level: "HIGH",
    priority: { level: "HIGH", score: 85 },
    status: "RESOLVED",
    is_overdue: false,
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    location: { ward_name: "Ward 12", address: "Near Metro Station, Janpath Road", latitude: 20.2961, longitude: 85.8245 },
    department_name: "Roads & Potholes Department",
    department_code: "ROADS_AND_POTHOLES",
    user_uid: "CIT-2041",
    timeline: [
      { step: "Reported by Citizen", status: "SUBMITTED", timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), notes: "Issue logged with geotag." },
      { step: "Assigned to Department", status: "ASSIGNED", timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), notes: "Dispatched to Road Maintenance Crew." },
      { step: "Work Completed & Resolved", status: "RESOLVED", timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), notes: "Patchwork asphalt completed." }
    ]
  },
  {
    complaint_id: "CB-12481",
    title: "Broken Streetlight & Dark Stretch",
    description: "Street lights not functioning on 16th Main Road causing safety hazard for pedestrians at night.",
    category: "streetlights",
    sub_category: "non_functional",
    severity: "CRITICAL",
    priority_level: "CRITICAL",
    priority: { level: "CRITICAL", score: 92 },
    status: "PENDING",
    is_overdue: true,
    image_url: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    location: { ward_name: "Ward 08", address: "16th Main Road, Sector 4", latitude: 20.2980, longitude: 85.8210 },
    department_name: "Street Lights Department",
    department_code: "STREET_LIGHTS",
    user_uid: "CIT-1892",
    timeline: [
      { step: "Reported by Citizen", status: "SUBMITTED", timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), notes: "Grievance received." }
    ]
  },
  {
    complaint_id: "CB-12482",
    title: "Overflowing Garbage Dump near Community Park",
    description: "Garbage bin overflowing for over 3 days, foul smell and health hazard near Sector 15 Park.",
    category: "garbage_sanitation",
    sub_category: "overflowing_dump",
    severity: "HIGH",
    priority_level: "HIGH",
    priority: { level: "HIGH", score: 88 },
    status: "REJECTED",
    is_overdue: false,
    image_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    location: { ward_name: "Ward 15", address: "Sector 15, Nehru Park", latitude: 20.2910, longitude: 85.8310 },
    department_name: "Garbage & Sanitation Department",
    department_code: "GARBAGE_SANITATION",
    user_uid: "CIT-3301",
    timeline: [
      { step: "Reported by Citizen", status: "SUBMITTED", timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), notes: "Waste overflow reported." },
      { step: "Rejected by Administrator", status: "REJECTED", timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), notes: "Duplicate grievance reported for same park zone." }
    ]
  },
  {
    complaint_id: "CB-12483",
    title: "Main Water Pipeline Leakage",
    description: "Drinking water pipeline ruptured with high volume water wastage flooding the street.",
    category: "water_supply",
    sub_category: "pipe_burst",
    severity: "HIGH",
    priority_level: "HIGH",
    priority: { level: "HIGH", score: 81 },
    status: "RESOLVED",
    is_overdue: false,
    image_url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    location: { ward_name: "Ward 04", address: "Block A, Green View Apartments", latitude: 20.3010, longitude: 85.8150 },
    department_name: "Water Supply & Sewerage",
    department_code: "WATER_SUPPLY",
    user_uid: "CIT-4412",
    timeline: [
      { step: "Reported by Citizen", status: "SUBMITTED", timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), notes: "Leakage logged." },
      { step: "Pipeline Replaced & Verified", status: "RESOLVED", timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), notes: "Valve repaired." }
    ]
  },
  {
    complaint_id: "CB-12484",
    title: "Clogged Stormwater Drain Overflowing",
    description: "Stormwater drain blocked by debris leading to localized waterlogging after recent rain.",
    category: "drainage",
    sub_category: "blocked_drain",
    severity: "MEDIUM",
    priority_level: "MEDIUM",
    priority: { level: "MEDIUM", score: 65 },
    status: "PENDING",
    is_overdue: false,
    image_url: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    location: { ward_name: "Ward 09", address: "5th Cross Road, BTM Layout", latitude: 20.2850, longitude: 85.8400 },
    department_name: "Drainage & Sewerage",
    department_code: "DRAINAGE",
    user_uid: "CIT-1120",
    timeline: [
      { step: "Reported by Citizen", status: "PENDING", timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), notes: "Grievance received." }
    ]
  },
  {
    complaint_id: "CB-12485",
    title: "Open Manhole on Pedestrian Sidewalk",
    description: "Uncovered manhole on main pedestrian walkway posing extreme danger to children and citizens.",
    category: "drainage",
    sub_category: "open_manhole",
    severity: "CRITICAL",
    priority_level: "CRITICAL",
    priority: { level: "CRITICAL", score: 96 },
    status: "IN_PROGRESS",
    is_overdue: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    location: { ward_name: "Ward 12", address: "Near City Central Mall, MG Road", latitude: 20.2940, longitude: 85.8260 },
    department_name: "Drainage & Sewerage",
    department_code: "DRAINAGE",
    user_uid: "CIT-9081",
    timeline: [
      { step: "Reported by Citizen", status: "SUBMITTED", timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), notes: "Critical emergency flagged." },
      { step: "Barricaded & Repair in progress", status: "IN_PROGRESS", timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), notes: "Safety barricade installed." }
    ]
  }
];

const ComplaintStore = {
  broadcastChannel: typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("civicbuzz_complaints_channel") : null,

  init() {
    try {
      const existing = localStorage.getItem("civicbuzz_complaints");
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem("civicbuzz_complaints", JSON.stringify(SEED_COMPLAINTS));
      } else {
        const parsed = JSON.parse(existing);
        const cb82 = parsed.find(c => c.complaint_id === "CB-12482");
        if (cb82 && cb82.status !== "REJECTED") {
          cb82.status = "REJECTED";
          localStorage.setItem("civicbuzz_complaints", JSON.stringify(parsed));
        }
      }
    } catch (_) {
      // Storage fallback
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (evt) => {
        if (evt.data?.type === "COMPLAINTS_CHANGED") {
          window.dispatchEvent(new CustomEvent("civicbuzz_data_updated", { detail: evt.data }));
        }
      };
    }
  },

  getAll() {
    try {
      const data = localStorage.getItem("civicbuzz_complaints");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [...SEED_COMPLAINTS];
  },

  saveAll(list) {
    try {
      localStorage.setItem("civicbuzz_complaints", JSON.stringify(list));
      localStorage.setItem("civicbuzz_complaints_tick", String(Date.now()));
    } catch (_) {}

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: "COMPLAINTS_CHANGED", timestamp: Date.now() });
      } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent("civicbuzz_data_updated", { detail: { timestamp: Date.now() } }));
  },

  add(complaintData) {
    const list = this.getAll();
    const id = complaintData.complaint_id || `CB-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const categoryNames = {
      roads_potholes: "Roads & Potholes Department",
      road: "Roads & Potholes Department",
      streetlights: "Street Lights Department",
      electricity: "Street Lights Department",
      water_supply: "Water Supply & Sewerage",
      water: "Water Supply & Sewerage",
      garbage_sanitation: "Garbage & Sanitation Department",
      garbage: "Garbage & Sanitation Department",
      drainage: "Drainage & Sewerage",
    };

    const cleanCategory = (complaintData.category || "roads_potholes").toLowerCase().replace(/[^a-z_]/g, "");
    const deptName = categoryNames[cleanCategory] || "Municipal Administration";

    const newDoc = {
      complaint_id: id,
      title: complaintData.title || (complaintData.description ? complaintData.description.slice(0, 50) + (complaintData.description.length > 50 ? "…" : "") : "Citizen Reported Grievance"),
      description: complaintData.description || "",
      category: cleanCategory,
      sub_category: complaintData.sub_category || "general",
      severity: complaintData.severity || "HIGH",
      priority_level: complaintData.priority_level || "HIGH",
      priority: { level: complaintData.priority_level || "HIGH", score: 85 },
      status: complaintData.status || "SUBMITTED",
      is_overdue: false,
      image_url: complaintData.image_url || complaintData.media_url || null,
      created_at: complaintData.created_at || now,
      location: {
        ward_name: complaintData.ward || "Ward 12",
        address: complaintData.address || "Janpath Road, Bhubaneswar",
        latitude: complaintData.latitude || 20.2961,
        longitude: complaintData.longitude || 85.8245
      },
      department_name: deptName,
      department_code: cleanCategory.toUpperCase(),
      user_uid: complaintData.user_uid || "CIT-1001",
      timeline: [
        {
          step: "Reported by Citizen",
          status: "SUBMITTED",
          timestamp: now,
          notes: "Issue reported via citizen portal and automatically routed to AI triage."
        }
      ]
    };

    list.unshift(newDoc);
    this.saveAll(list);
    return newDoc;
  },

  updateStatus(complaintId, newStatus, notes = "") {
    const list = this.getAll();
    const item = list.find((c) => c.complaint_id === complaintId || c.complaint_id === `#${complaintId}` || c.complaint_id?.replace("#", "") === complaintId?.replace("#", ""));
    if (!item) return null;

    item.status = newStatus.toUpperCase();
    const now = new Date().toISOString();
    if (newStatus.toUpperCase() === "RESOLVED" || newStatus.toUpperCase() === "VERIFIED") {
      item.resolved_at = now;
      item.is_overdue = false;
    }

    if (!item.timeline) item.timeline = [];
    item.timeline.push({
      step: `Status changed to ${item.status}`,
      status: item.status,
      timestamp: now,
      notes: notes || `Updated by Administrator.`
    });

    this.saveAll(list);
    return item;
  },

  getMetrics() {
    const list = this.getAll();
    const totalReported = list.length;
    const totalResolved = list.filter((c) => {
      const st = (c.status || "").toUpperCase();
      return st === "RESOLVED" || st === "VERIFIED" || st === "CLOSED";
    }).length;

    const totalRejected = list.filter((c) => {
      const st = (c.status || "").toUpperCase();
      return st === "REJECTED" || st === "REJECT";
    }).length;

    const totalOpen = list.filter((c) => {
      const st = (c.status || "").toUpperCase();
      return ["SUBMITTED", "PENDING", "ASSIGNED", "IN_PROGRESS", "PROGRESS", "READY_FOR_CITIZEN_VERIFICATION"].includes(st);
    }).length;

    const totalOverdue = list.filter((c) => {
      const st = (c.status || "").toUpperCase();
      const pr = ((c.priority_level || c.priority?.level || "").toUpperCase());
      return c.is_overdue === true || (["CRITICAL", "HIGH"].includes(pr) && !["RESOLVED", "VERIFIED", "CLOSED", "REJECTED"].includes(st));
    }).length;

    const resolutionRate = totalReported > 0 ? Number(((totalResolved / totalReported) * 100).toFixed(1)) : 0.0;

    return {
      total_reported: totalReported,
      total_resolved: totalResolved,
      total_rejected: totalRejected,
      total_open: totalOpen,
      total_overdue: totalOverdue,
      resolution_rate_percent: resolutionRate,
    };
  },

  getTrendData(range = "week") {
    const list = this.getAll();
    const now = new Date();

    if (range === "week") {
      // Last 7 days
      const labels = [];
      const reported = [];
      const resolved = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000);
        const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        labels.push(i === 0 ? "Today" : dayStr);

        const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
        const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime();

        const repCount = list.filter((c) => {
          const t = new Date(c.created_at || c.created || Date.now()).getTime();
          return t >= dStart && t <= dEnd;
        }).length;

        const resCount = list.filter((c) => {
          const isRes = (c.status || "").toUpperCase() === "RESOLVED" || (c.status || "").toUpperCase() === "VERIFIED";
          if (!isRes) return false;
          const t = new Date(c.resolved_at || c.updated_at || c.created_at || Date.now()).getTime();
          return t >= dStart && t <= dEnd;
        }).length;

        reported.push(repCount);
        resolved.push(resCount);
      }

      return { labels, reported, resolved };
    }

    if (range === "month") {
      // Last 30 days broken into 6 intervals (5 days each)
      const labels = [];
      const reported = [];
      const resolved = [];

      for (let i = 5; i >= 0; i--) {
        const startDay = new Date(now.getTime() - (i * 5 + 4) * 86400000);
        const endDay = new Date(now.getTime() - i * 5 * 86400000);
        
        const labelStr = `${startDay.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${endDay.getDate()}`;
        labels.push(i === 0 ? "Last 5d" : labelStr);

        const dStart = startDay.getTime();
        const dEnd = endDay.getTime() + 86400000;

        const repCount = list.filter((c) => {
          const t = new Date(c.created_at || Date.now()).getTime();
          return t >= dStart && t <= dEnd;
        }).length;

        const resCount = list.filter((c) => {
          const isRes = (c.status || "").toUpperCase() === "RESOLVED" || (c.status || "").toUpperCase() === "VERIFIED";
          if (!isRes) return false;
          const t = new Date(c.resolved_at || c.created_at || Date.now()).getTime();
          return t >= dStart && t <= dEnd;
        }).length;

        reported.push(repCount);
        resolved.push(resCount);
      }

      return { labels, reported, resolved };
    }

    if (range === "quarter") {
      // Last 6 months
      const labels = [];
      const reported = [];
      const resolved = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
        labels.push(monthLabel);

        const dStart = d.getTime();
        const dEnd = nextMonth.getTime();

        const repCount = list.filter((c) => {
          const t = new Date(c.created_at || Date.now()).getTime();
          return t >= dStart && t < dEnd;
        }).length;

        const resCount = list.filter((c) => {
          const isRes = (c.status || "").toUpperCase() === "RESOLVED" || (c.status || "").toUpperCase() === "VERIFIED";
          if (!isRes) return false;
          const t = new Date(c.resolved_at || c.created_at || Date.now()).getTime();
          return t >= dStart && t < dEnd;
        }).length;

        reported.push(repCount);
        resolved.push(resCount);
      }

      return { labels, reported, resolved };
    }

    return { labels: [], reported: [], resolved: [] };
  }
=======
  TIMEOUT_MS: 3000,
};

// --------------------------------------------------------------------------
// Local Offline Simulation Storage & Engine
// --------------------------------------------------------------------------
const CivicBuzzSimulation = {
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("civicbuzz_registered_users") || "[]");
    } catch (_) {
      return [];
    }
  },
  saveUser(user) {
    const users = this.getUsers().filter((u) => u.email !== user.email);
    users.push(user);
    localStorage.setItem("civicbuzz_registered_users", JSON.stringify(users));
  },
  deriveNameFromEmail(email, fallback = "Civic User") {
    if (!email || !email.includes("@")) return fallback;
    const namePart = email.split("@")[0];
    return namePart
      .replace(/[._-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ") || fallback;
  },
  handle(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    let body = {};
    if (options.body) {
      try {
        body = typeof options.body === "string" ? JSON.parse(options.body) : options.body;
      } catch (_) {}
    }

    console.info(`[CivicBuzz Simulation] Offline fallback handling ${method} ${endpoint}`);

    // 1. Auth Registration
    if (endpoint === "/auth/register" && method === "POST") {
      const email = body.email || "user@civicbuzz.in";
      const full_name = body.full_name || this.deriveNameFromEmail(email);
      const role = (body.role || "CITIZEN").toUpperCase();
      const user_uid = (role === "ADMIN" ? "ADMIN-" : "CIT-") + Math.floor(1000 + Math.random() * 9000);
      const newUser = {
        email,
        full_name,
        role,
        user_uid,
        password: body.password || "Password@123",
      };
      this.saveUser(newUser);

      return {
        success: true,
        message: "User registered successfully",
        data: {
          access_token: "sim-token-" + Date.now(),
          token_type: "bearer",
          user_uid,
          email,
          full_name,
          role,
        },
      };
    }

    // 2. Auth Login
    if (endpoint === "/auth/login" && method === "POST") {
      const email = body.email || "";
      const requestedRole = (body.role || "citizen").toUpperCase();
      const existing = this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());

      const full_name = existing ? existing.full_name : this.deriveNameFromEmail(email, requestedRole === "ADMIN" ? "Administrator" : "Citizen User");
      const role = existing ? existing.role : requestedRole;
      const user_uid = existing ? existing.user_uid : (role === "ADMIN" ? "ADMIN-001" : "CIT-1001");

      return {
        success: true,
        message: "Login successful",
        data: {
          access_token: "sim-token-" + Date.now(),
          token_type: "bearer",
          user_uid,
          email: email || (role === "ADMIN" ? "admin@civicbuzz.in" : "citizen@civicbuzz.in"),
          full_name,
          role,
        },
      };
    }

    // 3. OTP & Password Reset
    if (endpoint === "/auth/send-otp") {
      return {
        success: true,
        message: "OTP sent successfully (Simulated OTP: 123456)",
        data: { otp: "123456", demo_otp: "123456" },
      };
    }
    if (endpoint === "/auth/verify-otp") {
      return {
        success: true,
        message: "OTP verified successfully",
        data: { verified: true },
      };
    }
    if (endpoint === "/auth/forgot-password") {
      return {
        success: true,
        message: "Password reset OTP sent (Simulated OTP: 123456)",
        data: { demo_otp: "123456" },
      };
    }
    if (endpoint === "/auth/reset-password") {
      return {
        success: true,
        message: "Password updated successfully",
        data: { updated: true },
      };
    }
    if (endpoint === "/auth/me") {
      const user = CivicBuzzAPI.getUser() || {
        full_name: "Aditya Kumar Shyam",
        email: "citizen@civicbuzz.in",
        role: "Citizen",
        user_uid: "CIT-1001",
      };
      return { success: true, data: user };
    }

    // 4. Complaints & Nearby Search
    if (endpoint.startsWith("/complaints/nearby/search") || endpoint.startsWith("/complaints/nearby")) {
      const bhubaneswarSampleComplaints = [
        {
          complaint_id: "CB-BHUB-1042",
          title: "Deep crater-sized pothole near KIIT Square",
          description: "Multiple severe potholes causing severe vehicle damage and traffic congestion during evening hours near KIIT Campus 6 road.",
          category: "ROADS",
          sub_category: "POTHOLE",
          status: "IN_PROGRESS",
          priority: "CRITICAL",
          priority_score: 94,
          ward_id: 1,
          ward_name: "Ward 1 (Patia & KIIT)",
          responsible_department: "BMC Works & Road Division",
          approximate_location: "KIIT Square, Patia, Bhubaneswar",
          location: { latitude: 20.3533, longitude: 85.8189 },
          distance_meters: 180,
          created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
          upvotes: 42,
          is_anonymous: false,
          complainant_name: "Subham Mohapatra",
          image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1043",
          title: "High-voltage street light pole sparking & unlit",
          description: "Main junction high-mast light bulb damaged and sparking intermittently during rain, plunging intersection into pitch dark.",
          category: "LIGHTING",
          sub_category: "SPARKING_LIGHT",
          status: "REPORTED",
          priority: "HIGH",
          priority_score: 82,
          ward_id: 2,
          ward_name: "Ward 2 (Chandrasekharpur)",
          responsible_department: "TPCODL & Electrical Maintenance",
          approximate_location: "Near Damana Square, Chandrasekharpur",
          location: { latitude: 20.3242, longitude: 85.8152 },
          distance_meters: 420,
          created_at: new Date(Date.now() - 3600000 * 32).toISOString(),
          upvotes: 27,
          is_anonymous: true,
          complainant_name: "Anonymous Citizen",
          image_url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1044",
          title: "Overflowing municipal garbage vat causing odor",
          description: "Garbage container near daily market has not been emptied for 4 days. Stray cattle and dogs scattering bio-waste on pedestrian pathway.",
          category: "SANITATION",
          sub_category: "GARBAGE_DUMP",
          status: "IN_PROGRESS",
          priority: "HIGH",
          priority_score: 79,
          ward_id: 3,
          ward_name: "Ward 3 (Jayadev Vihar)",
          responsible_department: "BMC Sanitation & Waste Mgmt",
          approximate_location: "Jayadev Vihar Daily Market Lane",
          location: { latitude: 20.3015, longitude: 85.8195 },
          distance_meters: 650,
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          upvotes: 35,
          is_anonymous: false,
          complainant_name: "Priyanjali Das",
          image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1045",
          title: "Main drinking water pipeline burst & road submergence",
          description: "Pressurized clean water pipeline cracked, flooding road and reducing water pressure across Saheed Nagar residential blocks.",
          category: "WATER",
          sub_category: "PIPE_LEAK",
          status: "REPORTED",
          priority: "CRITICAL",
          priority_score: 96,
          ward_id: 5,
          ward_name: "Ward 5 (Saheed Nagar)",
          responsible_department: "WATCO Odisha Water Works",
          approximate_location: "Behind Rama Devi Women's University, Saheed Nagar",
          location: { latitude: 20.2905, longitude: 85.8450 },
          distance_meters: 890,
          created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
          upvotes: 68,
          is_anonymous: false,
          complainant_name: "Aditya Kumar Shyam",
          image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1046",
          title: "Fallen banyan tree branch blocking Nayapalli main road",
          description: "Heavy winds brought down large tree branch over Nayapalli service corridor, entangling cable wires and blocking ambulance lane.",
          category: "PARKS",
          sub_category: "FALLEN_TREE",
          status: "IN_PROGRESS",
          priority: "HIGH",
          priority_score: 75,
          ward_id: 4,
          ward_name: "Ward 4 (Nayapalli & CRPF)",
          responsible_department: "BMC Forest & Horticulture Wing",
          approximate_location: "CRPF Square to Nayapalli Overbridge",
          location: { latitude: 20.2934, longitude: 85.8080 },
          distance_meters: 950,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          upvotes: 19,
          is_anonymous: true,
          complainant_name: "Anonymous Citizen",
          image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1047",
          title: "Illegal construction debris blocking storm drain",
          description: "Building contractors dumped sandbags and concrete blocks inside the storm drainage channel before monsoon season.",
          category: "INFRASTRUCTURE",
          sub_category: "ENCROACHMENT",
          status: "REPORTED",
          priority: "MEDIUM",
          priority_score: 62,
          ward_id: 7,
          ward_name: "Ward 7 (Khandagiri)",
          responsible_department: "BDA & Enforcement Squad",
          approximate_location: "Jagamara Road, near Khandagiri Caves entrance",
          location: { latitude: 20.2580, longitude: 85.7865 },
          distance_meters: 1400,
          created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
          upvotes: 14,
          is_anonymous: false,
          complainant_name: "Rakesh Nayak",
          image_url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1048",
          title: "Broken traffic signal light at Master Canteen Square",
          description: "Amber and red lights not functioning, causing chaos and close vehicle collisions during peak morning rush.",
          category: "LIGHTING",
          sub_category: "TRAFFIC_LIGHT",
          status: "RESOLVED",
          priority: "HIGH",
          priority_score: 88,
          ward_id: 6,
          ward_name: "Ward 6 (Master Canteen)",
          responsible_department: "Bhubaneswar Smart City Ltd (BSCL)",
          approximate_location: "Master Canteen Junction, Railway Station Road",
          location: { latitude: 20.2668, longitude: 85.8436 },
          distance_meters: 1100,
          created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
          resolved_at: new Date(Date.now() - 3600000 * 10).toISOString(),
          upvotes: 53,
          is_anonymous: false,
          complainant_name: "Debasish Panda",
          image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1049",
          title: "Sewage overflow near Bindu Sagar periphery",
          description: "Stagnant open drain leakage entering sacred water body corridor, urgent suction tanker and pipeline sealing required.",
          category: "SANITATION",
          sub_category: "SEWAGE_LEAK",
          status: "IN_PROGRESS",
          priority: "CRITICAL",
          priority_score: 91,
          ward_id: 8,
          ward_name: "Ward 8 (Old Town)",
          responsible_department: "BMC Public Health Engineering",
          approximate_location: "Bindu Sagar Road, Old Town",
          location: { latitude: 20.2390, longitude: 85.8340 },
          distance_meters: 1750,
          created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
          upvotes: 77,
          is_anonymous: false,
          complainant_name: "Manas Ranjan Sahu",
          image_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1050",
          title: "Damaged culvert and open slab on Rasulgarh overbridge side",
          description: "Exposed iron rebar on sidewalk pedestrian slab, dangerous for school children and senior citizens.",
          category: "ROADS",
          sub_category: "DAMAGED_SIDEWALK",
          status: "REPORTED",
          priority: "MEDIUM",
          priority_score: 58,
          ward_id: 9,
          ward_name: "Ward 9 (Rasulgarh)",
          responsible_department: "National Highways & BMC Works",
          approximate_location: "Rasulgarh Square Service Lane",
          location: { latitude: 20.2980, longitude: 85.8670 },
          distance_meters: 1600,
          created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
          upvotes: 11,
          is_anonymous: true,
          complainant_name: "Anonymous Citizen",
          image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
        },
        {
          complaint_id: "CB-BHUB-1051",
          title: "Broken water supply valve causing street ponding",
          description: "WATCO sluice valve leaking thousands of liters daily on Infocity road pavement.",
          category: "WATER",
          sub_category: "VALVE_LEAK",
          status: "RESOLVED",
          priority: "MEDIUM",
          priority_score: 65,
          ward_id: 14,
          ward_name: "Ward 14 (Infocity & DLF)",
          responsible_department: "WATCO Water Works",
          approximate_location: "Near DLF Cybercity Gate 1, Infocity",
          location: { latitude: 20.3700, longitude: 85.8120 },
          distance_meters: 1900,
          created_at: new Date(Date.now() - 3600000 * 90).toISOString(),
          resolved_at: new Date(Date.now() - 3600000 * 14).toISOString(),
          upvotes: 31,
          is_anonymous: false,
          complainant_name: "Suryakant Jena",
          image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
        }
      ];

      return {
        success: true,
        message: "Fetched nearby civic complaints for Bhubaneswar",
        data: bhubaneswarSampleComplaints,
      };
    }

    if (endpoint.startsWith("/complaints") && method === "POST") {
      const newId = "CB-BHUB-" + Math.floor(1000 + Math.random() * 9000);
      return {
        success: true,
        message: "Complaint reported successfully",
        data: {
          complaint_id: newId,
          status: "REPORTED",
          priority: "HIGH",
          responsible_department: "BMC Civic Redressal Cell",
          created_at: new Date().toISOString(),
          ...body,
        },
      };
    }

    // 5. Locations & Municipal Wards (Bhubaneswar)
    if (endpoint.startsWith("/locations/wards")) {
      return {
        success: true,
        message: "Bhubaneswar municipal wards loaded",
        data: [
          { id: 1, ward_number: 1, ward_name: "Patia & KIIT Area", zone: "North", center_lat: 20.3553, center_lng: 85.8189, radius_meters: 1200 },
          { id: 2, ward_number: 2, ward_name: "Chandrasekharpur", zone: "North", center_lat: 20.3242, center_lng: 85.8152, radius_meters: 1100 },
          { id: 3, ward_number: 3, ward_name: "Jayadev Vihar & IRC Village", zone: "Central", center_lat: 20.3015, center_lng: 85.8195, radius_meters: 950 },
          { id: 4, ward_number: 4, ward_name: "Nayapalli & CRPF", zone: "Central", center_lat: 20.2934, center_lng: 85.8080, radius_meters: 1000 },
          { id: 5, ward_number: 5, ward_name: "Saheed Nagar & Vani Vihar", zone: "Central", center_lat: 20.2905, center_lng: 85.8450, radius_meters: 900 },
          { id: 6, ward_number: 6, ward_name: "Master Canteen & Station Square", zone: "Central", center_lat: 20.2668, center_lng: 85.8436, radius_meters: 850 },
          { id: 7, ward_number: 7, ward_name: "Khandagiri & Jagamara", zone: "West", center_lat: 20.2580, center_lng: 85.7865, radius_meters: 1300 },
          { id: 8, ward_number: 8, ward_name: "Old Town & Lingaraj Temple Area", zone: "South", center_lat: 20.2390, center_lng: 85.8340, radius_meters: 1200 },
          { id: 9, ward_number: 9, ward_name: "Rasulgarh & Bomikhal", zone: "East", center_lat: 20.2980, center_lng: 85.8670, radius_meters: 1150 },
          { id: 10, ward_number: 10, ward_name: "Mancheswar & Industrial Zone", zone: "East", center_lat: 20.3300, center_lng: 85.8650, radius_meters: 1250 },
          { id: 11, ward_number: 11, ward_name: "Laxmisagar & Badagada", zone: "South-East", center_lat: 20.2620, center_lng: 85.8580, radius_meters: 1000 },
          { id: 12, ward_number: 12, ward_name: "Pokhariput & Aerodrome", zone: "South-West", center_lat: 20.2450, center_lng: 85.8010, radius_meters: 1100 },
          { id: 13, ward_number: 13, ward_name: "Baramunda & ISBT", zone: "West", center_lat: 20.2800, center_lng: 85.7950, radius_meters: 950 },
          { id: 14, ward_number: 14, ward_name: "Infocity & DLF Cybercity", zone: "North", center_lat: 20.3700, center_lng: 85.8120, radius_meters: 1300 },
          { id: 15, ward_number: 15, ward_name: "Unit-9 & Satya Nagar", zone: "Central", center_lat: 20.2780, center_lng: 85.8400, radius_meters: 800 },
        ]
      };
    }

    if (endpoint.startsWith("/locations/resolve")) {
      return {
        success: true,
        data: {
          latitude: 20.2961,
          longitude: 85.8245,
          address: "Bhubaneswar, Odisha, India",
          city: "Bhubaneswar",
          municipality: "Bhubaneswar Municipal Corporation (BMC)",
          ward_id: 3,
          ward_name: "Ward 3 (Jayadev Vihar)",
          responsible_department: "BMC Civic Redressal",
          location_confidence: "high"
        }
      };
    }

    // 6. Voting & Projects
    if (endpoint.includes("/vote")) {
      return {
        success: true,
        message: "Vote recorded successfully",
        data: { voted: true },
      };
    }

    // 7. Contact Form
    if (endpoint === "/contact") {
      return {
        success: true,
        message: "Message received. Our team will get back to you.",
        data: body,
      };
    }

    // 8. Public Stats & Transparency
    if (endpoint === "/public/stats") {
      return {
        success: true,
        data: {
          active_reports: 24,
          total_resolved: 189,
          active_citizens: 4210,
          resolution_rate: "91%",
        },
      };
    }

    if (endpoint === "/public/complaints") {
      return {
        success: true,
        data: [
          {
            complaint_id: "CB-BHUB-1042",
            title: "Deep crater-sized pothole near KIIT Square",
            category: "Road & Pothole",
            status: "IN_PROGRESS",
            responsible_department: "BMC Works & Road Division",
            approximate_location: "KIIT Square, Patia Main Road",
            ward: "Ward 1 (Patia)",
            created_at: new Date().toISOString(),
          },
        ],
      };
    }

    // Default simulation response
    return {
      success: true,
      message: "Operation completed",
      data: body || {},
    };
  },
>>>>>>> 8cb9545994a95111c00e8cd8b915d64252c9f5f2
};

ComplaintStore.init();

// =========================================================================
// 2. SYNCHRONIZED REAL-TIME LOCAL STORE FOR DEPARTMENTS
// =========================================================================

const SEED_DEPARTMENTS = [
  {
    id: "DEPT-001",
    code: "ROADS_AND_POTHOLES",
    name: "Roads & Potholes Infrastructure",
    category_key: "roads_potholes",
    icon: "🛣️",
    head_name: "Er. Rajesh Sharma",
    head_title: "Chief Municipal Engineer",
    email: "roads@civicbuzz.gov.in",
    phone: "+91 674 253 4401",
    ward_coverage: "All 67 Wards (Zone 1 - 4)",
    staff_count: 42,
    sla_hours: 48,
    budget_allocated: "₹48.5 L",
    budget_utilized: "₹32.1 L",
    performance_rating: 94.5,
    status: "ACTIVE",
    description: "Road surface repairs, potholes, asphalt resurfacing, flyover maintenance, and pedestrian pavements."
  },
  {
    id: "DEPT-002",
    code: "STREET_LIGHTS",
    name: "Street Lighting & Electrical",
    category_key: "streetlights",
    icon: "💡",
    head_name: "Er. Priya Nair",
    head_title: "Superintending Electrical Engineer",
    email: "lighting@civicbuzz.gov.in",
    phone: "+91 674 253 4402",
    ward_coverage: "Central & Northern Wards",
    staff_count: 28,
    sla_hours: 24,
    budget_allocated: "₹24.0 L",
    budget_utilized: "₹18.2 L",
    performance_rating: 98.1,
    status: "ACTIVE",
    description: "Broken streetlight poles, LED replacements, dark zone illuminations, timer failures, and high-mast lights."
  },
  {
    id: "DEPT-003",
    code: "GARBAGE_SANITATION",
    name: "Sanitation & Solid Waste Management",
    category_key: "garbage_sanitation",
    icon: "🗑️",
    head_name: "Dr. Amit Verma",
    head_title: "Municipal Health Officer",
    email: "sanitation@civicbuzz.gov.in",
    phone: "+91 674 253 4403",
    ward_coverage: "Citywide (67 Wards)",
    staff_count: 65,
    sla_hours: 24,
    budget_allocated: "₹52.0 L",
    budget_utilized: "₹41.8 L",
    performance_rating: 91.4,
    status: "ACTIVE",
    description: "Daily garbage collection route monitoring, dump clearing, commercial waste, and illegal dumping remediation."
  },
  {
    id: "DEPT-004",
    code: "WATER_SUPPLY",
    name: "Water Supply & Sewerage",
    category_key: "water_supply",
    icon: "🚰",
    head_name: "Er. Sneha Iyer",
    head_title: "Executive Water Works Engineer",
    email: "water@civicbuzz.gov.in",
    phone: "+91 674 253 4404",
    ward_coverage: "South & Eastern Zones",
    staff_count: 34,
    sla_hours: 36,
    budget_allocated: "₹38.0 L",
    budget_utilized: "₹29.5 L",
    performance_rating: 86.2,
    status: "UNDERSTAFFED",
    description: "Main supply pipeline bursts, low pressure, drinking water quality, sewage overflows, and pump house maintenance."
  },
  {
    id: "DEPT-005",
    code: "PARKS_GREENERY",
    name: "Parks & Urban Greenery",
    category_key: "parks_greenery",
    icon: "🌳",
    head_name: "Shri K. Sengupta",
    head_title: "Horticulture Officer",
    email: "parks@civicbuzz.gov.in",
    phone: "+91 674 253 4405",
    ward_coverage: "Zone 1, 2 & 3 Parks",
    staff_count: 22,
    sla_hours: 72,
    budget_allocated: "₹18.5 L",
    budget_utilized: "₹12.0 L",
    performance_rating: 96.0,
    status: "ACTIVE",
    description: "Park upkeep, community playground repairs, fallen tree removal after storms, and roadside tree pruning."
  },
  {
    id: "DEPT-006",
    code: "DRAINAGE",
    name: "Stormwater Drainage & Flood Control",
    category_key: "drainage",
    icon: "🌊",
    head_name: "Er. Manoj Mohanty",
    head_title: "Chief Drainage Engineer",
    email: "drainage@civicbuzz.gov.in",
    phone: "+91 674 253 4406",
    ward_coverage: "Low-lying Wards & Canals",
    staff_count: 30,
    sla_hours: 18,
    budget_allocated: "₹29.0 L",
    budget_utilized: "₹21.4 L",
    performance_rating: 93.8,
    status: "ACTIVE",
    description: "Stormwater drain desilting, culvert clearing, monsoon waterlogging response, and canal embankment maintenance."
  }
];

const DepartmentStore = {
  STORAGE_KEY: "civicbuzz_departments",
  channel: typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("civicbuzz_departments_channel") : null,

  init() {
    const existing = this.getAll();
    if (!existing || existing.length === 0) {
      this.saveAll(SEED_DEPARTMENTS);
    }
    if (this.channel) {
      this.channel.onmessage = (e) => {
        if (e.data && e.data.type === "DEPARTMENTS_UPDATED") {
          window.dispatchEvent(new CustomEvent("civicbuzz:departments_changed", { detail: e.data.departments }));
        }
      };
    }
  },

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (_) {}
    return SEED_DEPARTMENTS;
  },

  saveAll(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      if (this.channel) {
        this.channel.postMessage({ type: "DEPARTMENTS_UPDATED", departments: list });
      }
      window.dispatchEvent(new CustomEvent("civicbuzz:departments_changed", { detail: list }));
    } catch (_) {}
  },

  getById(id) {
    const list = this.getAll();
    return list.find((d) => d.id === id || d.code === id) || null;
  },

  add(deptData) {
    const list = this.getAll();
    const nextIdx = list.length + 1;
    const cleanCode = (deptData.code || deptData.name.toUpperCase().replace(/[^A-Z0-9]/g, "_")).slice(0, 30);
    const newDept = {
      id: deptData.id || `DEPT-${String(nextIdx).padStart(3, "0")}`,
      code: cleanCode,
      name: deptData.name || "Municipal Department",
      category_key: deptData.category_key || cleanCode.toLowerCase(),
      icon: deptData.icon || "🏛️",
      head_name: deptData.head_name || deptData.head || "Department Officer",
      head_title: deptData.head_title || "Officer in Charge",
      email: deptData.email || `${cleanCode.toLowerCase()}@civicbuzz.gov.in`,
      phone: deptData.phone || "+91 674 253 4400",
      ward_coverage: deptData.ward_coverage || "All Wards",
      staff_count: Number(deptData.staff_count) || 20,
      sla_hours: Number(deptData.sla_hours) || 24,
      budget_allocated: deptData.budget_allocated || "₹25.0 L",
      budget_utilized: deptData.budget_utilized || "₹0.0 L",
      performance_rating: Number(deptData.performance_rating) || 95.0,
      status: (deptData.status || "ACTIVE").toUpperCase(),
      description: deptData.description || deptData.desc || "Government department handling municipal affairs.",
      created_at: new Date().toISOString()
    };
    list.push(newDept);
    this.saveAll(list);
    return newDept;
  },

  update(id, updates) {
    const list = this.getAll();
    const idx = list.findIndex((d) => d.id === id || d.code === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    this.saveAll(list);
    return list[idx];
  },

  delete(id) {
    let list = this.getAll();
    list = list.filter((d) => d.id !== id && d.code !== id);
    this.saveAll(list);
    return true;
  },

  getMetrics() {
    const list = this.getAll();
    const complaints = typeof ComplaintStore !== "undefined" ? ComplaintStore.getAll() : [];
    const totalDepts = list.length;
    const activeDepts = list.filter((d) => d.status === "ACTIVE").length;
    const totalStaff = list.reduce((acc, d) => acc + (Number(d.staff_count) || 0), 0);
    
    const openAssigned = complaints.filter((c) => {
      const st = (c.status || "").toUpperCase();
      return ["SUBMITTED", "PENDING", "ASSIGNED", "IN_PROGRESS", "PROGRESS"].includes(st);
    }).length;

    return {
      total_departments: totalDepts,
      active_departments: activeDepts,
      total_staff: totalStaff,
      open_issues_assigned: openAssigned,
      avg_resolution_days: 2.8
    };
  }
};

DepartmentStore.init();

if (typeof window !== "undefined") {
  window.DepartmentStore = DepartmentStore;
}

// =========================================================================
// 3. SYNCHRONIZED REAL-TIME LOCAL STORE FOR TENDERS & PARTICIPATORY BUDGETING
// =========================================================================

const SEED_TENDERS = [
  {
    tender_id: "CB-T-0015",
    title: "Priority Road Patching & Resurfacing",
    description: "Repair the most-reported pothole locations, asphalt resurfacing, and pedestrian pavement reinstatement across Ward 15.",
    category: "roads_potholes",
    ward_id: 15,
    location: "Ward 15, Saheed Nagar & Janpath Corridor",
    department_code: "ROADS_AND_POTHOLES",
    contractor_name: "L&T Infrastructure Projects Ltd.",
    contractor_contact: "+91 674 254 9901",
    estimated_budget: 2500000,
    utilized_budget: 1450000,
    status: "PUBLISHED",
    progress_percentage: 58,
    lifecycle_stage: "CONTRACTOR_AWARDED",
    verified_locations_count: 8,
    linked_complaint_ids: ["CB-12480", "CB-12483"],
    submission_deadline: "2026-08-24",
    target_completion_date: "2026-10-15",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tender_id: "CB-T-0018",
    title: "Stormwater Drainage Network Upgrade",
    description: "Resolve recurring drainage overflow and install covered culverts near primary school corridor.",
    category: "drainage",
    ward_id: 12,
    location: "Ward 12, School Road & Central Avenue",
    department_code: "DRAINAGE",
    contractor_name: "Apex Civil Constr. Co.",
    contractor_contact: "+91 674 254 9902",
    estimated_budget: 4000000,
    utilized_budget: 800000,
    status: "DRAFT",
    progress_percentage: 20,
    lifecycle_stage: "DRAFT_CREATED",
    verified_locations_count: 12,
    linked_complaint_ids: ["CB-12484", "CB-12485"],
    submission_deadline: "2026-09-10",
    target_completion_date: "2026-11-30",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tender_id: "CB-T-0012",
    title: "Smart LED Streetlight Grid Installation",
    description: "Install 40 energy-efficient smart LED streetlights with automated timers along market corridors and dark zones.",
    category: "streetlights",
    ward_id: 8,
    location: "Ward 8, Commercial Market Area",
    department_code: "STREET_LIGHTS",
    contractor_name: "BrightGrid Solutions Ltd.",
    contractor_contact: "+91 674 254 9903",
    estimated_budget: 3000000,
    utilized_budget: 2160000,
    status: "IN_PROGRESS",
    progress_percentage: 72,
    lifecycle_stage: "WORK_IN_PROGRESS",
    verified_locations_count: 5,
    linked_complaint_ids: ["CB-12481"],
    submission_deadline: "2026-08-15",
    target_completion_date: "2026-09-20",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tender_id: "CB-T-0009",
    title: "Central Market Sanitation & Waste Hub Upgrade",
    description: "Modern waste compaction unit, automated bin clearing, and underground drainage for market hygiene.",
    category: "garbage_sanitation",
    ward_id: 9,
    location: "Ward 9, Daily Vegetable & Fish Market",
    department_code: "GARBAGE_SANITATION",
    contractor_name: "CleanCity Environmental Infra",
    contractor_contact: "+91 674 254 9904",
    estimated_budget: 1720000,
    utilized_budget: 1720000,
    status: "COMPLETED",
    progress_percentage: 100,
    lifecycle_stage: "QR_TRAIL",
    verified_locations_count: 7,
    linked_complaint_ids: ["CB-12482"],
    submission_deadline: "2026-07-20",
    target_completion_date: "2026-08-18",
    created_at: new Date(Date.now() - 35 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tender_id: "CB-T-0021",
    title: "Drinking Water Pipeline Overhaul & Booster Station",
    description: "Replace corroded ductile iron main pipes and install automated water pressure monitoring system.",
    category: "water_supply",
    ward_id: 4,
    location: "Ward 4, Rasulgarh & Industrial Estate",
    department_code: "WATER_SUPPLY",
    contractor_name: "HydroTech Projects India",
    contractor_contact: "+91 674 254 9905",
    estimated_budget: 5500000,
    utilized_budget: 1925000,
    status: "PUBLISHED",
    progress_percentage: 35,
    lifecycle_stage: "PUBLISHED",
    verified_locations_count: 14,
    linked_complaint_ids: [],
    submission_deadline: "2026-09-05",
    target_completion_date: "2026-12-15",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    tender_id: "CB-T-0024",
    title: "Public Park Greenery & Children Play Area",
    description: "Lawn revitalisation, playground equipment installation, solar boundary lights, and walking pathway repair.",
    category: "parks_greenery",
    ward_id: 18,
    location: "Ward 18, BDA Community Park",
    department_code: "PARKS_GREENERY",
    contractor_name: "GreenHorizon Landscapes",
    contractor_contact: "+91 674 254 9906",
    estimated_budget: 1250000,
    utilized_budget: 750000,
    status: "IN_PROGRESS",
    progress_percentage: 60,
    lifecycle_stage: "WORK_IN_PROGRESS",
    verified_locations_count: 6,
    linked_complaint_ids: [],
    submission_deadline: "2026-08-30",
    target_completion_date: "2026-10-10",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const TenderStore = {
  STORAGE_KEY: "civicbuzz_tenders",
  channel: typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("civicbuzz_tenders_channel") : null,

  init() {
    try {
      const existing = localStorage.getItem(this.STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(SEED_TENDERS));
      }
    } catch (_) {}

    if (this.channel) {
      this.channel.onmessage = (evt) => {
        if (evt.data?.type === "TENDERS_UPDATED") {
          window.dispatchEvent(new CustomEvent("civicbuzz:tenders_changed", { detail: evt.data.tenders }));
        }
      };
    }
  },

  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (_) {}
    return SEED_TENDERS;
  },

  saveAll(list) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      if (this.channel) {
        this.channel.postMessage({ type: "TENDERS_UPDATED", tenders: list });
      }
      window.dispatchEvent(new CustomEvent("civicbuzz:tenders_changed", { detail: list }));
    } catch (_) {}
  },

  getById(id) {
    const list = this.getAll();
    return list.find((t) => t.tender_id === id || t.tender_id === `#${id}` || t.tender_id?.replace("#", "") === id?.replace("#", "")) || null;
  },

  add(data) {
    const list = this.getAll();
    const nextNum = Math.floor(30 + Math.random() * 70);
    const newId = data.tender_id || `CB-T-00${nextNum}`;
    const budgetNum = Number(data.estimated_budget) || 250000;
    
    const newTender = {
      tender_id: newId,
      title: data.title || "Municipal Infrastructure Project",
      description: data.description || "Civic works project generated from verified citizen grievance clusters.",
      category: data.category || "roads_potholes",
      ward_id: Number(data.ward_id) || 15,
      location: data.location || `Ward ${data.ward_id || 15}`,
      department_code: data.department_code || "ROADS_AND_POTHOLES",
      contractor_name: data.contractor_name || "TBD (Under Bidding)",
      contractor_contact: data.contractor_contact || "+91 674 250 0000",
      estimated_budget: budgetNum,
      utilized_budget: Number(data.utilized_budget) || 0,
      status: (data.status || "PUBLISHED").toUpperCase(),
      progress_percentage: Number(data.progress_percentage) || 15,
      lifecycle_stage: (data.lifecycle_stage || "PUBLISHED").toUpperCase(),
      verified_locations_count: Number(data.verified_locations_count) || Math.floor(4 + Math.random() * 8),
      linked_complaint_ids: data.linked_complaint_ids || [],
      submission_deadline: data.submission_deadline || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      target_completion_date: data.target_completion_date || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    list.unshift(newTender);
    this.saveAll(list);
    return newTender;
  },

  update(id, updates) {
    const list = this.getAll();
    const idx = list.findIndex((t) => t.tender_id === id || t.tender_id === `#${id}`);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    this.saveAll(list);
    return list[idx];
  },

  updateLifecycle(id, stage, status = null, progressPct = null) {
    const list = this.getAll();
    const item = list.find((t) => t.tender_id === id || t.tender_id === `#${id}`);
    if (!item) return null;

    item.lifecycle_stage = stage.toUpperCase();
    if (status) item.status = status.toUpperCase();
    if (progressPct !== null) item.progress_percentage = Number(progressPct);
    item.updated_at = new Date().toISOString();

    this.saveAll(list);
    return item;
  },

  delete(id) {
    let list = this.getAll();
    list = list.filter((t) => t.tender_id !== id && t.tender_id !== `#${id}`);
    this.saveAll(list);
    return true;
  },

  getMetrics() {
    const list = this.getAll();
    const openTenders = list.filter((t) => (t.status || "").toUpperCase() === "PUBLISHED").length;
    const draftTenders = list.filter((t) => (t.status || "").toUpperCase() === "DRAFT").length;
    const inProgress = list.filter((t) => (t.status || "").toUpperCase() === "IN_PROGRESS").length;
    const completed = list.filter((t) => (t.status || "").toUpperCase() === "COMPLETED").length;

    const totalAllocated = list.reduce((acc, t) => acc + (Number(t.estimated_budget) || 0), 0);
    const totalSpent = list.reduce((acc, t) => acc + (Number(t.utilized_budget) || 0), 0);

    return {
      open_tenders: openTenders,
      draft_tenders: draftTenders,
      in_progress_tenders: inProgress,
      completed_tenders: completed,
      total_allocated_budget: totalAllocated,
      total_spent_budget: totalSpent,
      total_tenders: list.length
    };
  }
};

TenderStore.init();

if (typeof window !== "undefined") {
  window.TenderStore = TenderStore;
}

// =========================================================================
// UNIVERSAL API CLIENT
// =========================================================================

const CivicBuzzAPI = {
  // Direct access to synchronized local stores
  store: ComplaintStore,
  deptStore: DepartmentStore,
  tenderStore: TenderStore,

  // Token & Session Management
  getToken: () => localStorage.getItem("civicbuzz_token"),
  setToken: (token) => localStorage.setItem("civicbuzz_token", token),
  removeToken: () => {
    localStorage.removeItem("civicbuzz_token");
    localStorage.removeItem("civicbuzz_user");
  },
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
    } catch (_) {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem("civicbuzz_user", JSON.stringify(user)),

<<<<<<< HEAD
  // Generic Request Helper with quick timeout & fallback
=======
  // Generic Request Helper with Auto-Fallback
>>>>>>> 8cb9545994a95111c00e8cd8b915d64252c9f5f2
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

<<<<<<< HEAD
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
=======
    // Set timeout to avoid hanging if backend server is unreachable
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS) : null;
>>>>>>> 8cb9545994a95111c00e8cd8b915d64252c9f5f2

    try {
      const response = await fetch(url, {
        ...options,
        headers,
<<<<<<< HEAD
        signal: controller.signal,
=======
        signal: controller ? controller.signal : undefined,
>>>>>>> 8cb9545994a95111c00e8cd8b915d64252c9f5f2
      });
      clearTimeout(timeoutId);

      if (timeoutId) clearTimeout(timeoutId);

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || json.detail?.message || "Request failed");
      }
      return json;
    } catch (err) {
<<<<<<< HEAD
      clearTimeout(timeoutId);
=======
      if (timeoutId) clearTimeout(timeoutId);

      const msg = (err.message || "").toLowerCase();
      const isNetworkError =
        err.name === "AbortError" ||
        err.name === "TypeError" ||
        msg.includes("fetch") ||
        msg.includes("network") ||
        msg.includes("connection") ||
        msg.includes("timeout") ||
        msg.includes("load failed") ||
        err.code === "ECONNREFUSED" ||
        Boolean(err.cause);

      if (isNetworkError) {
        // Gracefully use local offline simulation
        return CivicBuzzSimulation.handle(endpoint, options);
      }

      console.warn(`CivicBuzz API call to ${endpoint} note:`, err.message);
>>>>>>> 8cb9545994a95111c00e8cd8b915d64252c9f5f2
      throw err;
    }
  },

  // 1. Auth Module
  auth: {
    async register(data) {
      const res = await CivicBuzzAPI.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.data?.access_token) {
        CivicBuzzAPI.setToken(res.data.access_token);
        CivicBuzzAPI.setUser(res.data);
      }
      return res;
    },
    async login(email, password, role = "citizen") {
      const res = await CivicBuzzAPI.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      if (res.data?.access_token) {
        CivicBuzzAPI.setToken(res.data.access_token);
        CivicBuzzAPI.setUser(res.data);
      }
      return res;
    },
    async sendOtp(target, purpose = "LOGIN") {
      return CivicBuzzAPI.request("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ target, purpose }),
      });
    },
    async verifyOtp(target, otp_code, purpose = "LOGIN") {
      return CivicBuzzAPI.request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ target, otp_code, purpose }),
      });
    },
    async forgotPassword(email) {
      return CivicBuzzAPI.request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword(email, otp_code, new_password) {
      return CivicBuzzAPI.request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp_code, new_password }),
      });
    },
    async getMe() {
      return CivicBuzzAPI.request("/auth/me");
    },
    async logout() {
      CivicBuzzAPI.removeToken();
    },
  },

  // 2. Complaints Module (Guaranteed local sync + backend persistence)
  complaints: {
    async create(data) {
      // 1. Save to local store immediately for instant cross-tab UI update
      const localDoc = ComplaintStore.add(data);

      // 2. Persist to backend if online
      try {
        const res = await CivicBuzzAPI.request("/complaints", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (res.data) {
          return res;
        }
      } catch (err) {
        // Backend offline or unreachable, local store handles it
      }

      return { data: localDoc, message: "Complaint created successfully." };
    },
    async getMyComplaints() {
      try {
        const res = await CivicBuzzAPI.request("/complaints/my/list");
        if (res.data) return res;
      } catch (_) {}
      return { data: ComplaintStore.getAll() };
    },
    async getNearby(lat, lng, radiusMeters = 1000) {
      try {
        const res = await CivicBuzzAPI.request(`/complaints/nearby/search?lat=${lat}&lng=${lng}&radius_meters=${radiusMeters}`);
        if (res.data) return res;
      } catch (_) {}
      return { data: ComplaintStore.getAll() };
    },
    async getDetail(id) {
      try {
        const res = await CivicBuzzAPI.request(`/complaints/${id}`);
        if (res.data) return res;
      } catch (_) {}
      const doc = ComplaintStore.getAll().find((c) => c.complaint_id === id || c.complaint_id === `#${id}`);
      return { data: doc };
    },
    async verifyResolution(id, rating = 5, comments = "") {
      ComplaintStore.updateStatus(id, "RESOLVED", `Citizen verified resolution (Rating: ${rating}/5). Comments: ${comments}`);
      try {
        await CivicBuzzAPI.request(`/complaints/${id}/verify-resolution?rating=${rating}&comments=${encodeURIComponent(comments)}`, {
          method: "POST",
        });
      } catch (_) {}
      return { message: "Resolution verified." };
    },
    async rejectResolution(id, reason = "") {
      ComplaintStore.updateStatus(id, "IN_PROGRESS", `Citizen disputed resolution: ${reason}`);
      try {
        await CivicBuzzAPI.request(`/complaints/${id}/reject-resolution?reason=${encodeURIComponent(reason)}`, {
          method: "POST",
        });
      } catch (_) {}
      return { message: "Resolution disputed and reopened." };
    },
  },

  // 3. Locations Module
  locations: {
    async resolve(lat, lng) {
      return CivicBuzzAPI.request(`/locations/resolve?lat=${lat}&lng=${lng}`);
    },
    async getWards() {
      return CivicBuzzAPI.request("/locations/wards");
    },
  },

  // 4. Tenders Module
  tenders: {
    async list(category = "all") {
      try {
        const res = await CivicBuzzAPI.request(`/tenders?category=${encodeURIComponent(category)}`);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          return res;
        }
      } catch (_) {}
      const all = TenderStore.getAll();
      if (!category || category === "all") return { data: all };
      return { data: all.filter(t => t.category === category || t.status === category.toUpperCase()) };
    },
    async getDetail(id) {
      try {
        const res = await CivicBuzzAPI.request(`/tenders/${id}`);
        if (res && res.data) return res;
      } catch (_) {}
      return { data: TenderStore.getById(id) };
    },
  },

  // 5. Participatory Budgeting & Voting
  projects: {
    async list(wardId = null) {
      const q = wardId ? `?ward_id=${wardId}` : "";
      try {
        return await CivicBuzzAPI.request(`/projects${q}`);
      } catch (_) {
        return { data: [] };
      }
    },
    async vote(projectId) {
      return CivicBuzzAPI.request(`/projects/${projectId}/vote`, {
        method: "POST",
      });
    },
    async getRankings() {
      return CivicBuzzAPI.request("/projects/rankings");
    },
  },

  // 6. Citizen Assistant Chatbot
  chat: {
    async sendMessage(message, language = "en", sessionId = null) {
      return CivicBuzzAPI.request("/chat/message", {
        method: "POST",
        body: JSON.stringify({ message, language, session_id: sessionId }),
      });
    },
  },

  // 7. Contact Us Form
  contact: {
    async submit(data) {
      return CivicBuzzAPI.request("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  // 8. Public Transparency & Live Stats
  public: {
    async getStats() {
      try {
        const res = await CivicBuzzAPI.request("/public/stats");
        if (res && res.data && res.data.total_reported !== undefined) {
          return res;
        }
      } catch (_) {}
      return { data: ComplaintStore.getMetrics() };
    },
    async listComplaints() {
      try {
        const res = await CivicBuzzAPI.request("/public/complaints");
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          return res;
        }
      } catch (_) {}
      return { data: ComplaintStore.getAll() };
    },
    async listClusters() {
      try {
        return await CivicBuzzAPI.request("/public/clusters");
      } catch (_) {
        return { data: [] };
      }
    },
  },

  // 9. Administrator & Database Operations
  admin: {
    async getDashboardMetrics() {
      try {
        const res = await CivicBuzzAPI.request("/admin/dashboard");
        if (res && res.data && res.data.total_reported !== undefined) {
          return res;
        }
      } catch (_) {}
      return { data: ComplaintStore.getMetrics() };
    },
    async getRoutingQueue() {
      try {
        return await CivicBuzzAPI.request("/admin/queue");
      } catch (_) {
        return { data: ComplaintStore.getAll() };
      }
    },
    async listDepartments() {
      try {
        const res = await CivicBuzzAPI.request("/admin/departments");
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          return res;
        }
      } catch (_) {}
      return { data: DepartmentStore.getAll() };
    },
    async getDepartmentMetrics() {
      try {
        const res = await CivicBuzzAPI.request("/admin/departments/metrics");
        if (res && res.data) return res;
      } catch (_) {}
      return { data: DepartmentStore.getMetrics() };
    },
    async createDepartment(data) {
      const localDoc = DepartmentStore.add(data);
      try {
        const res = await CivicBuzzAPI.request("/admin/departments", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (res && res.data) return res;
      } catch (_) {}
      return { data: localDoc, message: "Department registered successfully." };
    },
    async updateDepartment(deptId, data) {
      const updated = DepartmentStore.update(deptId, data);
      try {
        const res = await CivicBuzzAPI.request(`/admin/departments/${deptId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        if (res && res.data) return res;
      } catch (_) {}
      return { data: updated, message: "Department updated successfully." };
    },
    async deleteDepartment(deptId) {
      DepartmentStore.delete(deptId);
      try {
        await CivicBuzzAPI.request(`/admin/departments/${deptId}`, {
          method: "DELETE",
        });
      } catch (_) {}
      return { message: "Department deleted successfully." };
    },
    async listTenders(filter = "all") {
      return CivicBuzzAPI.tenders.list(filter);
    },
    async getBudgetMetrics() {
      try {
        const res = await CivicBuzzAPI.request("/admin/budget/metrics");
        if (res && res.data) return res;
      } catch (_) {}
      return { data: TenderStore.getMetrics() };
    },
    async createTender(data) {
      const localDoc = TenderStore.add(data);
      try {
        const res = await CivicBuzzAPI.request("/admin/tenders", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (res && res.data) return res;
      } catch (_) {}
      return { data: localDoc, message: "Tender published successfully." };
    },
    async updateTender(tenderId, data) {
      const updated = TenderStore.update(tenderId, data);
      try {
        const res = await CivicBuzzAPI.request(`/admin/tenders/${tenderId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        if (res && res.data) return res;
      } catch (_) {}
      return { data: updated, message: "Tender updated successfully." };
    },
    async deleteTender(tenderId) {
      TenderStore.delete(tenderId);
      try {
        await CivicBuzzAPI.request(`/admin/tenders/${tenderId}`, {
          method: "DELETE",
        });
      } catch (_) {}
      return { message: "Tender deleted successfully." };
    },
    async updateTenderLifecycle(tenderId, lifecycleStage, status = null, progressPct = null) {
      const updated = TenderStore.updateLifecycle(tenderId, lifecycleStage, status, progressPct);
      try {
        const res = await CivicBuzzAPI.request(`/admin/tenders/${tenderId}/lifecycle`, {
          method: "PATCH",
          body: JSON.stringify({ lifecycle_stage: lifecycleStage, status, progress_percentage: progressPct }),
        });
        if (res && res.data) return res;
      } catch (_) {}
      return { data: updated, message: `Tender milestone updated to ${lifecycleStage}.` };
    },
    async reassignComplaint(complaintId, newDepartmentCode, notes = "") {
      ComplaintStore.updateStatus(complaintId, "ASSIGNED", `Reassigned to ${newDepartmentCode}. Notes: ${notes}`);
      try {
        return await CivicBuzzAPI.request(`/admin/complaints/${complaintId}/reassign?new_department_code=${encodeURIComponent(newDepartmentCode)}&notes=${encodeURIComponent(notes)}`, {
          method: "POST",
        });
      } catch (_) {
        return { message: `Complaint reassigned to ${newDepartmentCode}.` };
      }
    },
    async complaintAction(complaintId, action, departmentCode = null, notes = "") {
      let targetStatus = "PENDING";
      if (action === "RESOLVE") targetStatus = "RESOLVED";
      else if (action === "ASSIGN") targetStatus = "ASSIGNED";
      else if (action === "REJECT") targetStatus = "REJECTED";

      ComplaintStore.updateStatus(complaintId, targetStatus, notes || `Admin action: ${action}`);

      try {
        let q = `/admin/complaints/${complaintId}/action?action=${encodeURIComponent(action)}`;
        if (departmentCode) q += `&department_code=${encodeURIComponent(departmentCode)}`;
        if (notes) q += `&notes=${encodeURIComponent(notes)}`;
        return await CivicBuzzAPI.request(q, {
          method: "POST",
        });
      } catch (_) {
        return { message: `Complaint ${action} completed.` };
      }
    },
  },
};

// Make globally accessible across all frontend scripts
if (typeof window !== "undefined") {
  window.CivicBuzzAPI = CivicBuzzAPI;
  window.ComplaintStore = ComplaintStore;
  window.DepartmentStore = DepartmentStore;
  window.TenderStore = TenderStore;
}
