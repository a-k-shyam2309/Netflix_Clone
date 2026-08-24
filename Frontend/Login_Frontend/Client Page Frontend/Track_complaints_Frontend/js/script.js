// ============================================================
// CivicBuzz — Track Complaints page
// Live Database connection, synchronized Leaflet GIS map,
// dynamic Priority KPIs, and citizen verification actions.
// ============================================================

let allComplaints = [];
let filteredComplaints = [];
let currentPriorityFilter = 'all';
let currentStatusFilter = 'ALL';
let searchQuery = '';
let trackMap = null;
let mapMarkersGroup = null;
let mapHotspotsGroup = null;
const cardMarkerMap = new Map();

// Helper: relative time formatter
function formatRelativeTime(isoString) {
  if (!isoString) return 'Recently';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `Reported ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `Reported ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Reported just now';
  } catch (_) {
    return 'Recently';
  }
}

// Helper: category and subcategory formatter
function formatCategoryLabel(cat, subCat) {
  const c = (cat || 'road').replace(/_/g, ' ');
  const s = (subCat || 'issue').replace(/_/g, ' ');
  return `${c.charAt(0).toUpperCase() + c.slice(1)} &middot; ${s}`;
}

// Toast notification helper
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.background = isError ? '#991B1B' : '#0F172A';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// Setup filter button listeners
function setupFilterChips() {
  const priorityChips = document.querySelectorAll('#filterRow .filter-chip:not(.filter-status)');
  priorityChips.forEach(function (button) {
    button.addEventListener('click', function () {
      priorityChips.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      currentPriorityFilter = button.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  const statusChips = document.querySelectorAll('#filterRow .filter-status');
  statusChips.forEach(function (button) {
    button.addEventListener('click', function () {
      statusChips.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      currentStatusFilter = button.getAttribute('data-status') || 'ALL';
      applyFilters();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      applyFilters();
    });
  }
}

// Setup timeline collapsible accordion triggers
function setupTimelineToggles() {
  const timelineToggles = document.querySelectorAll('.timeline-toggle');
  timelineToggles.forEach(function (toggle) {
    toggle.onclick = function (e) {
      e.stopPropagation();
      const targetId = toggle.getAttribute('data-target');
      const detail = document.getElementById(targetId);
      if (!detail) return;
      const isHidden = detail.hasAttribute('hidden');

      if (isHidden) {
        detail.removeAttribute('hidden');
        toggle.textContent = 'Hide timeline';
      } else {
        detail.setAttribute('hidden', '');
        toggle.textContent = 'View timeline';
      }
    };
  });
}

// Filter logic applying to both Cards List and Live Map
function applyFilters() {
  filteredComplaints = allComplaints.filter(c => {
    const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toLowerCase();
    const s = (c.status || 'SUBMITTED').toUpperCase();

    // Priority filter
    if (currentPriorityFilter !== 'all' && p !== currentPriorityFilter.toLowerCase()) {
      return false;
    }

    // Status filter
    if (currentStatusFilter !== 'ALL') {
      if (currentStatusFilter === 'RESOLVED' && s !== 'RESOLVED') return false;
      if (currentStatusFilter === 'IN_PROGRESS' && (s === 'RESOLVED' || s === 'REJECTED')) return false;
    }

    // Search query filter
    if (searchQuery) {
      const matchId = (c.complaint_id || '').toLowerCase().includes(searchQuery);
      const matchTitle = (c.title || '').toLowerCase().includes(searchQuery);
      const matchDesc = (c.description || '').toLowerCase().includes(searchQuery);
      const matchWard = (c.ward || c.location?.ward_name || '').toLowerCase().includes(searchQuery);
      const matchCat = (c.category || '').toLowerCase().includes(searchQuery);
      if (!matchId && !matchTitle && !matchDesc && !matchWard && !matchCat) return false;
    }

    return true;
  });

  renderComplaintCards();
  renderMapMarkers();
}

// Render dynamic complaint cards
function renderComplaintCards() {
  const complaintList = document.getElementById('complaintList');
  const summarySub = document.getElementById('complaintSummarySub');
  const tabCountTotal = document.getElementById('tabCountTotal');

  if (tabCountTotal) tabCountTotal.textContent = allComplaints.length;
  if (summarySub) {
    summarySub.textContent = `Sorted by AI priority · ${filteredComplaints.length} of ${allComplaints.length} grievances shown`;
  }

  if (!complaintList) return;

  if (filteredComplaints.length === 0) {
    complaintList.innerHTML = `
      <div style="padding: 50px 20px; text-align: center; color: var(--muted); width: 100%;">
        <i class="fa fa-folder-open" style="font-size:32px; margin-bottom:12px; display:block; opacity:0.5;"></i>
        <div style="font-size:16px; font-weight:600; margin-bottom:6px; color:var(--text);">No complaints match your filters</div>
        <p style="font-size:13px;">Try clearing filters or search query to view all municipal issues.</p>
        <button onclick="clearAllFilters()" style="margin-top:12px; background:var(--blue); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer;">Show All Grievances</button>
      </div>
    `;
    return;
  }

  complaintList.innerHTML = filteredComplaints.map((c, idx) => {
    const rawPriority = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
    const priorityClass = rawPriority === 'CRITICAL' ? 'chip-priority-high' : rawPriority === 'HIGH' ? 'chip-priority-high' : rawPriority === 'LOW' ? 'chip-priority-low' : 'chip-priority-medium';
    const statusVal = c.status || 'SUBMITTED';
    const isResolved = statusVal === 'RESOLVED';
    const isReadyForVerify = statusVal === 'READY_FOR_CITIZEN_VERIFICATION';
    const isInProgress = ['IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(statusVal);
    const isAssigned = ['ASSIGNED', 'IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(statusVal);

    const statusBadgeClass = isResolved ? 'chip-status-resolved' : statusVal === 'IN_PROGRESS' ? 'chip-status-progress' : 'chip-status-reported';
    const statusDisplayText = isReadyForVerify ? 'Ready for Verification' : statusVal.replace(/_/g, ' ');

    const wardName = c.ward || c.location?.ward_name || 'Ward 1 (Patia)';
    const dept = c.department_name || 'Roads & Works Department';
    const upvotes = c.upvotes || 1;
    const timeAgo = formatRelativeTime(c.created_at);
    const catLabel = formatCategoryLabel(c.category, c.sub_category);
    const urgency = c.urgency_score || (c.priority?.score || 85);

    return `
      <article class="complaint-card" id="card_${c.complaint_id}" data-priority="${rawPriority.toLowerCase()}" onclick="focusMapOnComplaint('${c.complaint_id}')" style="cursor: pointer;">
        <header class="complaint-head">
          <div class="complaint-titles">
            <div class="complaint-meta-top">
              <span class="chip ${priorityClass}">${rawPriority} priority</span>
              <span class="chip chip-category">${catLabel}</span>
              <span class="chip" style="background:rgba(5, 150, 105, 0.1); color:#059669; font-weight:700; font-size:11px;">Urgency: ${urgency}/100</span>
            </div>
            <h3 class="complaint-title">${c.title}</h3>
            <div class="complaint-meta mono">#${c.complaint_id} &middot; ${timeAgo} &middot; ${wardName}</div>
          </div>
          <div class="complaint-status">
            <span class="chip ${statusBadgeClass}">${statusDisplayText}</span>
            <button class="timeline-toggle" data-target="t_${idx}">View timeline</button>
          </div>
        </header>

        ${c.ai_summary ? `
          <div style="font-size:12px; color:var(--secondary); line-height:1.4; margin: 4px 0 12px; background:rgba(0,0,0,0.02); padding:8px 12px; border-radius:8px; border-left:3px solid var(--blue);">
            <span style="font-weight:700; color:var(--blue);">AI Triage Analysis:</span> ${c.ai_summary}
          </div>
        ` : ''}

        ${c.image_url ? `
          <div style="margin-bottom:12px;">
            <img src="${c.image_url}" alt="Evidence" style="max-height:100px; width:100%; max-width:280px; border-radius:8px; object-fit:cover; border:1px solid var(--border);" />
          </div>
        ` : ''}

        <div class="tracker">
          <div class="track-step is-complete"><div class="track-dot"></div><div class="track-label">Reported</div></div>
          <div class="track-step ${isAssigned ? 'is-complete' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">AI Triaged</div></div>
          <div class="track-step ${isInProgress ? 'is-complete' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">In progress</div></div>
          <div class="track-step ${isResolved ? 'is-complete is-current' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">Resolved</div></div>
        </div>

        <div class="timeline-detail" id="t_${idx}" hidden>
          ${(c.timeline || []).map(t => `
            <div class="timeline-row"><span class="mono">${(t.timestamp || '').slice(0, 10)}</span> <strong>${t.step}:</strong> ${t.notes || ''}</div>
          `).join('') || '<div class="timeline-row">Grievance under review by municipal division.</div>'}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px solid var(--border);">
          <div style="font-size:11.5px; color:var(--muted);">
            🏛️ ${dept} &middot; ⏱️ SLA: ${c.sla_hours || 48}h
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button onclick="event.stopPropagation(); upvoteComplaint('${c.complaint_id}')" style="background:rgba(217, 119, 6, 0.1); color:#B45309; border:1px solid rgba(217, 119, 6, 0.3); border-radius:6px; padding:4px 10px; font-size:11.5px; font-weight:700; cursor:pointer;" title="Upvote issue urgency">
              👍 Upvote (${upvotes})
            </button>
            <button onclick="event.stopPropagation(); focusMapOnComplaint('${c.complaint_id}')" style="background:var(--blue-soft); color:var(--blue); border:1px solid rgba(37,99,235,0.2); border-radius:6px; padding:4px 10px; font-size:11.5px; font-weight:600; cursor:pointer;" title="Pinpoint on Map">
              📍 Map Pin
            </button>
          </div>
        </div>

        ${isReadyForVerify ? `
          <div style="margin-top: 12px; padding: 12px; background: rgba(59, 130, 246, 0.08); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);" onclick="event.stopPropagation()">
            <div style="font-size: 13px; font-weight: 600; color: #1D4ED8; margin-bottom: 6px;">✦ Action Required: Physically Inspect & Confirm Resolution</div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button onclick="confirmResolution('${c.complaint_id}')" style="background: #10B981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer;">★ Problem Resolved</button>
              <button onclick="disputeResolution('${c.complaint_id}')" style="background: #EF4444; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer;">Not Resolved</button>
            </div>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');

  setupTimelineToggles();
}

// Update Priority overview metrics
function updatePriorityOverviewKPIs() {
  let critCount = 0;
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;
  let resolvedCount = 0;

  allComplaints.forEach(c => {
    const isResolved = c.status === 'RESOLVED';
    if (isResolved) {
      resolvedCount++;
    } else {
      const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
      if (p === 'CRITICAL') critCount++;
      else if (p === 'HIGH') highCount++;
      else if (p === 'LOW') lowCount++;
      else medCount++;
    }
  });

  const critEl = document.getElementById('critPriorityCount');
  const highEl = document.getElementById('highPriorityCount');
  const medEl = document.getElementById('medPriorityCount');
  const lowEl = document.getElementById('lowPriorityCount');
  const resolvedTextEl = document.getElementById('resolvedCountText');
  const resolvedFillEl = document.getElementById('resolvedProgressFill');

  if (critEl) critEl.textContent = `${critCount} open`;
  if (highEl) highEl.textContent = `${highCount} open`;
  if (medEl) medEl.textContent = `${medCount} open`;
  if (lowEl) lowEl.textContent = `${lowCount} open`;

  const total = allComplaints.length || 1;
  const pct = Math.round((resolvedCount / total) * 100);
  if (resolvedTextEl) resolvedTextEl.textContent = `${resolvedCount} / ${allComplaints.length} (${pct}%)`;
  if (resolvedFillEl) resolvedFillEl.style.width = `${pct}%`;
}

// Initialize Leaflet Live Mini-Map
function initTrackMap() {
  const mapContainer = document.getElementById('trackLiveMap');
  if (!mapContainer || trackMap) return;

  try {
    trackMap = L.map('trackLiveMap', {
      center: [20.2961, 85.8245],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // High quality CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(trackMap);

    mapMarkersGroup = L.layerGroup().addTo(trackMap);
    mapHotspotsGroup = L.layerGroup().addTo(trackMap);

    setTimeout(() => {
      trackMap.invalidateSize();
    }, 400);
  } catch (err) {
    console.warn('Leaflet initialization note:', err.message);
  }
}

// Render colored live pins on the mini map
function renderMapMarkers() {
  if (!trackMap || !mapMarkersGroup) return;

  mapMarkersGroup.clearLayers();
  mapHotspotsGroup.clearLayers();
  cardMarkerMap.clear();

  const bounds = [];

  filteredComplaints.forEach(c => {
    const lat = Number(c.latitude || c.location?.latitude);
    const lng = Number(c.longitude || c.location?.longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

    bounds.push([lat, lng]);

    const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
    const isResolved = c.status === 'RESOLVED';
    const pinClass = isResolved ? 'pin-resolved' : p === 'CRITICAL' ? 'pin-critical' : p === 'HIGH' ? 'pin-high' : p === 'LOW' ? 'pin-low' : 'pin-medium';
    const symbol = isResolved ? '✓' : p === 'CRITICAL' ? '!' : '●';

    // Create custom pin icon
    const customIcon = L.divIcon({
      className: 'track-map-marker-wrap',
      html: `<div class="track-map-pin ${pinClass}"><span>${symbol}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    // Informative popup
    const popupContent = `
      <div style="font-family:'Inter', sans-serif; font-size:12px; min-width:210px;">
        <div style="font-weight:700; color:var(--text); margin-bottom:4px; font-size:13px;">${c.title}</div>
        <div style="color:var(--muted); font-size:11px; margin-bottom:6px;">📍 ${c.ward || c.location?.ward_name || 'Bhubaneswar'} &middot; <span class="mono">#${c.complaint_id}</span></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; font-size:11px; text-transform:uppercase; color:${isResolved ? '#15803d' : p === 'CRITICAL' ? '#dc2626' : '#2563eb'};">${c.status.replace(/_/g, ' ')}</span>
          <span style="font-size:11px; font-weight:700; background:rgba(0,0,0,0.05); padding:2px 6px; border-radius:4px;">Urgency ${c.urgency_score || 80}/100</span>
        </div>
        <button onclick="scrollToComplaintCard('${c.complaint_id}')" style="width:100%; background:#2563eb; color:#fff; border:none; padding:5px 8px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer;">
          View Full Details
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    mapMarkersGroup.addLayer(marker);
    cardMarkerMap.set(c.complaint_id, marker);

    // If critical or has high upvotes, plot subtle hotspot circle
    if (p === 'CRITICAL' || (c.upvotes && c.upvotes > 20)) {
      const circle = L.circle([lat, lng], {
        radius: 400,
        color: '#dc2626',
        weight: 1,
        fillColor: '#dc2626',
        fillOpacity: 0.12,
        dashArray: '3, 4',
      });
      mapHotspotsGroup.addLayer(circle);
    }
  });

  if (bounds.length > 0) {
    try {
      trackMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } catch (_) {}
  }
}

// Map pin interaction: focus map and highlight card
window.focusMapOnComplaint = function (cid) {
  const marker = cardMarkerMap.get(cid);
  const comp = allComplaints.find(c => c.complaint_id === cid);
  if (marker && trackMap) {
    const lat = Number(comp?.latitude || comp?.location?.latitude);
    const lng = Number(comp?.longitude || comp?.location?.longitude);
    if (lat && lng) {
      trackMap.setView([lat, lng], 14, { animate: true });
      marker.openPopup();
    }
  }
  highlightCard(cid);
};

window.scrollToComplaintCard = function (cid) {
  const card = document.getElementById(`card_${cid}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightCard(cid);
  }
};

function highlightCard(cid) {
  document.querySelectorAll('.complaint-card').forEach(c => c.classList.remove('card-highlighted'));
  const target = document.getElementById(`card_${cid}`);
  if (target) {
    target.classList.add('card-highlighted');
    setTimeout(() => {
      target.classList.remove('card-highlighted');
    }, 3500);
  }
}

window.clearAllFilters = function () {
  currentPriorityFilter = 'all';
  currentStatusFilter = 'ALL';
  searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('#filterRow .filter-chip').forEach(b => b.classList.remove('active'));
  document.querySelector('#filterRow .filter-chip[data-filter="all"]')?.classList.add('active');
  applyFilters();
};

// Load live complaints from backend API / single source of truth
async function loadLiveComplaints() {
  try {
    let complaints = [];

    // 1. Try FastAPI backend API
    if (window.CivicBuzzAPI && window.CivicBuzzAPI.public) {
      const res = await window.CivicBuzzAPI.public.listComplaints();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        complaints = res.data;
      }
    }

    // 2. Fallback to ComplaintStore if backend was empty
    if (complaints.length === 0 && window.CivicBuzzAPI?.store) {
      complaints = window.CivicBuzzAPI.store.getAll();
    }

    // 3. Direct localStorage read as secondary fallback
    if (complaints.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem('civicbuzz_complaints') || '[]');
        if (Array.isArray(stored) && stored.length > 0) complaints = stored;
      } catch (_) {}
    }

    allComplaints = complaints;
    updatePriorityOverviewKPIs();
    applyFilters();
  } catch (err) {
    console.warn('Complaints load note:', err.message);
  }
}

// Citizen resolution actions
window.upvoteComplaint = async function (cid) {
  if (!window.CivicBuzzAPI) return;
  try {
    if (window.CivicBuzzAPI.complaints?.upvote) {
      await window.CivicBuzzAPI.complaints.upvote(cid);
      showToast(`★ Upvoted #${cid}! Urgency elevated for priority municipal action.`);
      loadLiveComplaints();
    }
  } catch (_) {
    showToast(`Upvote recorded for #${cid}.`);
  }
};

window.confirmResolution = async function (cid) {
  if (!window.CivicBuzzAPI) return;
  try {
    await window.CivicBuzzAPI.complaints.verifyResolution(cid, 5, 'Physical inspection confirmed satisfactory repair.');
    showToast(`Resolution confirmed for #${cid}! Public transparency audit record updated.`);
    loadLiveComplaints();
  } catch (err) {
    showToast(err.message || 'Verification recorded.');
  }
};

window.disputeResolution = async function (cid) {
  if (!window.CivicBuzzAPI) return;
  const reason = prompt('Please explain why the issue is not satisfactorily resolved:') || 'Repair is incomplete upon on-site verification.';
  try {
    await window.CivicBuzzAPI.complaints.rejectResolution(cid, reason);
    showToast(`Issue #${cid} disputed and reopened for department rework.`);
    loadLiveComplaints();
  } catch (err) {
    showToast(err.message || 'Dispute submitted.');
  }
};

// Mouse drag support for horizontal complaints carousel
const complaintList = document.getElementById('complaintList');
let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

if (complaintList) {
  complaintList.addEventListener('mousedown', function (event) {
    if (event.target.closest('button') || event.target.closest('input') || event.target.closest('a')) return;
    isDragging = true;
    startX = event.pageX - complaintList.offsetLeft;
    startScrollLeft = complaintList.scrollLeft;
  });

  window.addEventListener('mouseup', function () {
    isDragging = false;
  });

  complaintList.addEventListener('mousemove', function (event) {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - complaintList.offsetLeft;
    complaintList.scrollLeft = startScrollLeft - (x - startX);
  });
}

// Live synchronization listeners across tabs & submissions
window.addEventListener('civicbuzz_data_updated', function () {
  loadLiveComplaints();
});

window.addEventListener('storage', function (e) {
  if (e.key === 'civicbuzz_complaints' || e.key === 'civicbuzz_registered_complaints' || e.key === 'civicbuzz_complaints_tick') {
    loadLiveComplaints();
  }
});

// Initialize on page ready
document.addEventListener('DOMContentLoaded', function () {
  setupFilterChips();
  initTrackMap();
  loadLiveComplaints();
});

// Immediate execution in case DOMContentLoaded already fired
setupFilterChips();
initTrackMap();
loadLiveComplaints();
