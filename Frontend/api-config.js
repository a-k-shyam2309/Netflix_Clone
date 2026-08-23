/**
 * CivicBuzz Frontend Universal API Integration Client
 * Provides seamless connection between existing HTML/CSS/JS frontend modules and the FastAPI backend.
 * Gracefully falls back to local simulation if backend is offline.
 */

const API_CONFIG = {
  BASE_URL: "http://localhost:8000/api/v1",
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
};

const CivicBuzzAPI = {
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

  // Generic Request Helper with Auto-Fallback
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

    // Set timeout to avoid hanging if backend server is unreachable
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS) : null;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller ? controller.signal : undefined,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || json.detail?.message || "Request failed");
      }
      return json;
    } catch (err) {
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

  // 2. Complaints Module
  complaints: {
    async create(data) {
      return CivicBuzzAPI.request("/complaints", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async getMyComplaints() {
      return CivicBuzzAPI.request("/complaints/my/list");
    },
    async getNearby(lat, lng, radiusMeters = 1000) {
      return CivicBuzzAPI.request(`/complaints/nearby/search?lat=${lat}&lng=${lng}&radius_meters=${radiusMeters}`);
    },
    async getDetail(id) {
      return CivicBuzzAPI.request(`/complaints/${id}`);
    },
    async verifyResolution(id, rating, comments = "") {
      return CivicBuzzAPI.request(`/complaints/${id}/verify-resolution?rating=${rating}&comments=${encodeURIComponent(comments)}`, {
        method: "POST",
      });
    },
    async rejectResolution(id, reason) {
      return CivicBuzzAPI.request(`/complaints/${id}/reject-resolution?reason=${encodeURIComponent(reason)}`, {
        method: "POST",
      });
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
      return CivicBuzzAPI.request(`/tenders?category=${category}`);
    },
    async getDetail(id) {
      return CivicBuzzAPI.request(`/tenders/${id}`);
    },
  },

  // 5. Participatory Budgeting & Voting
  projects: {
    async list(wardId = null) {
      const q = wardId ? `?ward_id=${wardId}` : "";
      return CivicBuzzAPI.request(`/projects${q}`);
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

  // 8. Public Transparency & Stats
  public: {
    async getStats() {
      return CivicBuzzAPI.request("/public/stats");
    },
    async listComplaints() {
      return CivicBuzzAPI.request("/public/complaints");
    },
    async listClusters() {
      return CivicBuzzAPI.request("/public/clusters");
    },
  },

  // 9. Administrator & Database Operations
  admin: {
    async getDashboardMetrics() {
      return CivicBuzzAPI.request("/admin/dashboard");
    },
    async getRoutingQueue() {
      return CivicBuzzAPI.request("/admin/queue");
    },
    async listDepartments() {
      return CivicBuzzAPI.request("/admin/departments");
    },
    async createDepartment(data) {
      return CivicBuzzAPI.request("/admin/departments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async createTender(data) {
      return CivicBuzzAPI.request("/admin/tenders", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async updateTender(tenderId, data) {
      return CivicBuzzAPI.request(`/admin/tenders/${tenderId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    async reassignComplaint(complaintId, newDepartmentCode, notes = "") {
      return CivicBuzzAPI.request(`/admin/complaints/${complaintId}/reassign?new_department_code=${encodeURIComponent(newDepartmentCode)}&notes=${encodeURIComponent(notes)}`, {
        method: "POST",
      });
    },
    async complaintAction(complaintId, action, departmentCode = null, notes = "") {
      let q = `/admin/complaints/${complaintId}/action?action=${encodeURIComponent(action)}`;
      if (departmentCode) q += `&department_code=${encodeURIComponent(departmentCode)}`;
      if (notes) q += `&notes=${encodeURIComponent(notes)}`;
      return CivicBuzzAPI.request(q, {
        method: "POST",
      });
    },
  },
};

// Make globally accessible across all frontend scripts
if (typeof window !== "undefined") {
  window.CivicBuzzAPI = CivicBuzzAPI;
}
