// =========================================================
// CIVICBUZZ CLIENT DASHBOARD
// SCRIPT.JS
// =========================================================

(() => {
	"use strict";

	// =====================================================
	// HERO SLIDER
	// =====================================================

	const heroSlider = document.getElementById("heroSlider");
	const heroSlides = document.querySelectorAll(".hero-slide");
	const heroDots = document.querySelectorAll(".hero-dot");
	const heroPrev = document.getElementById("heroPrev");
	const heroNext = document.getElementById("heroNext");

	let currentSlide = 0;
	let heroTimer = null;

	const slideDuration = 5000;


	function showSlide(index) {

		if (!heroSlides.length) {
			return;
		}

		if (index >= heroSlides.length) {
			index = 0;
		}

		if (index < 0) {
			index = heroSlides.length - 1;
		}

		currentSlide = index;

		heroSlides.forEach((slide) => {
			slide.classList.remove("active");
		});

		heroDots.forEach((dot) => {
			dot.classList.remove("active");
		});

		heroSlides[currentSlide].classList.add("active");

		if (heroDots[currentSlide]) {
			heroDots[currentSlide].classList.add("active");
		}
	}


	function nextSlide() {
		showSlide(currentSlide + 1);
	}


	function previousSlide() {
		showSlide(currentSlide - 1);
	}


	function stopHeroSlider() {

		if (heroTimer) {
			clearInterval(heroTimer);
			heroTimer = null;
		}
	}


	function startHeroSlider() {

		stopHeroSlider();

		heroTimer = setInterval(() => {
			nextSlide();
		}, slideDuration);
	}


	if (heroNext) {

		heroNext.addEventListener("click", () => {

			nextSlide();
			startHeroSlider();

		});

	}


	if (heroPrev) {

		heroPrev.addEventListener("click", () => {

			previousSlide();
			startHeroSlider();

		});

	}


	heroDots.forEach((dot) => {

		dot.addEventListener("click", () => {

			const slideIndex =
				Number(dot.dataset.slide);

			showSlide(slideIndex);
			startHeroSlider();

		});

	});


	if (heroSlider) {

		heroSlider.addEventListener(
			"mouseenter",
			stopHeroSlider
		);

		heroSlider.addEventListener(
			"mouseleave",
			startHeroSlider
		);


		heroSlider.addEventListener(
			"touchstart",
			stopHeroSlider,
			{
				passive: true
			}
		);


		heroSlider.addEventListener(
			"touchend",
			startHeroSlider,
			{
				passive: true
			}
		);
	}


	if (heroSlides.length > 1) {

		showSlide(0);
		startHeroSlider();

	}


	// =====================================================
	// MODAL ELEMENTS
	// =====================================================

	const reportIssueModal =
		document.getElementById(
			"reportIssueModal"
		);

	const complaintDetailsModal =
		document.getElementById(
			"complaintDetailsModal"
		);


	const closeReportModal =
		document.getElementById(
			"closeReportModal"
		);

	const cancelReportButton =
		document.getElementById(
			"cancelReportButton"
		);

	const closeComplaintModal =
		document.getElementById(
			"closeComplaintModal"
		);


	// =====================================================
	// REPORT MODAL
	// =====================================================

	function openReportModal() {

		if (!reportIssueModal) {
			return;
		}

		reportIssueModal.classList.add("active");

		reportIssueModal.setAttribute(
			"aria-hidden",
			"false"
		);

		document.body.classList.add(
			"modal-open"
		);

		stopHeroSlider();
	}


	function closeReportModalFunction() {

		if (!reportIssueModal) {
			return;
		}

		reportIssueModal.classList.remove(
			"active"
		);

		reportIssueModal.setAttribute(
			"aria-hidden",
			"true"
		);

		document.body.classList.remove(
			"modal-open"
		);

		startHeroSlider();
	}


	// =====================================================
	// COMPLAINT DETAILS MODAL
	// =====================================================

	function openComplaintDetails(issueId) {

		if (!complaintDetailsModal) {
			return;
		}

		const issueIdElement =
			complaintDetailsModal.querySelector(
				".detail-issue-id"
			);

		if (issueIdElement && issueId) {

			issueIdElement.textContent =
				issueId;
		}


		complaintDetailsModal.classList.add(
			"active"
		);

		complaintDetailsModal.setAttribute(
			"aria-hidden",
			"false"
		);

		document.body.classList.add(
			"modal-open"
		);

		stopHeroSlider();
	}


	function closeComplaintDetails() {

		if (!complaintDetailsModal) {
			return;
		}

		complaintDetailsModal.classList.remove(
			"active"
		);

		complaintDetailsModal.setAttribute(
			"aria-hidden",
			"true"
		);

		document.body.classList.remove(
			"modal-open"
		);

		startHeroSlider();
	}


	// =====================================================
	// REPORT BUTTONS
	// =====================================================

	const reportProblemButton =
		document.getElementById(
			"reportProblemButton"
		);

	const heroReportButton =
		document.getElementById(
			"heroReportButton"
		);


	if (reportProblemButton) {

		reportProblemButton.addEventListener(
			"click",
			openReportModal
		);

	}


	if (heroReportButton) {

		heroReportButton.addEventListener(
			"click",
			openReportModal
		);

	}


	const allHeroReportButtons =
		document.querySelectorAll(
			".hero-report-button"
		);


	allHeroReportButtons.forEach((button) => {

		button.addEventListener(
			"click",
			openReportModal
		);

	});


	if (closeReportModal) {

		closeReportModal.addEventListener(
			"click",
			closeReportModalFunction
		);

	}


	if (cancelReportButton) {

		cancelReportButton.addEventListener(
			"click",
			closeReportModalFunction
		);

	}


	// =====================================================
	// COMPLAINT VIEW BUTTONS
	// =====================================================

	const complaintViewButtons =
		document.querySelectorAll(
			".view-complaint-button"
		);


	complaintViewButtons.forEach((button) => {

		button.addEventListener(
			"click",
			() => {

				const issueId =
					button.dataset.issue;

				openComplaintDetails(
					issueId
				);

			}
		);

	});


	if (closeComplaintModal) {

		closeComplaintModal.addEventListener(
			"click",
			closeComplaintDetails
		);

	}

	// =====================================================
	// TRACK COMPLAINT
	// =====================================================

	const trackNowButton =
		document.getElementById(
			"trackNowButton"
		);

	const issueIdInput =
		document.getElementById(
			"issueIdInput"
		);


	function trackComplaint() {

		if (!issueIdInput) {
			return;
		}

		const issueId =
			issueIdInput.value
				.trim()
				.toUpperCase();


		if (!issueId) {

			alert(
				"Please enter an Issue ID."
			);

			issueIdInput.focus();

			return;
		}


		const matchingButton =
			document.querySelector(
				`.view-complaint-button[data-issue="${issueId}"]`
			);


		if (matchingButton) {

			openComplaintDetails(
				issueId
			);

			return;
		}


		alert(
			`No complaint found for ${issueId}.`
		);
	}


	if (trackNowButton) {

		trackNowButton.addEventListener(
			"click",
			trackComplaint
		);

	}


	if (issueIdInput) {

		issueIdInput.addEventListener(
			"keydown",
			(event) => {

				if (event.key === "Enter") {

					event.preventDefault();

					trackComplaint();

				}

			}
		);

	}


	// =====================================================
	// QUICK ACTION - TRACK
	// =====================================================

	const trackComplaintButton =
		document.getElementById(
			"trackComplaintButton"
		);


	if (trackComplaintButton) {

		trackComplaintButton.addEventListener(
			"click",
			() => {

				const trackSection =
					document.querySelector(
						".track-complaint-section"
					);


				if (trackSection) {

					trackSection.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});

				}


				setTimeout(() => {

					if (issueIdInput) {
						issueIdInput.focus();
					}

				}, 500);

			}
		);

	}


	// =====================================================
	// QUICK ACTION - MY COMPLAINTS
	// =====================================================

	const myComplaintsButton =
		document.getElementById(
			"myComplaintsButton"
		);


	if (myComplaintsButton) {

		myComplaintsButton.addEventListener(
			"click",
			() => {

				const complaintsSection =
					document.querySelector(
						".recent-complaints-section"
					);


				if (complaintsSection) {

					complaintsSection.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});

				}

			}
		);

	}


	// =====================================================
	// QUICK ACTION - COMMUNITY ANNOUNCEMENTS
	// =====================================================

	const communityAnnouncementsButton =
		document.getElementById(
			"communityAnnouncementsButton"
		);


	if (communityAnnouncementsButton) {

		communityAnnouncementsButton.addEventListener(
			"click",
			() => {

				const announcementSection =
					document.querySelector(
						".community-announcements-section"
					);


				if (announcementSection) {

					announcementSection.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});

				}

			}
		);

	}


	// =====================================================
	// VIEW MAP
	// =====================================================

	const viewMapButton =
		document.getElementById(
			"viewMapButton"
		);


	if (viewMapButton) {

		viewMapButton.addEventListener(
			"click",
			() => {

				const nearbyMap =
					document.querySelector(
						".nearby-map"
					);


				if (nearbyMap) {

					nearbyMap.scrollIntoView({
						behavior: "smooth",
						block: "center"
					});

				}

			}
		);

	}


	// =====================================================
	// VIEW ALL BUTTONS
	// =====================================================

	const viewAllButtons =
		document.querySelectorAll(
			".view-all-button"
		);


	viewAllButtons.forEach((button) => {

		button.addEventListener(
			"click",
			() => {

				const section =
					button.closest(
						"section"
					);


				if (section) {

					const table =
						section.querySelector(
							".complaints-table-wrapper"
						);


					if (table) {

						table.scrollIntoView({
							behavior: "smooth",
							block: "start"
						});

					}

				}

			}
		);

	});


	// =====================================================
	// RATING SYSTEM
	// =====================================================

	const ratingStars =
		document.querySelectorAll(
			".rating-star"
		);


	let selectedRating = 0;


	function updateStars(rating) {

		ratingStars.forEach((star) => {

			const starRating =
				Number(
					star.dataset.rating
				);


			if (starRating <= rating) {

				star.textContent = "★";

			} else {

				star.textContent = "☆";

			}

		});

	}


	ratingStars.forEach((star) => {

		star.addEventListener(
			"mouseenter",
			() => {

				const rating =
					Number(
						star.dataset.rating
					);

				updateStars(rating);

			}
		);


		star.addEventListener(
			"mouseleave",
			() => {

				updateStars(
					selectedRating
				);

			}
		);


		star.addEventListener(
			"click",
			() => {

				selectedRating =
					Number(
						star.dataset.rating
					);

				updateStars(
					selectedRating
				);

			}
		);

	});


	// =====================================================
	// GIVE FEEDBACK
	// =====================================================

	const giveFeedbackButton =
		document.getElementById(
			"giveFeedbackButton"
		);


	if (giveFeedbackButton) {

		giveFeedbackButton.addEventListener(
			"click",
			() => {

				if (selectedRating === 0) {

					alert(
						"Please select a rating first."
					);

					return;
				}


				alert(
					`Thank you! Your ${selectedRating}-star feedback has been recorded.`
				);

			}
		);

	}

	// =====================================================
	// SUBMIT ISSUE
	// =====================================================

	const submitIssueButton =
		document.getElementById(
			"submitIssueButton"
		);

	const issueCategory =
		document.getElementById(
			"issueCategory"
		);

	const issueDescription =
		document.getElementById(
			"issueDescription"
		);

	const issuePhoto =
		document.getElementById(
			"issuePhoto"
		);


	if (submitIssueButton) {

		submitIssueButton.addEventListener(
			"click",
			() => {

				const category =
					issueCategory
						? issueCategory.value
						: "";


				const description =
					issueDescription
						? issueDescription.value.trim()
						: "";


				if (!category) {

					alert(
						"Please select an issue category."
					);

					if (issueCategory) {
						issueCategory.focus();
					}

					return;
				}


				if (!description) {

					alert(
						"Please describe the problem."
					);

					if (issueDescription) {
						issueDescription.focus();
					}

					return;
				}


				const hasPhoto =
					issuePhoto &&
					issuePhoto.files &&
					issuePhoto.files.length > 0;


				console.log(
					"Issue submitted:",
					{
						category,
						description,
						photoAdded: hasPhoto
					}
				);


				alert(
					"Your issue has been submitted successfully!"
				);


				// Reset form

				if (issueCategory) {
					issueCategory.value = "";
				}

				if (issueDescription) {
					issueDescription.value = "";
				}

				if (issuePhoto) {
					issuePhoto.value = "";
				}


				closeReportModalFunction();

			}
		);

	}


	// =====================================================
	// CLOSE MODAL OUTSIDE CLICK
	// =====================================================

	if (reportIssueModal) {

		reportIssueModal.addEventListener(
			"click",
			(event) => {

				if (
					event.target ===
					reportIssueModal
				) {

					closeReportModalFunction();

				}

			}
		);

	}


	if (complaintDetailsModal) {

		complaintDetailsModal.addEventListener(
			"click",
			(event) => {

				if (
					event.target ===
					complaintDetailsModal
				) {

					closeComplaintDetails();

				}

			}
		);

	}


	// =====================================================
	// ESC KEY
	// =====================================================

	document.addEventListener(
		"keydown",
		(event) => {

			if (event.key !== "Escape") {
				return;
			}


			if (
				reportIssueModal &&
				reportIssueModal.classList.contains(
					"active"
				)
			) {

				closeReportModalFunction();

			}


			if (
				complaintDetailsModal &&
				complaintDetailsModal.classList.contains(
					"active"
				)
			) {

				closeComplaintDetails();

			}

		}
	);


	// =====================================================
	// NOTIFICATION BUTTON
	// =====================================================

	const notificationButton =
		document.querySelector(
			".notification-button"
		);


	if (notificationButton) {

		notificationButton.addEventListener(
			"click",
			() => {

				const updatesSection =
					document.querySelector(
						".latest-updates-section"
					);


				if (updatesSection) {

					updatesSection.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});

				}

			}
		);

	}


	// =====================================================
	// INITIAL ARIA STATES
	// =====================================================

	if (reportIssueModal) {

		reportIssueModal.setAttribute(
			"aria-hidden",
			"true"
		);

	}


	if (complaintDetailsModal) {

		complaintDetailsModal.setAttribute(
			"aria-hidden",
			"true"
		);

	}


	// =====================================================
	// IMAGE ERROR HANDLING
	// =====================================================

	const images =
		document.querySelectorAll(
			"img"
		);


	images.forEach((image) => {

		image.addEventListener(
			"error",
			() => {

				image.classList.add(
					"image-load-error"
				);

			}
		);

	});


	console.log(
		"CivicBuzz Client Dashboard loaded successfully."
	);

	// =====================================================
	// DARK MODE TOGGLE
	// =====================================================

	const themeToggleButton =
		document.getElementById(
			"themeToggleButton"
		);

	const themeToggleIcon =
		document.getElementById(
			"themeToggleIcon"
		);


	// =====================================================
	// LOAD SAVED THEME
	// =====================================================

	const savedTheme =
		localStorage.getItem(
			"civicbuzz-theme"
		);


	if (savedTheme === "dark") {

		document.body.classList.add(
			"dark-mode"
		);


		if (themeToggleIcon) {

			themeToggleIcon.textContent =
				"☀️";

		}


		if (themeToggleButton) {

			themeToggleButton.setAttribute(
				"aria-label",
				"Switch to light mode"
			);

			themeToggleButton.setAttribute(
				"title",
				"Light Mode"
			);

		}

	}


	// =====================================================
	// TOGGLE THEME
	// =====================================================

	if (themeToggleButton) {

		themeToggleButton.addEventListener(
			"click",
			() => {

				const isDarkMode =
					document.body.classList.toggle(
						"dark-mode"
					);


				localStorage.setItem(
					"civicbuzz-theme",
					isDarkMode
						? "dark"
						: "light"
				);


				if (themeToggleIcon) {

					themeToggleIcon.textContent =
						isDarkMode
							? "☀️"
							: "🌙";

				}


				themeToggleButton.setAttribute(
					"aria-label",
					isDarkMode
						? "Switch to light mode"
						: "Switch to dark mode"
				);


				themeToggleButton.setAttribute(
					"title",
					isDarkMode
						? "Light Mode"
						: "Dark Mode"
				);

			}
		);

	}


	// =====================================================
	// MAP IMAGE FALLBACK
	// =====================================================

	const nearbyMapImage =
		document.getElementById(
			"nearbyMapImage"
		);


	if (nearbyMapImage) {

		nearbyMapImage.addEventListener(
			"error",
			() => {

				nearbyMapImage.src =
					"data:image/svg+xml;charset=UTF-8," +
					encodeURIComponent(`
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="900"
                            height="500"
                            viewBox="0 0 900 500"
                        >

                            <rect
                                width="900"
                                height="500"
                                fill="#e8eef7"
                            />

                            <path
                                d="M0 120
                                   C180 150 250 80 400 135
                                   S650 200 900 120"
                                fill="none"
                                stroke="#ffffff"
                                stroke-width="42"
                            />

                            <path
                                d="M100 500
                                   C180 390 300 350 420 370
                                   S700 410 900 300"
                                fill="none"
                                stroke="#ffffff"
                                stroke-width="35"
                            />

                            <path
                                d="M520 0
                                   C480 100 510 190 490 280
                                   S500 420 540 500"
                                fill="none"
                                stroke="#ffffff"
                                stroke-width="28"
                            />

                            <path
                                d="M0 120
                                   C180 150 250 80 400 135
                                   S650 200 900 120"
                                fill="none"
                                stroke="#d4ddea"
                                stroke-width="3"
                            />

                            <path
                                d="M100 500
                                   C180 390 300 350 420 370
                                   S700 410 900 300"
                                fill="none"
                                stroke="#d4ddea"
                                stroke-width="3"
                            />

                            <circle
                                cx="265"
                                cy="175"
                                r="10"
                                fill="#ef3f70"
                            />

                            <circle
                                cx="650"
                                cy="150"
                                r="10"
                                fill="#ef3f70"
                            />

                            <circle
                                cx="620"
                                cy="350"
                                r="10"
                                fill="#ef3f70"
                            />

                        </svg>
                    `);

			}
		);

	}


	// =====================================================
	// FOOTER LINKS
	// =====================================================

	function setupFooterLinks() {

		const footerLinks =
			document.querySelectorAll(
				"footer a"
			);


		footerLinks.forEach((link) => {

			link.addEventListener(
				"click",
				(event) => {

					const href =
						link.getAttribute(
							"href"
						);


					if (
						!href ||
						href === "#"
					) {

						event.preventDefault();

					}

				}
			);

		});

	}


	setupFooterLinks();


	// =====================================================
	// LANGUAGE SELECTOR
	// =====================================================

	const languageSelector =
		document.querySelector(
			".language-selector"
		);

	const languageButton =
		document.getElementById(
			"languageButton"
		);

	const languageDropdown =
		document.getElementById(
			"languageDropdown"
		);

	const languageCurrent =
		document.getElementById(
			"languageCurrent"
		);

	const languageOptions =
		document.querySelectorAll(
			".language-option"
		);


	// =====================================================
	// LANGUAGE DROPDOWN OPEN / CLOSE
	// =====================================================

	if (
		languageButton &&
		languageSelector
	) {

		languageButton.addEventListener(
			"click",
			(event) => {

				event.stopPropagation();


				const isOpen =
					languageSelector.classList.contains(
						"open"
					);


				languageSelector.classList.toggle(
					"open",
					!isOpen
				);


				languageButton.setAttribute(
					"aria-expanded",
					String(!isOpen)
				);

			}
		);


		document.addEventListener(
			"click",
			(event) => {

				if (
					!languageSelector.contains(
						event.target
					)
				) {

					languageSelector.classList.remove(
						"open"
					);


					languageButton.setAttribute(
						"aria-expanded",
						"false"
					);

				}

			}
		);

	}


	// =====================================================
	// COMPLETE TRANSLATION DICTIONARY
	// =====================================================


	const translations = {

		/* =====================================================
   HERO SLIDER - SLIDE 1
   ===================================================== */

		"Together, let's build": {
			en: "Together, let's build",
			hi: "आइए मिलकर बनाएं"
		},

		"a better and cleaner city!": {
			en: "a better and cleaner city!",
			hi: "एक बेहतर और स्वच्छ शहर!"
		},

		"Report issues. Track progress.": {
			en: "Report issues. Track progress.",
			hi: "समस्याओं की रिपोर्ट करें। प्रगति ट्रैक करें।"
		},

		"Make your city better.": {
			en: "Make your city better.",
			hi: "अपने शहर को बेहतर बनाएं।"
		},

		"Report a Problem": {
			en: "Report a Problem",
			hi: "समस्या की रिपोर्ट करें"
		},


		/* =====================================================
		   HERO SLIDER - SLIDE 2
		   ===================================================== */

		"See a problem?": {
			en: "See a problem?",
			hi: "कोई समस्या दिखाई दी?"
		},

		"Let your voice be heard.": {
			en: "Let your voice be heard.",
			hi: "अपनी आवाज़ उठाएं।"
		},

		"Report civic issues in just": {
			en: "Report civic issues in just",
			hi: "नागरिक समस्याओं की रिपोर्ट करें"
		},

		"a few simple steps.": {
			en: "a few simple steps.",
			hi: "कुछ आसान चरणों में।"
		},


		/* =====================================================
		   HERO SLIDER - SLIDE 3
		   ===================================================== */

		"Your complaint": {
			en: "Your complaint",
			hi: "आपकी शिकायत"
		},

		"can make a difference.": {
			en: "can make a difference.",
			hi: "बदलाव ला सकती है।"
		},

		"Track every update and": {
			en: "Track every update and",
			hi: "हर अपडेट को ट्रैक करें और"
		},

		"stay informed.": {
			en: "stay informed.",
			hi: "जानकारी से जुड़े रहें।"
		},

		"Track Your Complaint": {
			en: "Track Your Complaint",
			hi: "अपनी शिकायत ट्रैक करें"
		},


		/* =====================================================
		   HERO SLIDER - SLIDES 4 TO 9
		   ===================================================== */

		"Better cities start": {
			en: "Better cities start",
			hi: "बेहतर शहरों की शुरुआत"
		},

		"with responsible citizens.": {
			en: "with responsible citizens.",
			hi: "जिम्मेदार नागरिकों से होती है।"
		},

		"Together we can create": {
			en: "Together we can create",
			hi: "आइए मिलकर बनाएं"
		},

		"cleaner and safer communities.": {
			en: "cleaner and safer communities.",
			hi: "स्वच्छ और सुरक्षित समुदाय।"
		},


		/* -----------------------------------------------------
		   SLIDE 5
		   ----------------------------------------------------- */

		"Your city,": {
			en: "Your city,",
			hi: "आपका शहर,"
		},

		"your responsibility.": {
			en: "your responsibility.",
			hi: "आपकी ज़िम्मेदारी।"
		},

		"Spot an issue?": {
			en: "Spot an issue?",
			hi: "कोई समस्या दिखाई दी?"
		},

		"Report it before it gets worse.": {
			en: "Report it before it gets worse.",
			hi: "बढ़ने से पहले उसकी रिपोर्ट करें।"
		},


		/* -----------------------------------------------------
		   SLIDE 6
		   ----------------------------------------------------- */

		"Stay updated": {
			en: "Stay updated",
			hi: "हर अपडेट से जुड़े रहें"
		},

		"on every complaint.": {
			en: "on every complaint.",
			hi: "अपनी हर शिकायत पर।"
		},

		"Know what's happening": {
			en: "Know what's happening",
			hi: "जानें क्या हो रहा है"
		},

		"after you report an issue.": {
			en: "after you report an issue.",
			hi: "समस्या की रिपोर्ट करने के बाद।"
		},


		/* -----------------------------------------------------
		   SLIDE 7
		   ----------------------------------------------------- */

		"Small reports": {
			en: "Small reports",
			hi: "छोटी-सी रिपोर्ट"
		},

		"create big changes.": {
			en: "create big changes.",
			hi: "बड़ा बदलाव ला सकती है।"
		},

		"One responsible citizen": {
			en: "One responsible citizen",
			hi: "एक जिम्मेदार नागरिक"
		},

		"can inspire an entire community.": {
			en: "can inspire an entire community.",
			hi: "पूरे समुदाय को प्रेरित कर सकता है।"
		},


		/* -----------------------------------------------------
		   SLIDE 8
		   ----------------------------------------------------- */

		"Cleaner streets.": {
			en: "Cleaner streets.",
			hi: "स्वच्छ सड़कें।"
		},

		"Safer communities.": {
			en: "Safer communities.",
			hi: "सुरक्षित समुदाय।"
		},

		"Your reports help authorities": {
			en: "Your reports help authorities",
			hi: "आपकी रिपोर्ट अधिकारियों को"
		},

		"identify problems faster.": {
			en: "identify problems faster.",
			hi: "समस्याओं की पहचान जल्दी करने में मदद करती है।"
		},


		/* -----------------------------------------------------
		   SLIDE 9
		   ----------------------------------------------------- */

		"Together,": {
			en: "Together,",
			hi: "मिलकर,"
		},

		"we can make a difference.": {
			en: "we can make a difference.",
			hi: "हम बदलाव ला सकते हैं।"
		},

		"Be the voice of your community": {
			en: "Be the voice of your community",
			hi: "अपने समुदाय की आवाज़ बनें"
		},

		"and help build a better city.": {
			en: "and help build a better city.",
			hi: "और एक बेहतर शहर बनाने में मदद करें।"
		},



		"Making every civic issue visible,": {
			en: "Making every civic issue visible,",
			hi: "हर नागरिक समस्या को दृश्यमान बनाना,"
		},

		"actionable and accountable.": {
			en: "actionable and accountable.",
			hi: "कार्रवाई योग्य और जवाबदेह बनाना।"
		},

		"Empowering citizens to report problems": {
			en: "Empowering citizens to report problems",
			hi: "नागरिकों को समस्याओं की रिपोर्ट करने में सक्षम बनाना"
		},

		"and build better communities together.": {
			en: "and build better communities together.",
			hi: "और मिलकर बेहतर समुदायों का निर्माण करना।"
		},

		/* =====================================================
		   NAVBAR
		   ===================================================== */

		"Your Voice. Our Responsibility.": {
			en: "Your Voice. Our Responsibility.",
			hi: "आपकी आवाज़। हमारी ज़िम्मेदारी।"
		},

		"Home": {
			en: "Home",
			hi: "होम"
		},

		"Report Issue": {
			en: "Report Issue",
			hi: "समस्या दर्ज करें"
		},

		"Track Issue": {
			en: "Track Issue",
			hi: "समस्या ट्रैक करें"
		},

		"Map": {
			en: "Map",
			hi: "मानचित्र"
		},

		"Tender": {
			en: "Tender",
			hi: "टेंडर"
		},

		"Contact Us": {
			en: "Contact Us",
			hi: "संपर्क करें"
		},

		"Need Help": {
			en: "Need Help",
			hi: "मदद चाहिए?"
		},

		"Notifications": {
			en: "Notifications",
			hi: "सूचनाएँ"
		},

		"English": {
			en: "English",
			hi: "अंग्रेज़ी"
		},

		"Hindi": {
			en: "Hindi",
			hi: "हिन्दी"
		},


		/* =====================================================
		   PROFILE
		   ===================================================== */

		"Aditya Kumar Shyam": {
			en: "Aditya Kumar Shyam",
			hi: "आदित्य कुमार श्याम"
		},

		"Citizen Account": {
			en: "Citizen Account",
			hi: "नागरिक खाता"
		},

		"UserName": {
			en: "UserName",
			hi: "उपयोगकर्ता"
		},


		/* =====================================================
		   HERO 1
		   ===================================================== */

		"Together, let's build": {
			en: "Together, let's build",
			hi: "आइए मिलकर बनाएं"
		},

		"a better and cleaner city!": {
			en: "a better and cleaner city!",
			hi: "एक बेहतर और स्वच्छ शहर!"
		},

		"Report issues. Track progress.": {
			en: "Report issues. Track progress.",
			hi: "समस्याओं की रिपोर्ट करें। प्रगति ट्रैक करें।"
		},

		"Make your city better.": {
			en: "Make your city better.",
			hi: "अपने शहर को बेहतर बनाएं।"
		},


		/* =====================================================
		   HERO 2
		   ===================================================== */

		"See a problem?": {
			en: "See a problem?",
			hi: "कोई समस्या दिखाई दी?"
		},

		"Let your voice be heard.": {
			en: "Let your voice be heard.",
			hi: "अपनी आवाज़ उठाएं।"
		},

		"Report civic issues in just": {
			en: "Report civic issues in just",
			hi: "नागरिक समस्याओं की रिपोर्ट करें"
		},

		"a few simple steps.": {
			en: "a few simple steps.",
			hi: "कुछ आसान चरणों में।"
		},


		/* =====================================================
		   HERO 3
		   ===================================================== */

		"Your complaint": {
			en: "Your complaint",
			hi: "आपकी शिकायत"
		},

		"can make a difference.": {
			en: "can make a difference.",
			hi: "बदलाव ला सकती है।"
		},

		"Track every update and": {
			en: "Track every update and",
			hi: "हर अपडेट को ट्रैक करें और"
		},

		"stay informed.": {
			en: "stay informed.",
			hi: "जानकारी से जुड़े रहें।"
		},

		"Track Your Complaint": {
			en: "Track Your Complaint",
			hi: "अपनी शिकायत ट्रैक करें"
		},


		/* =====================================================
		   HERO 4
		   ===================================================== */

		"Better cities start": {
			en: "Better cities start",
			hi: "बेहतर शहरों की शुरुआत"
		},

		"with responsible citizens.": {
			en: "with responsible citizens.",
			hi: "जिम्मेदार नागरिकों से होती है।"
		},

		"Together we can create": {
			en: "Together we can create",
			hi: "आइए मिलकर बनाएं"
		},

		"cleaner and safer communities.": {
			en: "cleaner and safer communities.",
			hi: "स्वच्छ और सुरक्षित समुदाय।"
		},


		/* =====================================================
		   HERO 5
		   ===================================================== */

		"Together, we can make a difference.": {
			en: "Together, we can make a difference.",
			hi: "आइए मिलकर बदलाव लाएं।"
		},

		"Be the voice of your community": {
			en: "Be the voice of your community",
			hi: "अपने समुदाय की आवाज़ बनें"
		},

		"and help build a better city.": {
			en: "and help build a better city.",
			hi: "और एक बेहतर शहर बनाने में मदद करें।"
		},


		/* =====================================================
		   HERO - ALTERNATE TEXTS
		   ===================================================== */

		"Stronger Communities, Better Tomorrow": {
			en: "Stronger Communities, Better Tomorrow",
			hi: "मजबूत समुदाय, बेहतर कल"
		},

		"See It.": {
			en: "See It.",
			hi: "देखें।"
		},

		"Report It.": {
			en: "Report It.",
			hi: "रिपोर्ट करें।"
		},

		"We'll": {
			en: "We'll",
			hi: "हम"
		},

		"Fix It.": {
			en: "Fix It.",
			hi: "इसे ठीक करेंगे।"
		},

		"CivicBuzz helps you report civic issues in your area and track action by the responsible authorities.": {
			en: "CivicBuzz helps you report civic issues in your area and track action by the responsible authorities.",
			hi: "CivicBuzz आपको अपने क्षेत्र की नागरिक समस्याओं की रिपोर्ट करने और संबंधित अधिकारियों द्वारा की जा रही कार्रवाई को ट्रैक करने में मदद करता है।"
		},

		"Report an Issue": {
			en: "Report an Issue",
			hi: "समस्या की रिपोर्ट करें"
		},

		"View Map": {
			en: "View Map",
			hi: "मानचित्र देखें"
		},


		/* =====================================================
		   HERO 6
		   ===================================================== */

		"Better Roads Start With Better Reporting": {
			en: "Better Roads Start With Better Reporting",
			hi: "बेहतर सड़कें बेहतर रिपोर्टिंग से शुरू होती हैं"
		},

		"Spot It.": {
			en: "Spot It.",
			hi: "समस्या पहचानें।"
		},

		"Track the": {
			en: "Track the",
			hi: "ट्रैक करें"
		},

		"Progress.": {
			en: "Progress.",
			hi: "प्रगति।"
		},

		"Turn everyday civic problems into structured reports that can reach the right responsible unit.": {
			en: "Turn everyday civic problems into structured reports that can reach the right responsible unit.",
			hi: "रोज़मर्रा की नागरिक समस्याओं को ऐसी व्यवस्थित रिपोर्ट में बदलें जो सही जिम्मेदार इकाई तक पहुँच सके।"
		},


		/* =====================================================
		   HERO 7
		   ===================================================== */

		"Citizens At The Center": {
			en: "Citizens At The Center",
			hi: "नागरिक सबसे महत्वपूर्ण हैं"
		},

		"Your Voice.": {
			en: "Your Voice.",
			hi: "आपकी आवाज़।"
		},

		"Your Community.": {
			en: "Your Community.",
			hi: "आपका समुदाय।"
		},

		"Your Impact.": {
			en: "Your Impact.",
			hi: "आपका प्रभाव।"
		},

		"Make civic problems visible and help communities understand what needs attention.": {
			en: "Make civic problems visible and help communities understand what needs attention.",
			hi: "नागरिक समस्याओं को सामने लाएं और समुदायों को यह समझने में मदद करें कि किस समस्या पर ध्यान देने की आवश्यकता है।"
		},


		/* =====================================================
		   HERO 8
		   ===================================================== */

		"Know What Is Happening Around You": {
			en: "Know What Is Happening Around You",
			hi: "अपने आसपास क्या हो रहा है जानें"
		},

		"Find Issues.": {
			en: "Find Issues.",
			hi: "समस्याएं खोजें।"
		},

		"See Patterns.": {
			en: "See Patterns.",
			hi: "पैटर्न देखें।"
		},

		"Take Action.": {
			en: "Take Action.",
			hi: "कार्रवाई करें।"
		},

		"Explore civic issues on the map and understand where problems are being reported.": {
			en: "Explore civic issues on the map and understand where problems are being reported.",
			hi: "मानचित्र पर नागरिक समस्याओं को देखें और समझें कि समस्याओं की रिपोर्ट कहाँ की जा रही है।"
		},


		/* =====================================================
		   HERO 9
		   ===================================================== */

		"Designed For Diverse Communities": {
			en: "Designed For Diverse Communities",
			hi: "विविध समुदायों के लिए बनाया गया"
		},

		"Report In Your": {
			en: "Report In Your",
			hi: "अपनी"
		},

		"Own Language.": {
			en: "Own Language.",
			hi: "भाषा में रिपोर्ट करें।"
		},

		"CivicBuzz is designed to accept civic issues through text, voice, or images across languages.": {
			en: "CivicBuzz is designed to accept civic issues through text, voice, or images across languages.",
			hi: "CivicBuzz को विभिन्न भाषाओं में टेक्स्ट, आवाज़ या तस्वीरों के माध्यम से नागरिक समस्याएँ स्वीकार करने के लिए बनाया गया है।"
		},

		"Better Cities.": {
			en: "Better Cities.",
			hi: "बेहतर शहर।"
		},

		"Better Living.": {
			en: "Better Living.",
			hi: "बेहतर जीवन।"
		},

		"Help make your surroundings safer, cleaner and better through meaningful civic participation.": {
			en: "Help make your surroundings safer, cleaner and better through meaningful civic participation.",
			hi: "सार्थक नागरिक भागीदारी के माध्यम से अपने आसपास के क्षेत्र को सुरक्षित, स्वच्छ और बेहतर बनाने में मदद करें।"
		},


		/* =====================================================
		   HERO 10
		   ===================================================== */

		"Community Powered": {
			en: "Community Powered",
			hi: "समुदाय की शक्ति"
		},

		"Every Report": {
			en: "Every Report",
			hi: "हर रिपोर्ट"
		},

		"Makes A Difference.": {
			en: "Makes A Difference.",
			hi: "बदलाव लाती है।"
		},

		"When citizens speak up and communities work together, real change becomes possible.": {
			en: "When citizens speak up and communities work together, real change becomes possible.",
			hi: "जब नागरिक अपनी आवाज़ उठाते हैं और समुदाय मिलकर काम करते हैं, तब वास्तविक बदलाव संभव होता है।"
		},


		/* =====================================================
		   HERO 11
		   ===================================================== */

		"Together For A Better Tomorrow": {
			en: "Together For A Better Tomorrow",
			hi: "बेहतर कल के लिए साथ मिलकर"
		},

		"Real Action.": {
			en: "Real Action.",
			hi: "वास्तविक कार्रवाई।"
		},

		"CivicBuzz connects citizens, communities and responsible authorities to turn reports into visible action.": {
			en: "CivicBuzz connects citizens, communities and responsible authorities to turn reports into visible action.",
			hi: "CivicBuzz नागरिकों, समुदायों और जिम्मेदार अधिकारियों को जोड़कर रिपोर्ट को वास्तविक कार्रवाई में बदलता है।"
		},


		/* =====================================================
		   QUICK ACTIONS
		   ===================================================== */

		"What would you like to do today?": {
			en: "What would you like to do today?",
			hi: "आज आप क्या करना चाहेंगे?"
		},

		"Report a Problem": {
			en: "Report a Problem",
			hi: "समस्या की रिपोर्ट करें"
		},

		"Submit a new issue": {
			en: "Submit a new issue",
			hi: "नई समस्या दर्ज करें"
		},

		"with photos & details": {
			en: "with photos & details",
			hi: "फोटो और विवरण के साथ"
		},

		"Track Complaint": {
			en: "Track Complaint",
			hi: "शिकायत ट्रैक करें"
		},

		"Track status using": {
			en: "Track status using",
			hi: "स्थिति ट्रैक करें"
		},

		"Issue ID": {
			en: "Issue ID",
			hi: "समस्या आईडी"
		},

		"My Complaints": {
			en: "My Complaints",
			hi: "मेरी शिकायतें"
		},

		"View all your": {
			en: "View all your",
			hi: "अपनी सभी"
		},

		"submitted issues": {
			en: "submitted issues",
			hi: "दर्ज की गई समस्याएँ देखें"
		},

		"Community Announcements": {
			en: "Community Announcements",
			hi: "सामुदायिक घोषणाएँ"
		},

		"View important updates": {
			en: "View important updates",
			hi: "महत्वपूर्ण अपडेट देखें"
		},

		"from your local authority": {
			en: "from your local authority",
			hi: "अपने स्थानीय प्राधिकरण से"
		},


		/* =====================================================
		   COMPLAINT SUMMARY
		   ===================================================== */

		"My Complaint Summary": {
			en: "My Complaint Summary",
			hi: "मेरी शिकायतों का सारांश"
		},

		"View All": {
			en: "View All",
			hi: "सभी देखें"
		},

		"Total Complaints": {
			en: "Total Complaints",
			hi: "कुल शिकायतें"
		},

		"In Progress": {
			en: "In Progress",
			hi: "प्रगति पर"
		},

		"Resolved": {
			en: "Resolved",
			hi: "हल किया गया"
		},

		"Rejected": {
			en: "Rejected",
			hi: "अस्वीकृत"
		},


		/* =====================================================
		   RECENT COMPLAINTS
		   ===================================================== */

		"My Recent Complaints": {
			en: "My Recent Complaints",
			hi: "मेरी हाल की शिकायतें"
		},

		"Problem": {
			en: "Problem",
			hi: "समस्या"
		},

		"Location": {
			en: "Location",
			hi: "स्थान"
		},

		"Status": {
			en: "Status",
			hi: "स्थिति"
		},

		"Date": {
			en: "Date",
			hi: "दिनांक"
		},

		"Action": {
			en: "Action",
			hi: "कार्रवाई"
		},

		"Road Pothole": {
			en: "Road Pothole",
			hi: "सड़क पर गड्ढा"
		},

		"Street Light Not Working": {
			en: "Street Light Not Working",
			hi: "स्ट्रीट लाइट काम नहीं कर रही"
		},

		"Garbage Not Collected": {
			en: "Garbage Not Collected",
			hi: "कचरा एकत्र नहीं किया गया"
		},

		"Garbage Overflow": {
			en: "Garbage Overflow",
			hi: "कचरा जमा होना"
		},

		"Open": {
			en: "Open",
			hi: "खुला"
		},


		/* =====================================================
		   TRACK COMPLAINT
		   ===================================================== */

		"Track Your Complaint": {
			en: "Track Your Complaint",
			hi: "अपनी शिकायत ट्रैक करें"
		},

		"Enter your Issue ID to check current status": {
			en: "Enter your Issue ID to check current status",
			hi: "वर्तमान स्थिति देखने के लिए अपनी समस्या आईडी दर्ज करें"
		},

		"Enter Issue ID (e.g. CB-1024)": {
			en: "Enter Issue ID (e.g. CB-1024)",
			hi: "समस्या आईडी दर्ज करें (जैसे CB-1024)"
		},

		"Track Now": {
			en: "Track Now",
			hi: "अभी ट्रैक करें"
		},


		/* =====================================================
		   NEARBY ISSUES
		   ===================================================== */

		"Issues Around You": {
			en: "Issues Around You",
			hi: "आपके आसपास की समस्याएँ"
		},

		"View on Map": {
			en: "View on Map",
			hi: "मानचित्र पर देखें"
		},

		"150m away • Patia Main Road": {
			en: "150m away • Patia Main Road",
			hi: "150 मीटर दूर • पाटिया मेन रोड"
		},

		"300m away • Kalinga Vihar": {
			en: "300m away • Kalinga Vihar",
			hi: "300 मीटर दूर • कलिंगा विहार"
		},

		"500m away • Jayadev Vihar": {
			en: "500m away • Jayadev Vihar",
			hi: "500 मीटर दूर • जयदेव विहार"
		},


		/* =====================================================
		   FOOTER
		   ===================================================== */

		"Making every civic issue visible,": {
			en: "Making every civic issue visible,",
			hi: "हर नागरिक समस्या को दृश्यमान बनाना,"
		},

		"actionable and accountable.": {
			en: "actionable and accountable.",
			hi: "कार्रवाई योग्य और जवाबदेह बनाना।"
		},

		"Empowering citizens to report problems": {
			en: "Empowering citizens to report problems",
			hi: "नागरिकों को समस्याओं की रिपोर्ट करने में सक्षम बनाना"
		},

		"and build better communities together.": {
			en: "and build better communities together.",
			hi: "और मिलकर बेहतर समुदायों का निर्माण करना।"
		},

		"QUICK LINKS": {
			en: "QUICK LINKS",
			hi: "त्वरित लिंक"
		},

		"CIVIC SERVICES": {
			en: "CIVIC SERVICES",
			hi: "नागरिक सेवाएँ"
		},

		"NEED HELP?": {
			en: "NEED HELP?",
			hi: "मदद चाहिए?"
		},

		"About CivicBuzz": {
			en: "About CivicBuzz",
			hi: "CivicBuzz के बारे में"
		},

		"Road & Potholes": {
			en: "Road & Potholes",
			hi: "सड़क और गड्ढे"
		},

		"Garbage & Sanitation": {
			en: "Garbage & Sanitation",
			hi: "कचरा और स्वच्छता"
		},

		"Street Lights": {
			en: "Street Lights",
			hi: "स्ट्रीट लाइट"
		},

		"Water & Drainage": {
			en: "Water & Drainage",
			hi: "पानी और जल निकासी"
		},

		"Public Infrastructure": {
			en: "Public Infrastructure",
			hi: "सार्वजनिक बुनियादी ढाँचा"
		},

		"FAQs": {
			en: "FAQs",
			hi: "अक्सर पूछे जाने वाले प्रश्न"
		},

		"How to Report": {
			en: "How to Report",
			hi: "रिपोर्ट कैसे करें"
		},

		"How Tracking Works": {
			en: "How Tracking Works",
			hi: "ट्रैकिंग कैसे काम करती है"
		},

		"Contact Support": {
			en: "Contact Support",
			hi: "सहायता से संपर्क करें"
		},

		"Have a question?": {
			en: "Have a question?",
			hi: "कोई सवाल है?"
		},

		"Issues Reported": {
			en: "Issues Reported",
			hi: "रिपोर्ट की गई समस्याएँ"
		},

		"Issues Resolved": {
			en: "Issues Resolved",
			hi: "हल की गई समस्याएँ"
		},

		"Active Citizens": {
			en: "Active Citizens",
			hi: "सक्रिय नागरिक"
		},

		"Communities": {
			en: "Communities",
			hi: "समुदाय"
		},

		"Privacy Policy": {
			en: "Privacy Policy",
			hi: "गोपनीयता नीति"
		},

		"Terms & Conditions": {
			en: "Terms & Conditions",
			hi: "नियम और शर्तें"
		},

		"Accessibility": {
			en: "Accessibility",
			hi: "सुगम्यता"
		},

		"GitHub": {
			en: "GitHub",
			hi: "GitHub"
		},

		"LinkedIn": {
			en: "LinkedIn",
			hi: "LinkedIn"
		},

		"© 2026 CivicBuzz. All rights reserved.": {
			en: "© 2026 CivicBuzz. All rights reserved.",
			hi: "© 2026 CivicBuzz. सर्वाधिकार सुरक्षित।"
		},

		"Built with": {
			en: "Built with",
			hi: "बेहतर समुदायों के लिए"
		},

		"for better communities.": {
			en: "for better communities.",
			hi: "बनाया गया।"
		},


		/* =====================================================
		   CHATBOT
		   ===================================================== */

		"CivicBuzz Assistant": {
			en: "CivicBuzz Assistant",
			hi: "CivicBuzz सहायक"
		},

		"Online": {
			en: "Online",
			hi: "ऑनलाइन"
		},

		"Hi! 👋 I'm the CivicBuzz Assistant.": {
			en: "Hi! 👋 I'm the CivicBuzz Assistant.",
			hi: "नमस्ते! 👋 मैं CivicBuzz सहायक हूँ।"
		},

		"I can help you understand how CivicBuzz works, report an issue, track a complaint, or find the right information.": {
			en: "I can help you understand how CivicBuzz works, report an issue, track a complaint, or find the right information.",
			hi: "मैं आपको CivicBuzz के काम करने के तरीके को समझने, समस्या की रिपोर्ट करने, शिकायत ट्रैक करने या सही जानकारी खोजने में मदद कर सकता हूँ।"
		},

		"How do I report an issue?": {
			en: "How do I report an issue?",
			hi: "मैं समस्या की रिपोर्ट कैसे करूँ?"
		},

		"How can I track my issue?": {
			en: "How can I track my issue?",
			hi: "मैं अपनी समस्या को कैसे ट्रैक करूँ?"
		},

		"How does AI routing work?": {
			en: "How does AI routing work?",
			hi: "AI रूटिंग कैसे काम करती है?"
		},

		"Ask CivicBuzz anything...": {
			en: "Ask CivicBuzz anything...",
			hi: "CivicBuzz से कुछ भी पूछें..."
		}

	};


	// =====================================================
	// SAVE ORIGINAL TEXT
	// =====================================================

	// =====================================================
	// PREPARE ALL TEXT NODES FOR TRANSLATION
	// =====================================================

	function prepareTranslationElements() {

		const walker =
			document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				{
					acceptNode: function (node) {

						const parent =
							node.parentElement;

						if (!parent) {
							return NodeFilter.FILTER_REJECT;
						}

						// Ignore script/style
						if (
							parent.closest("script") ||
							parent.closest("style")
						) {
							return NodeFilter.FILTER_REJECT;
						}

						// Ignore empty whitespace-only nodes
						if (
							!node.nodeValue.trim()
						) {
							return NodeFilter.FILTER_REJECT;
						}

						return NodeFilter.FILTER_ACCEPT;
					}
				}
			);


		const textNodes = [];

		let node;

		while (
			node = walker.nextNode()
		) {

			textNodes.push(node);

		}


		textNodes.forEach((textNode) => {

			if (
				!textNode.hasOwnProperty(
					"__originalText"
				)
			) {

				textNode.__originalText =
					textNode.nodeValue;

			}

		});

	}


	// =====================================================
	// TRANSLATE ALL PAGE TEXT
	// =====================================================

	function translatePage(language) {

		const walker =
			document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				{
					acceptNode: function (node) {

						const parent =
							node.parentElement;

						if (!parent) {
							return NodeFilter.FILTER_REJECT;
						}

						if (
							parent.closest("script") ||
							parent.closest("style")
						) {
							return NodeFilter.FILTER_REJECT;
						}

						if (
							!node.nodeValue.trim()
						) {
							return NodeFilter.FILTER_REJECT;
						}

						return NodeFilter.FILTER_ACCEPT;
					}
				}
			);


		const textNodes = [];

		let node;

		while (
			node = walker.nextNode()
		) {

			textNodes.push(node);

		}


		textNodes.forEach((textNode) => {

			// ---------------------------------------------
			// ORIGINAL ENGLISH TEXT
			// ---------------------------------------------

			if (
				!textNode.hasOwnProperty(
					"__originalText"
				)
			) {

				textNode.__originalText =
					textNode.nodeValue;

			}


			const originalText =
				textNode.__originalText;


			/*
			 * Keep spaces/newlines around the actual text.
			 *
			 * Example:
			 *
			 * "\n    Together, let's build\n    "
			 *
			 * becomes:
			 *
			 * "\n    आइए मिलकर बनाएं\n    "
			 */

			const leadingWhitespace =
				originalText.match(
					/^\s*/
				)?.[0] || "";


			const trailingWhitespace =
				originalText.match(
					/\s*$/
				)?.[0] || "";


			const cleanText =
				originalText
					.trim();


			// ---------------------------------------------
			// HINDI
			// ---------------------------------------------

			if (language === "hi") {

				const translation =
					translations[cleanText];


				if (
					translation &&
					translation.hi
				) {

					textNode.nodeValue =
						leadingWhitespace +
						translation.hi +
						trailingWhitespace;

				}

			}


			// ---------------------------------------------
			// ENGLISH
			// ---------------------------------------------

			else {

				textNode.nodeValue =
					originalText;

			}

		});


		// =================================================
		// TRANSLATE INPUT PLACEHOLDERS
		// =================================================

		const translatableInputs =
			document.querySelectorAll(
				"[placeholder]"
			);


		translatableInputs.forEach(
			(input) => {

				if (
					!input.hasAttribute(
						"data-original-placeholder"
					)
				) {

					input.setAttribute(
						"data-original-placeholder",
						input.getAttribute(
							"placeholder"
						)
					);

				}


				const originalPlaceholder =
					input.getAttribute(
						"data-original-placeholder"
					);


				if (language === "hi") {

					const translation =
						translations[
						originalPlaceholder
						];


					if (
						translation &&
						translation.hi
					) {

						input.setAttribute(
							"placeholder",
							translation.hi
						);

					}

				} else {

					input.setAttribute(
						"placeholder",
						originalPlaceholder
					);

				}

			}
		);


		// =================================================
		// TRANSLATE BUTTON / IMAGE ARIA LABELS
		// =================================================

		const ariaElements =
			document.querySelectorAll(
				"[aria-label]"
			);


		ariaElements.forEach(
			(element) => {

				if (
					!element.hasAttribute(
						"data-original-aria-label"
					)
				) {

					element.setAttribute(
						"data-original-aria-label",
						element.getAttribute(
							"aria-label"
						)
					);

				}


				const originalAriaLabel =
					element.getAttribute(
						"data-original-aria-label"
					);


				if (language === "hi") {

					const translation =
						translations[
						originalAriaLabel
						];


					if (
						translation &&
						translation.hi
					) {

						element.setAttribute(
							"aria-label",
							translation.hi
						);

					}

				} else {

					element.setAttribute(
						"aria-label",
						originalAriaLabel
					);

				}

			}
		);


		// =================================================
		// TRANSLATE TITLE ATTRIBUTES
		// =================================================

		const titleElements =
			document.querySelectorAll(
				"[title]"
			);


		titleElements.forEach(
			(element) => {

				if (
					!element.hasAttribute(
						"data-original-title"
					)
				) {

					element.setAttribute(
						"data-original-title",
						element.getAttribute(
							"title"
						)
					);

				}


				const originalTitle =
					element.getAttribute(
						"data-original-title"
					);


				if (language === "hi") {

					const translation =
						translations[
						originalTitle
						];


					if (
						translation &&
						translation.hi
					) {

						element.setAttribute(
							"title",
							translation.hi
						);

					}

				} else {

					element.setAttribute(
						"title",
						originalTitle
					);

				}

			}
		);


		// =================================================
		// UPDATE LANGUAGE BUTTON
		// =================================================

		if (languageCurrent) {

			languageCurrent.textContent =
				language === "hi"
					? "हिन्दी"
					: "English";

		}


		// =================================================
		// ACTIVE LANGUAGE
		// =================================================

		languageOptions.forEach(
			(option) => {

				const isActive =
					option.dataset.language ===
					language;


				option.classList.toggle(
					"active",
					isActive
				);

			}
		);


		// =================================================
		// HTML LANGUAGE
		// =================================================

		document.documentElement.lang =
			language;


		// =================================================
		// ACCESSIBILITY
		// =================================================

		if (languageButton) {

			languageButton.setAttribute(
				"aria-label",
				language === "hi"
					? "भाषा बदलें"
					: "Select Language"
			);

		}


		// =================================================
		// CLOSE LANGUAGE DROPDOWN
		// =================================================

		if (languageSelector) {

			languageSelector.classList.remove(
				"open"
			);

		}


		if (languageButton) {

			languageButton.setAttribute(
				"aria-expanded",
				"false"
			);

		}


		// =================================================
		// SAVE LANGUAGE
		// =================================================

		localStorage.setItem(
			"civicbuzz-language",
			language
		);

	}


	// =====================================================
	// LANGUAGE OPTION CLICK
	// =====================================================

	languageOptions.forEach((option) => {

		option.addEventListener(
			"click",
			() => {

				const selectedLanguage =
					option.dataset.language;


				translatePage(
					selectedLanguage
				);

			}
		);

	});


	// =====================================================
	// INITIALIZE LANGUAGE
	// =====================================================

	prepareTranslationElements();


	const savedLanguage =
		localStorage.getItem(
			"civicbuzz-language"
		);


	if (
		savedLanguage === "hi" ||
		savedLanguage === "en"
	) {

		translatePage(
			savedLanguage
		);

	} else {

		translatePage("en");

	}


	// =====================================================
	// KEYBOARD SUPPORT
	// =====================================================

	if (languageButton) {

		languageButton.addEventListener(
			"keydown",
			(event) => {

				if (
					event.key === "Enter" ||
					event.key === " "
				) {

					event.preventDefault();

					languageButton.click();

				}

			}
		);

	}


	// =====================================================
	// FINAL INITIALIZATION
	// =====================================================

	console.log(
		"CivicBuzz Client Dashboard initialized."
	);

})();