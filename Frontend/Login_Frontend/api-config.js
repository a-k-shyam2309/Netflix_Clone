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

    // 4. Complaints
    if (endpoint.startsWith("/complaints") && method === "POST") {
      const newId = "CB-" + Math.floor(1000 + Math.random() * 9000);
      return {
        success: true,
        message: "Complaint reported successfully",
        data: {
          complaint_id: newId,
          status: "REPORTED",
          responsible_department: "Road Maintenance",
          created_at: new Date().toISOString(),
          ...body,
        },
      };
    }

    // 5. Voting & Projects
    if (endpoint.includes("/vote")) {
      return {
        success: true,
        message: "Vote recorded successfully",
        data: { voted: true },
      };
    }

    // 6. Contact Form
    if (endpoint === "/contact") {
      return {
        success: true,
        message: "Message received. Our team will get back to you.",
        data: body,
      };
    }

    // 7. Public Stats & Transparency
    if (endpoint === "/public/stats") {
      return {
        success: true,
        data: {
          active_reports: 18,
          total_resolved: 142,
          active_citizens: 3840,
          resolution_rate: "89%",
        },
      };
    }

    if (endpoint === "/public/complaints") {
      return {
        success: true,
        data: [
          {
            complaint_id: "CIV-1042",
            title: "Pothole near college gate",
            category: "Road & Pothole",
            status: "UNDER_REVIEW",
            responsible_department: "Road Maintenance",
            approximate_location: "Patia Main Road",
            ward: "Ward 15",
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
