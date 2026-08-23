/**
 * CIVICBUZZ • GEOSPATIAL MAP & HOTSPOTS SCRIPT
 */

// =========================================================
// 1. HINDI & ENGLISH DICTIONARY
// =========================================================
const TRANSLATIONS = {
  // Navigation & General
  "Dashboard": "डैशबोर्ड",
  "Issue Queue": "समस्या सूची",
  "Map & Hotspots": "मानचित्र और हॉटस्पॉट",
  "Departments": "विभाग",
  "Budgeting": "बजट",
  "Analytics": "एनालिटिक्स",
  "GEOSPATIAL INTELLIGENCE": "भू-स्थानिक इंटेलिजेंस और ट्राइएज",
  "Geospatial Incident Map & Hotspots": "भू-स्थानिक घटना मानचित्र और हॉटस्पॉट",
  "Real-time spatial distribution, AI grievance clustering, and ward-level intensity tracking.": "वास्तविक समय स्थानिक वितरण, एआई शिकायत क्लस्टरिंग, और वार्ड-स्तरीय तीव्रता ट्रैकिंग।",
  "Recenter View": "दृष्टिकोण रीसेट करें",
  "Toggle Heatmap": "हीटमैप टॉगल करें",
  
  // Metric Cards
  "Spatial Incidents": "स्थानिक घटनाएं",
  "Live mapped issues": "लाइव मैप की गई समस्याएं",
  "Active Hotspots": "सक्रिय हॉटस्पॉट",
  "High density clusters": "उच्च घनत्व वाले क्लस्टर",
  "24h Velocity": "24 घंटे की गति",
  "New reports today": "आज की नई रिपोर्टें",
  "Monitored Wards": "निगरानी किए गए वार्ड",
  "Citywide coverage": "शहरव्यापी कवरेज",
  "Verified Zones": "सत्यापित क्षेत्र",
  "Citizen audit accuracy": "नागरिक ऑडिट सटीकता",
  "Critical Hazards": "गंभीर खतरे",
  "Immediate SLA risk": "तत्काल एसएलए जोखिम",
  
  // Filters & Map Controls
  "Ward / Area": "वार्ड / क्षेत्र",
  "All Wards (Citywide)": "सभी वार्ड (शहरव्यापी)",
  "Category": "श्रेणी",
  "All Categories": "सभी श्रेणियां",
  "Roads & Potholes": "सड़कें और गड्ढे",
  "Water Supply": "जल आपूर्ति",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street Lighting": "स्ट्रीट लाइट",
  "Drainage & Sewerage": "जल निकासी और सीवरेज",
  "Status": "स्थिति",
  "All Status": "सभी स्थितियां",
  "Pending": "लंबित",
  "In Progress": "प्रगति पर",
  "Resolved": "हल की गई",
  "Verified": "सत्यापित",
  "Rejected": "अस्वीकृत",
  "Map Style": "मानचित्र शैली",
  "Incident Severity & Category": "घटना गंभीरता और श्रेणी",
  "Critical / Emergency": "गंभीर / आपातकालीन",
  "High Priority": "उच्च प्राथमिकता",
  "Medium Priority": "मध्यम प्राथमिकता",
  "Resolved / Verified": "हल / सत्यापित",
  
  // Sidebar Hotspots & Panels
  "Ranked Hotspot Zones": "रैंक किए गए हॉटस्पॉट क्षेत्र",
  "High-density citizen report clusters": "उच्च घनत्व नागरिक रिपोर्ट क्लस्टर",
  "Ward Load Distribution": "वार्ड भार वितरण",
  "Grievance density by administrative ward": "वार्ड अनुसार शिकायत घनत्व",
  
  // Slide-out Details
  "User ID": "यूजर आईडी",
  "Date": "दिनांक",
  "Location": "स्थान",
  "Priority": "प्राथमिकता",
  "Assigned Department": "आवंटित विभाग",
  "Grievance Description": "शिकायत विवरण",
  "Citizen Verification Status": "नागरिक सत्यापन स्थिति",
  "Assign": "विभाग सौंपें",
  "Reject": "अस्वीकार करें",
  "Resolve": "हल करें",
  "Notifications": "सूचनाएं",
  "myProfile": "मेरी प्रोफ़ाइल",
  "darkMode": "डार्क मोड",
  "logout": "लॉग आउट",
  "searchPlaceholder": "हॉटस्पॉट, वार्ड, ट्रैक आईडी खोजें..."
};

// =========================================================
// 2. STATE & VARIABLES
// =========================================================
let map = null;
let tileLayer = null;
let currentLanguage = "en";
let currentTheme = "light";
let markersLayerGroup = null;
let heatmapCirclesGroup = null;
let activeComplaints = [];
let isHeatmapActive = false;
let currentActiveIssueId = null;

const BHUBANESWAR_CENTER = [20.2961, 85.8245];

// Predefined Hotspots definition with coordinates and descriptions
const HOTSPOTS_DATA = [
  {
    id: "hotspot-1",
    name: "Janpath Central Corridor",
    ward: "Ward 12",
    lat: 20.2961,
    lng: 85.8245,
    count: 18,
    severity: "CRITICAL",
    category: "Roads & Drainage",
    desc: "Multiple deep potholes and water stagnation along metro construction corridor."
  },
  {
    id: "hotspot-2",
    name: "Sector 15 Community Park",
    ward: "Ward 15",
    lat: 20.2910,
    lng: 85.8310,
    count: 12,
    severity: "HIGH",
    category: "Garbage & Sanitation",
    desc: "Persistent commercial waste accumulation and overflow near public park."
  },
  {
    id: "hotspot-3",
    name: "5th Cross BTM Layout",
    ward: "Ward 09",
    lat: 20.3120,
    lng: 85.8180,
    count: 9,
    severity: "MEDIUM",
    category: "Drainage Overflow",
    desc: "Blocked stormwater drain causing pedestrian walkway flooding."
  },
  {
    id: "hotspot-4",
    name: "Green View Residential Block",
    ward: "Ward 04",
    lat: 20.3010,
    lng: 85.8150,
    count: 6,
    severity: "RESOLVED",
    category: "Water Pipeline Leak",
    desc: "Main supply pipeline burst under repair and street resurfacing."
  }
];

// =========================================================
// 3. INITIALIZATION
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initMap();
  initEventListeners();
  loadLiveComplaints();
  renderHotspotsList();
});

// =========================================================
// 4. MAP SETUP & RENDERING
// =========================================================
function initMap() {
  if (typeof L === "undefined") return;

  map = L.map("incidentMap", {
    center: BHUBANESWAR_CENTER,
    zoom: 13,
    zoomControl: true,
    attributionControl: false
  });

  markersLayerGroup = L.layerGroup().addTo(map);
  heatmapCirclesGroup = L.layerGroup().addTo(map);

  updateMapTiles();

  map.on("moveend", () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const badge = document.getElementById("mapCoordsBadge");
    if (badge) {
      badge.textContent = `Lat: ${center.lat.toFixed(4)} · Lng: ${center.lng.toFixed(4)} · Zoom: ${zoom}`;
    }
  });
}

function updateMapTiles(layerType = "default") {
  if (!map) return;

  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  let tileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  if (layerType === "satellite") {
    tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  }

  tileLayer = L.tileLayer(tileUrl, {
    maxZoom: 19,
    subdomains: layerType === "satellite" ? [] : "abcd",
    attribution: false
  }).addTo(map);
}

// =========================================================
// 5. LOAD COMPLAINTS & RENDER MARKERS
// =========================================================
async function loadLiveComplaints() {
  try {
    let comps = [];
    if (window.CivicBuzzAPI?.public?.listComplaints) {
      const res = await window.CivicBuzzAPI.public.listComplaints();
      if (res && res.data && Array.isArray(res.data)) {
        comps = res.data;
      }
    } else if (window.ComplaintStore) {
      comps = window.ComplaintStore.getAll();
    }

    if (!comps || comps.length === 0) {
      // Fallback sample complaints with coordinates
      comps = [
        {
          complaint_id: "CB-12480",
          title: "Dangerous Pothole on Janpath",
          category: "roads_potholes",
          priority_level: "CRITICAL",
          status: "PENDING",
          user_uid: "CIT-2041",
          location: { ward_name: "Ward 12", address: "Janpath Road, Metro Pillar 42", latitude: 20.2961, longitude: 85.8245 }
        },
        {
          complaint_id: "CB-12481",
          title: "Streetlight outage near Market",
          category: "streetlights",
          priority_level: "HIGH",
          status: "IN_PROGRESS",
          user_uid: "CIT-1892",
          location: { ward_name: "Ward 08", address: "16th Main Road, Sector 4", latitude: 20.2980, longitude: 85.8210 }
        },
        {
          complaint_id: "CB-12482",
          title: "Garbage overflow near Sector 15 Park",
          category: "garbage_sanitation",
          priority_level: "HIGH",
          status: "REJECTED",
          user_uid: "CIT-3301",
          location: { ward_name: "Ward 15", address: "Sector 15, Nehru Park", latitude: 20.2910, longitude: 85.8310 }
        },
        {
          complaint_id: "CB-12483",
          title: "Main pipeline leak flooding street",
          category: "water_supply",
          priority_level: "HIGH",
          status: "RESOLVED",
          user_uid: "CIT-4412",
          location: { ward_name: "Ward 04", address: "Block A, Green View", latitude: 20.3010, longitude: 85.8150 }
        },
        {
          complaint_id: "CB-12484",
          title: "Clogged stormwater drain",
          category: "drainage",
          priority_level: "MEDIUM",
          status: "PENDING",
          user_uid: "CIT-5520",
          location: { ward_name: "Ward 09", address: "5th Cross Road, BTM Sector 5", latitude: 20.3120, longitude: 85.8180 }
        },
        {
          complaint_id: "CB-12479",
          title: "Flickering high-mast street light",
          category: "streetlights",
          priority_level: "LOW",
          status: "VERIFIED",
          user_uid: "CIT-1090",
          location: { ward_name: "Ward 12", address: "Janpath Square", latitude: 20.2940, longitude: 85.8260 }
        }
      ];
    }

    activeComplaints = comps;
    renderMapMarkers();
    updateSpatialMetrics();
  } catch (err) {
    console.error("Error loading complaints for map:", err);
  }
}

function renderMapMarkers() {
  if (!map || !markersLayerGroup) return;

  markersLayerGroup.clearLayers();
  heatmapCirclesGroup.clearLayers();

  const selectedWard = document.getElementById("mapWardFilter")?.value || "all";
  const selectedCategory = document.getElementById("mapCategoryFilter")?.value || "all";
  const selectedStatus = document.getElementById("mapStatusFilter")?.value || "all";

  const categoryIcons = {
    roads_potholes: "fa-road",
    road: "fa-road",
    streetlights: "fa-lightbulb",
    electricity: "fa-bolt",
    water_supply: "fa-faucet-drip",
    water: "fa-water",
    garbage_sanitation: "fa-trash",
    garbage: "fa-trash",
    drainage: "fa-water-ladder"
  };

  activeComplaints.forEach((c) => {
    // Check filters
    const ward = c.location?.ward_name || "";
    const cat = (c.category || "").toLowerCase();
    const rawSt = (c.status || "PENDING").toLowerCase();
    let normalizedStatus = "pending";
    if (rawSt.includes("subm") || rawSt.includes("pend")) normalizedStatus = "pending";
    else if (rawSt.includes("prog") || rawSt.includes("assign") || rawSt.includes("work")) normalizedStatus = "in progress";
    else if (rawSt.includes("resolv")) normalizedStatus = "resolved";
    else if (rawSt.includes("verif") || rawSt.includes("close")) normalizedStatus = "verified";
    else if (rawSt.includes("reject")) normalizedStatus = "rejected";

    if (selectedWard !== "all" && !ward.toLowerCase().includes(selectedWard.toLowerCase())) return;
    if (selectedCategory !== "all" && !cat.includes(selectedCategory.toLowerCase())) return;
    if (selectedStatus !== "all" && normalizedStatus !== selectedStatus.toLowerCase()) return;

    const lat = c.location?.latitude || (BHUBANESWAR_CENTER[0] + (Math.random() - 0.5) * 0.03);
    const lng = c.location?.longitude || (BHUBANESWAR_CENTER[1] + (Math.random() - 0.5) * 0.03);
    const priority = (c.priority_level || c.priority?.level || "MEDIUM").toLowerCase();
    const iconClass = categoryIcons[c.category] || "fa-location-dot";

    // Create Custom HTML Pin Marker
    const markerHtml = `
      <div class="custom-map-marker" data-issue-id="${c.complaint_id}">
        <div class="marker-pin ${priority}">
          <i class="fa-solid ${iconClass}"></i>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: markerHtml,
      className: "custom-div-icon",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayerGroup);

    // Popup Content
    const popupContent = `
      <div class="map-popup-card">
        <div class="map-popup-header">
          <span class="map-popup-id">#${c.complaint_id}</span>
          <span class="map-popup-badge ${priority}">${priority}</span>
        </div>
        <h4 class="map-popup-title">${c.title}</h4>
        <div class="map-popup-loc">
          <i class="fa-solid fa-location-dot"></i> ${c.location?.address || 'Janpath Corridor'}, ${ward}
        </div>
        <div style="font-size:11px; margin-top:3px;">
          Status: <strong>${normalizedStatus.toUpperCase()}</strong>
        </div>
        <button type="button" class="map-popup-btn" onclick="window.openIssueDetails('${c.complaint_id}')">
          <i class="fa-solid fa-eye"></i> View Full Details
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);

    // If heatmap overlay is active, add glowing density circles
    if (isHeatmapActive) {
      const radius = priority === "critical" ? 450 : priority === "high" ? 350 : 250;
      const color = priority === "critical" ? "#ef4444" : priority === "high" ? "#f59e0b" : "#3b82f6";
      L.circle([lat, lng], {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.18,
        weight: 1.5
      }).addTo(heatmapCirclesGroup);
    }
  });
}

function updateSpatialMetrics() {
  const statTotal = document.getElementById("statTotalPins");
  const statCritical = document.getElementById("statCriticalPins");
  const statHotspots = document.getElementById("statActiveHotspots");

  if (statTotal) statTotal.textContent = activeComplaints.length;
  
  const criticalCount = activeComplaints.filter(c => {
    const p = (c.priority_level || c.priority?.level || "").toUpperCase();
    return p === "CRITICAL" || p === "HIGH";
  }).length;
  if (statCritical) statCritical.textContent = criticalCount;
  if (statHotspots) statHotspots.textContent = HOTSPOTS_DATA.length;
}

// =========================================================
// 6. HOTSPOTS SIDEBAR LIST
// =========================================================
function renderHotspotsList() {
  const container = document.getElementById("hotspotList");
  if (!container) return;

  let html = "";
  HOTSPOTS_DATA.forEach(h => {
    html += `
      <div class="hotspot-card" onclick="window.flyToLocation(${h.lat}, ${h.lng}, 15)">
        <div class="hotspot-topline">
          <strong class="hotspot-title">${h.name}</strong>
          <span class="hotspot-count-pill">${h.count} Issues</span>
        </div>
        <p class="hotspot-desc">${h.desc}</p>
        <div class="hotspot-meta-row">
          <span>🏛️ ${h.ward} · ${h.category}</span>
          <button type="button" class="btn-focus-hotspot" onclick="event.stopPropagation(); window.flyToLocation(${h.lat}, ${h.lng}, 16)">
            🎯 Focus
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.flyToLocation = function(lat, lng, zoom = 15) {
  if (!map) return;
  map.flyTo([lat, lng], zoom, {
    duration: 1.2,
    easeLinearity: 0.25
  });
  showToast(`Focused map view on coordinates: [${lat.toFixed(3)}, ${lng.toFixed(3)}]`);
};

// =========================================================
// 7. ISSUE DETAILS SLIDE-OUT PANEL
// =========================================================
window.openIssueDetails = function(issueId) {
  currentActiveIssueId = issueId;
  const cleanId = (issueId || "").replace("#", "");
  const issue = activeComplaints.find(c => (c.complaint_id || "").replace("#", "") === cleanId);

  const panel = document.getElementById("issueDetailsPanel");
  const overlay = document.getElementById("issuePanelOverlay");
  if (!panel || !overlay) return;

  if (issue) {
    document.getElementById("panelIssueId").textContent = `#${issue.complaint_id}`;
    document.getElementById("panelIssueTitle").textContent = issue.title || "Citizen Grievance";
    document.getElementById("panelUserId").textContent = issue.user_uid || "CIT-1001";
    document.getElementById("panelDate").textContent = new Date(issue.created_at || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    document.getElementById("panelLocation").textContent = `${issue.location?.address || 'Janpath'}, ${issue.location?.ward_name || 'Ward 12'}`;
    document.getElementById("panelCategory").textContent = issue.department_name || issue.category || "General";
    
    const pr = (issue.priority_level || issue.priority?.level || "MEDIUM").toLowerCase();
    const prEl = document.getElementById("panelPriority");
    if (prEl) {
      prEl.textContent = pr.toUpperCase();
      prEl.className = `priority-badge ${pr}`;
    }

    const stEl = document.getElementById("panelStatus");
    const rawSt = (issue.status || "PENDING").toLowerCase();
    let stText = "PENDING";
    let badgeCls = "pending";
    if (rawSt.includes("subm") || rawSt.includes("pend")) { stText = "PENDING"; badgeCls = "pending"; }
    else if (rawSt.includes("prog") || rawSt.includes("assign") || rawSt.includes("work")) { stText = "IN PROGRESS"; badgeCls = "in-progress"; }
    else if (rawSt.includes("resolv")) { stText = "RESOLVED"; badgeCls = "resolved"; }
    else if (rawSt.includes("verif") || rawSt.includes("close")) { stText = "VERIFIED"; badgeCls = "verified"; }
    else if (rawSt.includes("reject")) { stText = "REJECTED"; badgeCls = "rejected"; }
    
    if (stEl) {
      stEl.textContent = stText;
      stEl.className = `status-badge ${badgeCls}`;
    }

    document.getElementById("panelDescription").textContent = issue.description || "Issue reported via citizen portal.";
    document.getElementById("panelAssigned").textContent = issue.department_name || "Roads & Potholes Department";

    // Dynamic Image Evidence Rendering
    const imageContainer = document.getElementById("panelImageContainer");
    let imageUrl = issue.image_url || issue.image || null;
    
    if (!imageUrl && window.ComplaintStore?.getAll) {
      const allComps = window.ComplaintStore.getAll();
      const match = allComps.find(c => (c.complaint_id || "").replace("#", "") === cleanId);
      if (match && match.image_url) {
        imageUrl = match.image_url;
      }
    }

    if (imageContainer) {
      if (imageUrl) {
        imageContainer.innerHTML = `
          <div class="issue-image-card" onclick="window.openImageLightbox('${imageUrl}')">
            <img src="${imageUrl}" alt="${issue.title || 'Attached Evidence'}" loading="lazy" />
            <div class="image-card-caption">
              <span>🔍 Click to enlarge</span>
              <small>Citizen Uploaded Evidence</small>
            </div>
          </div>
        `;
      } else {
        imageContainer.innerHTML = `
          <div class="image-not-uploaded-box">
            <div class="no-img-icon">📷</div>
            <div class="no-img-text">
              <strong data-i18n="Image not uploaded">Image not uploaded</strong>
              <p data-i18n="No visual media was attached by the citizen with this complaint.">No visual media was attached by the citizen with this complaint.</p>
            </div>
          </div>
        `;
      }
    }
  }

  panel.classList.add("open");
  overlay.classList.add("active");
};

window.openImageLightbox = function(src) {
  let lightbox = document.getElementById("civicbuzzImageLightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "civicbuzzImageLightbox";
    lightbox.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;backdrop-filter:blur(4px);";
    lightbox.onclick = function() { lightbox.style.display = "none"; };
    lightbox.innerHTML = `<img id="lightboxImg" style="max-width:92vw;max-height:92vh;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);border:2px solid rgba(255,255,255,0.2);object-fit:contain;" />`;
    document.body.appendChild(lightbox);
  }
  const img = lightbox.querySelector("#lightboxImg");
  if (img) img.src = src;
  lightbox.style.display = "flex";
};

function closeIssueDetails() {
  const panel = document.getElementById("issueDetailsPanel");
  const overlay = document.getElementById("issuePanelOverlay");
  if (panel) panel.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

// =========================================================
// 8. EVENT LISTENERS
// =========================================================
function initEventListeners() {
  // Recenter button
  document.getElementById("btnRecenterMap")?.addEventListener("click", () => {
    if (map) map.flyTo(BHUBANESWAR_CENTER, 13);
    showToast("Map view recentered to city center.");
  });

  // Heatmap toggle
  document.getElementById("btnToggleHeatmap")?.addEventListener("click", () => {
    isHeatmapActive = !isHeatmapActive;
    const btnText = document.getElementById("heatmapToggleText");
    if (btnText) {
      btnText.textContent = isHeatmapActive ? (currentLanguage === "hi" ? "हीटमैप छुपाएं" : "Hide Heatmap") : (currentLanguage === "hi" ? "हीटमैप दिखाएं" : "Toggle Heatmap");
    }
    renderMapMarkers();
    showToast(isHeatmapActive ? "Heatmap density overlay enabled." : "Heatmap overlay disabled.");
  });

  // Filters change
  document.getElementById("mapWardFilter")?.addEventListener("change", renderMapMarkers);
  document.getElementById("mapCategoryFilter")?.addEventListener("change", renderMapMarkers);
  document.getElementById("mapStatusFilter")?.addEventListener("change", renderMapMarkers);

  // Layer style buttons
  const styleBtns = document.querySelectorAll(".layer-btn");
  styleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      styleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      if (btn.id === "btnLayerHotspots") {
        isHeatmapActive = true;
      } else {
        isHeatmapActive = false;
      }
      renderMapMarkers();
    });
  });

  // Slide-out panel close
  document.getElementById("closeIssuePanel")?.addEventListener("click", closeIssueDetails);
  document.getElementById("issuePanelOverlay")?.addEventListener("click", closeIssueDetails);

  // Panel action buttons
  document.getElementById("assignIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "ASSIGN", "ROADS_AND_POTHOLES");
    }
    showToast("Issue assigned to department.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  document.getElementById("rejectIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "REJECT", null, "Rejected from Map Triage");
    }
    showToast("Issue marked as rejected.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  document.getElementById("resolveIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "RESOLVE");
    }
    showToast("Issue marked as resolved. Pending citizen verification.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  // Topbar Search Autocomplete
  initSearchAutocomplete();

  // Language Dropdown
  const langBtn = document.getElementById("languageButton");
  const langSelector = document.getElementById("languageSelector");
  if (langBtn && langSelector) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langSelector.classList.toggle("open");
    });
  }

  document.querySelectorAll(".language-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = opt.dataset.lang;
      setLanguage(lang);
      langSelector?.classList.remove("open");
    });
  });

  // Document Click to close dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#languageSelector")) {
      document.getElementById("languageSelector")?.classList.remove("open");
    }
    if (!e.target.closest("#notificationWrapper")) {
      document.getElementById("notificationWrapper")?.classList.remove("is-open");
      document.getElementById("notificationDropdown")?.classList.remove("open");
    }
    if (!e.target.closest("#profileWrapper")) {
      document.getElementById("profileWrapper")?.classList.remove("is-open");
      document.getElementById("profileDropdown")?.classList.remove("open");
    }
  });

  // Keyboard shortcut (Cmd/Ctrl + K)
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("mapSearchInput")?.focus();
    }
    if (e.key === "Escape") {
      closeIssueDetails();
      document.getElementById("searchSuggestions")?.setAttribute("hidden", "");
    }
  });
}

// =========================================================
// 9. THEME & LANGUAGE MANAGEMENT
// =========================================================
function initTheme() {
  const saved = localStorage.getItem("civicbuzz-admin-theme") || localStorage.getItem("civicbuzz-theme") || "light";
  currentTheme = saved;
  if (saved === "dark") {
    document.documentElement.classList.add("dark-theme");
    document.body.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }
  updateThemeControls();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  document.documentElement.classList.toggle("dark-theme", isDark);
  currentTheme = isDark ? "dark" : "light";
  localStorage.setItem("civicbuzz-admin-theme", currentTheme);
  localStorage.setItem("civicbuzz-theme", currentTheme);
  updateThemeControls();
  updateMapTiles();
  showToast(isDark ? "Dark mode activated." : "Light mode activated.");
}

function updateThemeControls() {
  const isDark = document.body.classList.contains("dark-theme");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (label) label.textContent = isDark ? (currentLanguage === "hi" ? "लाइट मोड" : "Light Mode") : (currentLanguage === "hi" ? "डार्क मोड" : "Dark Mode");
}

function initLanguage() {
  const saved = localStorage.getItem("civicbuzz-lang") || "en";
  setLanguage(saved);
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("civicbuzz-lang", lang);

  const langText = document.getElementById("currentLanguageText");
  if (langText) langText.textContent = lang === "hi" ? "हिन्दी" : "English";

  document.querySelectorAll(".language-option").forEach(opt => {
    opt.classList.toggle("active", opt.dataset.lang === lang);
  });

  // Translate all [data-i18n]
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (lang === "hi" && TRANSLATIONS[key]) {
      el.textContent = TRANSLATIONS[key];
    } else {
      el.textContent = key;
    }
  });

  // Translate placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (lang === "hi" && TRANSLATIONS[key]) {
      el.setAttribute("placeholder", TRANSLATIONS[key]);
    } else {
      el.setAttribute("placeholder", "Search hotspots, wards, track IDs...");
    }
  });

  updateThemeControls();
}

// =========================================================
// 10. GLOBAL ACTIONS & WINDOW EXPORTS
// =========================================================
window.toggleNotificationMenu = function(e) {
  e?.stopPropagation();
  const wrapper = document.getElementById("notificationWrapper");
  const dropdown = document.getElementById("notificationDropdown");
  wrapper?.classList.toggle("is-open");
  dropdown?.classList.toggle("open");
  document.getElementById("profileWrapper")?.classList.remove("is-open");
};

window.markAllNotificationsRead = function(e) {
  e?.stopPropagation();
  document.querySelectorAll(".notification-item.unread").forEach(item => item.classList.remove("unread"));
  const pill = document.getElementById("notifCountPill");
  const badge = document.getElementById("notifBadge");
  if (pill) pill.textContent = "0 New";
  if (badge) badge.textContent = "0";
  showToast("All notifications marked as read.");
};

window.handleNotifClick = function(e, action, id) {
  e?.stopPropagation();
  window.toggleNotificationMenu();
  if (action === "issue" && id) {
    window.openIssueDetails(id);
  } else if (action === "budgeting") {
    window.location.href = "../index.html#budgeting";
  } else {
    window.location.href = "../index.html#issuequeue";
  }
};

window.toggleProfileMenu = function(e) {
  e?.stopPropagation();
  const wrapper = document.getElementById("profileWrapper");
  const dropdown = document.getElementById("profileDropdown");
  wrapper?.classList.toggle("is-open");
  dropdown?.classList.toggle("open");
  document.getElementById("notificationWrapper")?.classList.remove("is-open");
};

window.handleProfileAction = function(e, action) {
  e?.stopPropagation();
  if (action === "theme") {
    toggleTheme();
  } else if (action === "profile") {
    document.getElementById("profileModal")?.removeAttribute("hidden");
    window.toggleProfileMenu();
  } else if (action === "logout") {
    window.location.href = "../../index.html";
  }
};

window.copyAdminId = function(e) {
  e?.stopPropagation();
  navigator.clipboard.writeText("ADMIN-001");
  showToast("Admin ID copied to clipboard: ADMIN-001");
};

// =========================================================
// 11. SEARCH AUTOCOMPLETE
// =========================================================
function initSearchAutocomplete() {
  const input = document.getElementById("mapSearchInput");
  const container = document.getElementById("searchSuggestions");
  if (!input || !container) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      container.setAttribute("hidden", "");
      container.innerHTML = "";
      return;
    }

    const matchedHotspots = HOTSPOTS_DATA.filter(h => h.name.toLowerCase().includes(q) || h.ward.toLowerCase().includes(q));
    const matchedIssues = activeComplaints.filter(c => 
      (c.complaint_id || "").toLowerCase().includes(q) || 
      (c.title || "").toLowerCase().includes(q) || 
      (c.location?.address || "").toLowerCase().includes(q)
    );

    let html = "";
    if (matchedHotspots.length > 0) {
      html += `<div class="search-group-header">Hotspots & Corridors</div>`;
      matchedHotspots.forEach(h => {
        html += `
          <div class="search-item" onclick="window.flyToLocation(${h.lat}, ${h.lng}, 16); document.getElementById('searchSuggestions').setAttribute('hidden','');">
            <span>🔥</span>
            <div><strong>${h.name}</strong><br><small style="color:var(--muted);">${h.ward} · ${h.count} issues</small></div>
          </div>
        `;
      });
    }

    if (matchedIssues.length > 0) {
      html += `<div class="search-group-header">Incidents & Track IDs</div>`;
      matchedIssues.forEach(c => {
        html += `
          <div class="search-item" onclick="window.openIssueDetails('${c.complaint_id}'); document.getElementById('searchSuggestions').setAttribute('hidden','');">
            <span>📍</span>
            <div><strong>#${c.complaint_id}</strong>: ${c.title}<br><small style="color:var(--muted);">${c.location?.ward_name || ''}</small></div>
          </div>
        `;
      });
    }

    if (!html) {
      html = `<div style="padding:10px; font-size:12px; color:var(--muted); text-align:center;">No matching locations or track IDs found.</div>`;
    }

    container.innerHTML = html;
    container.removeAttribute("hidden");
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
