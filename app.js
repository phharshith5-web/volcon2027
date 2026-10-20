/* ==========================================================================
   VOLCON 2027 — Application Logic
   Features:
   - Full Video Background Hero Controls
   - Official Announcement Tracker
   - Page Switcher (01 Home to 10 Privacy Policy)
   - Complete 25-Image Lightbox Gallery & Filtering
   - Organization 2-Participant Limit Rule Validator
   - Scholarship Eligibility Checklist
   - Sponsorship & Newsletter Form Handling
   - FAQ Accordion & Instant Search
   - Scroll-to-Top Button
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Background Video Play/Pause Toggle
  const heroVideo = document.getElementById('heroVideo');
  const videoToggleBtn = document.getElementById('videoToggleBtn');

  if (heroVideo && videoToggleBtn) {
    const pauseSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> <span>Pause Video</span>';
    const playSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>Play Video</span>';

    videoToggleBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoToggleBtn.innerHTML = pauseSvg;
      } else {
        heroVideo.pause();
        videoToggleBtn.innerHTML = playSvg;
      }
    });

    heroVideo.addEventListener('play', () => {
      videoToggleBtn.innerHTML = pauseSvg;
    });
    heroVideo.addEventListener('pause', () => {
      videoToggleBtn.innerHTML = playSvg;
    });
  }

  // 2. Announcement Status Tracker
  // Note: Official dates and venue to be announced; countdown disabled pending final dates.

  // 3. Heron AI Style Pixelated Hover Animation Engine for Nav Bar
  function initPixelHoverNav() {
    const cells = document.querySelectorAll('.tech-nav-cell');
    const PIXEL_SIZE = 7; // Size of square pixel

    cells.forEach(cell => {
      const canvas = cell.querySelector('.pixel-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animId = null;
      let progress = cell.classList.contains('active') ? 1 : 0;
      let targetProgress = cell.classList.contains('active') ? 1 : 0;
      let width = 0;
      let height = 0;
      let cols = 0;
      let rows = 0;
      let pixelData = [];

      function setupGrid() {
        const rect = cell.getBoundingClientRect();
        width = Math.ceil(rect.width) || 120;
        height = Math.ceil(rect.height) || 52;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        cols = Math.ceil(width / PIXEL_SIZE);
        rows = Math.ceil(height / PIXEL_SIZE);
        pixelData = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            // Horizontal sweep with pseudo-random scatter matching Heron AI screenshot
            const normX = c / cols;
            const noise = Math.random() * 0.42;
            const threshold = normX * 0.58 + noise;
            
            // VolCon Tripartite Palette from Logo: Blue (#286591), Green (#698947), Gold (#FCB315)
            const tones = [
              '#286591', '#1E4F73', '#12344D', // VolCon Blues
              '#698947', '#536F35', '#7DA356', // VolCon Greens
              '#FCB315', '#FFCC00', '#F59E0B'  // VolCon Golds
            ];
            const color = tones[Math.floor(Math.random() * tones.length)];

            pixelData.push({
              x: c * PIXEL_SIZE,
              y: r * PIXEL_SIZE,
              threshold,
              color
            });
          }
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        if (progress <= 0.01) return;

        if (progress >= 0.96) {
          // Solid rich VolCon Royal Blue fill when fully hovered
          ctx.fillStyle = '#0C4A9E';
          ctx.fillRect(0, 0, width, height);
          return;
        }

        // Draw pixelated emergence
        for (let i = 0; i < pixelData.length; i++) {
          const p = pixelData[i];
          if (progress >= p.threshold) {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
          } else if (progress > p.threshold - 0.22) {
            const alpha = (progress - (p.threshold - 0.22)) / 0.22;
            ctx.fillStyle = `rgba(12, 74, 158, ${alpha * 0.85})`;
            ctx.fillRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }

      function animate() {
        const speed = 0.08;
        if (progress < targetProgress) {
          progress = Math.min(targetProgress, progress + speed);
          draw();
          if (progress < targetProgress) {
            animId = requestAnimationFrame(animate);
          }
        } else if (progress > targetProgress) {
          progress = Math.max(targetProgress, progress - speed);
          draw();
          if (progress > targetProgress) {
            animId = requestAnimationFrame(animate);
          }
        }
      }

      setupGrid();
      window.addEventListener('resize', setupGrid);

      cell.addEventListener('mouseenter', () => {
        targetProgress = 1;
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      });

      cell.addEventListener('mouseleave', () => {
        if (!cell.classList.contains('active')) {
          targetProgress = 0;
          cancelAnimationFrame(animId);
          animId = requestAnimationFrame(animate);
        }
      });

      cell.addEventListener('click', (e) => {
        const targetId = cell.getAttribute('data-target');
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            e.preventDefault();
            cells.forEach(c => {
              c.classList.remove('active');
              if (c.classList.contains('cta-accent')) {
                const txt = c.querySelector('.nav-cell-text');
                if (txt) txt.style.color = '';
              }
              const cCanvas = c.querySelector('.pixel-canvas');
              if (c !== cell && cCanvas) {
                const cCtx = cCanvas.getContext('2d');
                cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
              }
            });
            cell.classList.add('active');
            if (cell.classList.contains('cta-accent')) {
              const txt = cell.querySelector('.nav-cell-text');
              if (txt) txt.style.color = '#FFFFFF';
            }
            targetProgress = 1;
            progress = 1;
            draw();
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, `#${targetId}`);
          }
        }
      });

      if (cell.classList.contains('active')) {
        progress = 1;
        draw();
      }
    });
  }

  initPixelHoverNav();

  // Check URL hash on load
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetCell = document.querySelector(`.tech-nav-cell[data-target="${hash}"]`);
    if (targetCell) {
      setTimeout(() => targetCell.click(), 150);
    }
  }

  // 4. Standalone Gallery Page Interactive Lightbox & Filter
  const galleryPhotoCards = document.querySelectorAll('.gallery-photo-card');
  const galleryLightbox = document.getElementById('galleryLightbox');
  const galleryLightboxImg = document.getElementById('galleryLightboxImg');
  const galleryLightboxClose = document.getElementById('galleryLightboxClose');
  const galleryLightboxPrev = document.getElementById('galleryLightboxPrev');
  const galleryLightboxNext = document.getElementById('galleryLightboxNext');
  let galleryImagesList = [];
  let currentGalleryIndex = 0;

  if (galleryPhotoCards.length > 0) {
    galleryPhotoCards.forEach((card, idx) => {
      const img = card.querySelector('img');
      if (img) {
        galleryImagesList.push(img.src);
        card.addEventListener('click', () => {
          openGalleryLightbox(idx);
        });
      }
    });
  }

  function openGalleryLightbox(index) {
    if (!galleryLightbox || galleryImagesList.length === 0) return;
    currentGalleryIndex = index;
    if (galleryLightboxImg) galleryLightboxImg.src = galleryImagesList[currentGalleryIndex];
    galleryLightbox.classList.add('active');
  }

  function closeGalleryLightbox() {
    if (galleryLightbox) galleryLightbox.classList.remove('active');
  }

  if (galleryLightboxClose) galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
  if (galleryLightbox) {
    galleryLightbox.addEventListener('click', (e) => {
      if (e.target === galleryLightbox) closeGalleryLightbox();
    });
  }

  if (galleryLightboxPrev) {
    galleryLightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
      if (galleryLightboxImg) galleryLightboxImg.src = galleryImagesList[currentGalleryIndex];
    });
  }

  if (galleryLightboxNext) {
    galleryLightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImagesList.length;
      if (galleryLightboxImg) galleryLightboxImg.src = galleryImagesList[currentGalleryIndex];
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!galleryLightbox || !galleryLightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeGalleryLightbox();
    if (e.key === 'ArrowLeft' && galleryLightboxPrev) galleryLightboxPrev.click();
    if (e.key === 'ArrowRight' && galleryLightboxNext) galleryLightboxNext.click();
  });

  // Category filter tabs on gallery page
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
  galleryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetFilter = btn.getAttribute('data-filter');
      const filterableItems = document.querySelectorAll('.filterable-gallery-item');
      filterableItems.forEach(item => {
        if (targetFilter === '*' || item.classList.contains(targetFilter.replace('.', ''))) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 6. Scholarship Checklist Evaluation
  const scCheckboxes = document.querySelectorAll('.sc-chk');
  const quizResult = document.getElementById('quizResult');

  function evaluateScholarship() {
    if (!quizResult) return;
    const isNew = document.getElementById('scNew').checked;
    const isManaged = document.getElementById('scManaged').checked;
    const isPersonal = document.getElementById('scPersonal').checked;
    const isBudget = document.getElementById('scBudget').checked;

    if (!isNew && (isManaged || isPersonal || isBudget)) {
      quizResult.className = 'val-msg invalid';
      quizResult.innerHTML = '<strong>Important Note:</strong> The VolCon 2027 scholarship is exclusively for participants who are <strong>New to VolCon</strong>. If you have attended before, please join via our general registration!';
      quizResult.style.display = 'block';
      return;
    }

    if (isNew && isManaged && isPersonal && isBudget) {
      quizResult.className = 'val-msg valid';
      quizResult.innerHTML = '<strong>Excellent Match:</strong> You meet all criteria for the VolCon 2027 Scholarship (Up to 30 awarded). Be sure to submit your application before Dec 21, 2026!';
      quizResult.style.display = 'block';
    } else if (isNew && (isManaged || isPersonal)) {
      quizResult.className = 'val-msg valid';
      quizResult.innerHTML = '<strong>Eligible Profile:</strong> You demonstrate solid volunteer mobilization experience. Grassroots volunteer engagers and researchers are strongly encouraged to apply!';
      quizResult.style.display = 'block';
    } else {
      quizResult.style.display = 'none';
    }
  }

  scCheckboxes.forEach(chk => chk.addEventListener('change', evaluateScholarship));

  // 7. Sponsorship Form
  const spForm = document.getElementById('spForm');
  const spOutput = document.getElementById('spOutput');

  if (spForm) {
    spForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fName').value.trim();
      const corp = document.getElementById('fCorp').value.trim();
      const email = document.getElementById('fEmail').value.trim();

      if (spOutput) {
        spOutput.style.display = 'block';
        spOutput.innerHTML = `<strong>Thank you, ${name}!</strong> Your sponsorship inquiry on behalf of <strong>${corp}</strong> has been received. Our partnership team will reach out at <strong>${email}</strong>.`;
        spForm.reset();
      }
    });
  }

  // 8. Newsletter Form
  const nlForm = document.getElementById('nlForm');
  const nlOutput = document.getElementById('nlOutput');

  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('nlEmail').value.trim();
      if (nlOutput) {
        nlOutput.style.display = 'block';
        nlOutput.innerHTML = `<strong>Subscribed!</strong> Updates on speakers, agenda, and tickets will be sent to <strong>${email}</strong>.`;
        nlForm.reset();
      }
    });
  }

  // 9. FAQ Accordion & Instant Search
  const faqCards = document.querySelectorAll('.faq-card');
  const faqSearch = document.getElementById('faqSearch');

  faqCards.forEach(card => {
    const btn = card.querySelector('.faq-header-btn');
    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      faqCards.forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener('input', () => {
      const q = faqSearch.value.toLowerCase().trim();
      faqCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = (!q || text.includes(q)) ? 'block' : 'none';
      });
    });
  }

  // 10. Scroll to Top
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (scrollBtn) scrollBtn.classList.add('show');
    } else {
      if (scrollBtn) scrollBtn.classList.remove('show');
    }
  });

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 11. Theme Management (Light & Dark with VolCon_dark_fixed hero video)
  // ==========================================================================
  function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const floatingThemeToggle = document.getElementById('floatingThemeToggle');
    const heroVideo = document.getElementById('heroVideo');

    // Retrieve saved theme or system preference
    const savedTheme = localStorage.getItem('volcon-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function updateHeroVideoTheme(isDark) {
      if (!heroVideo) return;
      const targetVideo = isDark ? 'VolCon_dark_fixed.mp4' : 'VolCon_light_fixed.mp4';
      
      const currentSrc = heroVideo.currentSrc || (heroVideo.querySelector('source') ? heroVideo.querySelector('source').getAttribute('src') : '');
      
      if (!currentSrc || !currentSrc.endsWith(targetVideo)) {
        const wasPaused = heroVideo.paused;
        const currentTime = heroVideo.currentTime || 0;

        heroVideo.style.opacity = '0.2';
        setTimeout(() => {
          let sourceEl = heroVideo.querySelector('source');
          if (!sourceEl) {
            sourceEl = document.createElement('source');
            sourceEl.type = 'video/mp4';
            heroVideo.appendChild(sourceEl);
          }
          sourceEl.setAttribute('src', targetVideo);
          heroVideo.src = targetVideo;
          heroVideo.load();
          
          heroVideo.onloadedmetadata = () => {
            if (currentTime > 0 && currentTime < heroVideo.duration) {
              heroVideo.currentTime = currentTime;
            }
          };

          if (!wasPaused) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Ignore autoplay restrictions if paused by browser
              });
            }
          }
          heroVideo.style.opacity = '1';
        }, 150);
      }
    }

    function applyTheme(theme) {
      const isDark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('volcon-theme', theme);

      // Update Header Theme Switcher
      if (themeToggleBtn) {
        const label = themeToggleBtn.querySelector('.theme-label-txt');
        if (label) {
          label.textContent = isDark ? 'LIGHT' : 'DARK';
        }
        themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode (Press T)' : 'Switch to Dark Mode (Press T)');
      }

      // Update Floating Switcher
      if (floatingThemeToggle) {
        const floatText = floatingThemeToggle.querySelector('.floating-theme-text');
        if (floatText) {
          floatText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
        floatingThemeToggle.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      }

      // Switch Hero Video (VolCon_dark_fixed.mp4 for Dark, VolCon_light_fixed.mp4 for Light)
      updateHeroVideoTheme(isDark);

      // Update preloader video if available
      if (window.updatePreloaderTheme) {
        window.updatePreloaderTheme();
      }
    }

    // Apply on load
    applyTheme(initialTheme);

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }

    if (floatingThemeToggle) {
      floatingThemeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }

    // Keyboard shortcut: Press 'T' or 't' to toggle theme
    document.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;
      if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      }
    });

    // Listen to system preference changes if no manual override stored
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('volcon-theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  initTheme();

  // ==========================================================================
  // 12. Cinematic Video Preloader & Audio Controller
  // ==========================================================================
  function initPreloader() {
    const sitePreloader = document.getElementById('sitePreloader');
    const preloaderVideo = document.getElementById('preloaderVideo');
    const preloaderVideoSource = document.getElementById('preloaderVideoSource');
    const preloaderSoundBtn = document.getElementById('preloaderSoundBtn');
    const skipPreloaderBtn = document.getElementById('skipPreloaderBtn');
    const preloaderAudioHint = document.getElementById('preloaderAudioHint');
    const preloaderProgressBar = document.getElementById('preloaderProgressBar');
    const preloaderTimer = document.getElementById('preloaderTimer');
    const replayIntroBtn = document.getElementById('replayIntroBtn');

    // Hero video audio controls
    const heroVideo = document.getElementById('heroVideo');
    const heroAudioToggleBtn = document.getElementById('heroAudioToggleBtn');

    if (!sitePreloader || !preloaderVideo) return;

    function getThemeVideo() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return isDark ? 'VolCon_dark_fixed.mp4' : 'VolCon_light_fixed.mp4';
    }

    function setPreloaderVideoSource() {
      const targetVideo = getThemeVideo();
      const currentSrc = preloaderVideo.currentSrc || (preloaderVideoSource ? preloaderVideoSource.getAttribute('src') : '');
      if (!currentSrc || !currentSrc.endsWith(targetVideo)) {
        if (preloaderVideoSource) {
          preloaderVideoSource.setAttribute('src', targetVideo);
        }
        preloaderVideo.src = targetVideo;
        preloaderVideo.load();
      }
    }

    function updateSoundBtnUI(unmuted) {
      if (!preloaderSoundBtn) return;
      const unmutedIcon = preloaderSoundBtn.querySelector('.sound-icon-unmuted');
      const mutedIcon = preloaderSoundBtn.querySelector('.sound-icon-muted');
      const label = preloaderSoundBtn.querySelector('.sound-label-text');

      if (unmuted) {
        if (unmutedIcon) unmutedIcon.style.display = 'inline-flex';
        if (mutedIcon) mutedIcon.style.display = 'none';
        if (label) label.textContent = 'Mute';
      } else {
        if (unmutedIcon) unmutedIcon.style.display = 'none';
        if (mutedIcon) mutedIcon.style.display = 'inline-flex';
        if (label) label.textContent = 'Unmute';
      }
    }

    function playPreloader() {
      setPreloaderVideoSource();
      preloaderVideo.currentTime = 0;
      preloaderVideo.muted = false;
      preloaderVideo.volume = 1.0;
      updateSoundBtnUI(true);

      const playPromise = preloaderVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Autoplay with audio was permitted
          updateSoundBtnUI(true);
        }).catch(() => {
          // Browser restricted audio autoplay until user interaction
          preloaderVideo.muted = true;
          updateSoundBtnUI(false);
          preloaderVideo.play().catch(() => {});
        });
      }
    }

    function enableAudio() {
      preloaderVideo.muted = false;
      preloaderVideo.volume = 1.0;
      updateSoundBtnUI(true);
    }

    // Clicking anywhere on the video unmutes if muted, or enters the site
    preloaderVideo.addEventListener('click', () => {
      if (preloaderVideo.muted) {
        enableAudio();
      } else {
        closePreloader();
      }
    });

    if (preloaderSoundBtn) {
      preloaderSoundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (preloaderVideo.muted) {
          enableAudio();
        } else {
          preloaderVideo.muted = true;
          updateSoundBtnUI(false);
        }
      });
    }

    // Time update for progress bar and live countdown timer
    preloaderVideo.addEventListener('timeupdate', () => {
      if (preloaderVideo.duration) {
        const percent = (preloaderVideo.currentTime / preloaderVideo.duration) * 100;
        if (preloaderProgressBar) {
          preloaderProgressBar.style.width = `${Math.min(100, percent)}%`;
        }
        if (preloaderTimer) {
          const remaining = Math.max(0, Math.ceil(preloaderVideo.duration - preloaderVideo.currentTime));
          preloaderTimer.textContent = `0:${remaining < 10 ? '0' : ''}${remaining}`;
        }
      }
    });

    function closePreloader() {
      sitePreloader.classList.add('fade-out');
      setTimeout(() => {
        sitePreloader.style.display = 'none';
        preloaderVideo.pause();
        if (heroVideo && heroVideo.paused) {
          heroVideo.play().catch(() => {});
        }
      }, 700);
    }

    // Automatically transition to website when video ends
    preloaderVideo.addEventListener('ended', () => {
      closePreloader();
    });

    if (skipPreloaderBtn) {
      skipPreloaderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closePreloader();
      });
    }

    // Replay Intro Button in Hero Section
    if (replayIntroBtn) {
      replayIntroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sitePreloader.style.display = 'flex';
        void sitePreloader.offsetWidth;
        sitePreloader.classList.remove('fade-out');
        playPreloader();
      });
    }

    // Initial launch of preloader on page load
    playPreloader();

    // Hero video audio toggle
    if (heroAudioToggleBtn && heroVideo) {
      const mutedIcon = heroAudioToggleBtn.querySelector('.hero-audio-muted-icon');
      const unmutedIcon = heroAudioToggleBtn.querySelector('.hero-audio-unmuted-icon');
      const label = heroAudioToggleBtn.querySelector('.hero-audio-label');

      heroAudioToggleBtn.addEventListener('click', () => {
        if (heroVideo.muted) {
          heroVideo.muted = false;
          heroVideo.volume = 1.0;
          if (mutedIcon) mutedIcon.style.display = 'none';
          if (unmutedIcon) unmutedIcon.style.display = 'inline-flex';
          if (label) label.textContent = 'Audio';
        } else {
          heroVideo.muted = true;
          if (mutedIcon) mutedIcon.style.display = 'inline-flex';
          if (unmutedIcon) unmutedIcon.style.display = 'none';
          if (label) label.textContent = 'Muted';
        }
      });
    }

    // Export function to update preloader theme video source
    window.updatePreloaderTheme = function() {
      setPreloaderVideoSource();
    };
  }

  initPreloader();
});
