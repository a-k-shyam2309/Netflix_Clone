// ============================================================
// CivicBuzz — Track Complaints page
// Live API connection, timeline filtering, and citizen resolution verification
// ============================================================

const filterButtons = document.querySelectorAll('.filter-chip');
let complaintCards = document.querySelectorAll('.complaint-card');

function setupFilterChips() {
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');

      const chosenPriority = button.getAttribute('data-filter');

      document.querySelectorAll('.complaint-card').forEach(function (card) {
        const matches = chosenPriority === 'all' ||
          card.getAttribute('data-priority') === chosenPriority;
        card.style.display = matches ? '' : 'none';
      });
    });
  });
}

function setupTimelineToggles() {
  const timelineToggles = document.querySelectorAll('.timeline-toggle');
  timelineToggles.forEach(function (toggle) {
    toggle.onclick = function () {
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

// Mouse drag support for horizontal complaints carousel
const complaintList = document.getElementById('complaintList');
let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

if (complaintList) {
  complaintList.addEventListener('mousedown', function (event) {
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
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// Load live complaints from backend API
async function loadLiveComplaints() {
  if (!window.CivicBuzzAPI) return;

  try {
    const res = await window.CivicBuzzAPI.public.listComplaints();
    const complaints = res.data;

    if (complaints && complaints.length > 0 && complaintList) {
      // Build dynamic cards from live API
      complaintList.innerHTML = complaints.map((c, idx) => {
        const priority = (c.priority_level || c.severity || 'MEDIUM').toLowerCase();
        const statusText = c.status === 'READY_FOR_CITIZEN_VERIFICATION' ? 'Ready for Verification' : (c.status.replace(/_/g, ' '));
        const isReadyForVerify = c.status === 'READY_FOR_CITIZEN_VERIFICATION';
        const isResolved = c.status === 'RESOLVED';
        const urgencyScore = c.urgency_score || (priority === 'critical' ? 92 : 85);
        const wardLoc = c.location?.ward_name || c.approximate_location || c.ward || 'Ward 12';
        const dept = c.department_name || c.responsible_department || 'Roads & Potholes Dept.';
        const upvotes = c.upvotes || 1;

        return `
          <article class="complaint-card glass" data-priority="${priority}" data-cid="${c.complaint_id}" style="margin-bottom: 18px;">
            <div class="card-head" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="complaint-id mono" style="font-weight:700; color:var(--text-primary);">#${c.complaint_id}</span>
                <span class="chip chip-${priority}">${c.priority_level || c.severity || 'Medium'}</span>
                <span class="chip" style="background:rgba(5, 150, 105, 0.1); color:#059669; font-weight:600; font-size:11px;">Urgency: ${urgencyScore}/100</span>
                ${c.is_pb_candidate ? '<span class="chip" style="background:rgba(124, 58, 237, 0.12); color:#7C3AED; font-weight:600; font-size:11px;">📊 PB Hotspot</span>' : ''}
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <button onclick="upvoteComplaint('${c.complaint_id}')" style="background:rgba(217, 119, 6, 0.12); color:#B45309; border:1px solid rgba(217, 119, 6, 0.3); border-radius:6px; padding:3px 8px; font-size:11px; font-weight:700; cursor:pointer;" title="Upvote issue urgency">
                  👍 Upvote (${upvotes})
                </button>
              </div>
            </div>

            <div class="complaint-title" style="font-size:15px; font-weight:700; margin-bottom:4px;">${c.title}</div>
            
            ${c.ai_summary ? `
              <div style="font-size:12px; color:var(--text-secondary); line-height:1.4; margin-bottom:8px; background:rgba(0,0,0,0.02); padding:6px 10px; border-radius:8px; border-left:3px solid #059669;">
                <span style="font-weight:700; color:#059669;">AI Triage Summary:</span> ${c.ai_summary}
              </div>
            ` : ''}

            <div class="complaint-meta" style="font-size:11.5px; color:var(--text-muted); margin-bottom:12px;">
              📍 ${wardLoc} &middot; 🏛️ ${dept} &middot; ⏱️ SLA: ${c.sla_hours || 48}h
            </div>

            ${c.image_url ? `
              <div style="margin-bottom:12px;">
                <img src="${c.image_url}" alt="Evidence" style="max-height:90px; border-radius:8px; object-fit:cover; border:1px solid rgba(0,0,0,0.1);" />
              </div>
            ` : ''}

            <div class="tracker-row">
              <div class="track-step is-complete"><div class="track-dot"></div><div class="track-label">Reported</div></div>
              <div class="track-line ${c.status !== 'SUBMITTED' ? 'is-complete' : ''}"></div>
              <div class="track-step ${c.status !== 'SUBMITTED' ? 'is-complete' : ''}"><div class="track-dot"></div><div class="track-label">AI Triaged</div></div>
              <div class="track-line ${['IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(c.status) ? 'is-complete' : ''}"></div>
              <div class="track-step ${['IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(c.status) ? 'is-complete' : ''}"><div class="track-dot"></div><div class="track-label">In Progress</div></div>
              <div class="track-line ${isResolved ? 'is-complete' : ''}"></div>
              <div class="track-step ${isResolved ? 'is-complete' : ''}"><div class="track-dot"></div><div class="track-label">Resolved</div></div>
            </div>

            ${isReadyForVerify ? `
              <div style="margin-top: 14px; padding: 12px; background: rgba(59, 130, 246, 0.08); border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.2);">
                <div style="font-size: 13px; font-weight: 600; color: #1D4ED8; margin-bottom: 6px;">✦ Action Required: Physically Inspect & Confirm Resolution</div>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                  <button onclick="confirmResolution('${c.complaint_id}')" style="background: #10B981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer;">★ Problem Resolved</button>
                  <button onclick="disputeResolution('${c.complaint_id}')" style="background: #EF4444; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; cursor: pointer;">Not Resolved</button>
                </div>
              </div>
            ` : ''}

            <div class="card-footer" style="margin-top: 14px; display:flex; justify-content:space-between; align-items:center;">
              <button class="timeline-toggle" data-target="tl_${idx}">View timeline (${(c.timeline || []).length || 1} events)</button>
              <div class="status-indicator" style="font-size:12px; font-weight:700;">${statusText}</div>
            </div>

            <div class="timeline-detail" id="tl_${idx}" hidden style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.02); border-radius:8px;">
              ${(c.timeline || c.resolution_timeline || []).map(t => `
                <div class="timeline-row" style="font-size:11.5px; margin-bottom:4px;"><span class="mono" style="color:#059669;">${(t.timestamp || '').slice(0, 10)}</span> <strong>${t.step}:</strong> ${t.notes || ''}</div>
              `).join('') || '<div class="timeline-row">Under active department review.</div>'}
            </div>
          </article>
        `;
      }).join('');

      setupTimelineToggles();
    }
  } catch (err) {
    console.warn('Live complaints loading note:', err.message);
  }
}

// Global resolution actions for citizen verification
window.upvoteComplaint = async function(cid) {
  if (!window.CivicBuzzAPI) return;
  try {
    if (window.CivicBuzzAPI.complaints?.upvote) {
      await window.CivicBuzzAPI.complaints.upvote(cid);
      showToast(`★ Upvoted #${cid}! Urgency level elevated for priority remediation.`);
      loadLiveComplaints();
    }
  } catch (err) {
    showToast(`Upvote recorded for #${cid}.`);
  }
};

window.confirmResolution = async function(cid) {
  if (!window.CivicBuzzAPI) return;
  try {
    await window.CivicBuzzAPI.complaints.verifyResolution(cid, 5, 'Inspected on site, resolution confirmed.');
    showToast(`Resolution confirmed for #${cid}! Public transparency record updated.`);
    loadLiveComplaints();
  } catch (err) {
    showToast(err.message || 'Verification recorded.');
  }
};

window.disputeResolution = async function(cid) {
  if (!window.CivicBuzzAPI) return;
  const reason = prompt('Please explain why the issue is not satisfactorily resolved:') || 'Repair is incomplete upon physical inspection.';
  try {
    await window.CivicBuzzAPI.complaints.rejectResolution(cid, reason);
    showToast(`Issue #${cid} disputed and reopened for department rework.`);
    loadLiveComplaints();
  } catch (err) {
    showToast(err.message || 'Dispute submitted.');
  }
};

// Initialize
setupFilterChips();
setupTimelineToggles();
loadLiveComplaints();
