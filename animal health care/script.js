/* ═══════════════════════════════════════════════════════════
   PawsFirst Animal Care — JavaScript
   Linked in HTML: <script src="script.js"></script>
   ═══════════════════════════════════════════════════════════ */


/* ─── HERO SLIDESHOW ──────────────────────────────────────── */
(function () {
  const slider   = document.getElementById('heroSlider');
  if (!slider) return;

  const slides   = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('sliderDots');
  let current    = 0;
  let timer      = null;
  const INTERVAL = 4000; // ms between auto-advances

  /* Build dot buttons */
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function getDots() { return Array.from(dotsWrap.querySelectorAll('.dot')); }

  /* Transition to slide index n */
  function goTo(n) {
    if (n === current) return;

    const prev = current;
    current = (n + slides.length) % slides.length;

    /* Mark old slide as exiting */
    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');

    /* After the CSS transition ends, clean up exit class */
    slides[prev].addEventListener('transitionend', function handler() {
      slides[prev].classList.remove('exit');
      slides[prev].removeEventListener('transitionend', handler);
    });

    /* Activate new slide */
    slides[current].classList.add('active');

    /* Update dots */
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  /* Expose moveSlide() for the arrow buttons in HTML */
  window.moveSlide = function (dir) { goTo(current + dir); };

  /* Pause on hover */
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);

  /* Start auto-play */
  resetTimer();
})();


/* ─── ACTIVE NAV LINK ─────────────────────────────────────── */
function setActive(el) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}


/* ─── NAVBAR SHADOW + SCROLL SPY ─────────────────────────── */
window.addEventListener('scroll', () => {
  // Add shadow when scrolled
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);

  // Highlight the nav link matching the visible section
  const sections = ['home', 'about', 'services', 'contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});


/* ─── MOBILE HAMBURGER MENU ───────────────────────────────── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}


/* ─── SMOOTH SCROLL TO CONTACT ────────────────────────────── */
function scrollToContact() {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}


/* ─── SEARCH: TRIGGER FROM NAV BAR (Enter key) ────────────── */
function handleSearchKey(e) {
  if (e.key === 'Enter') openSearch();
}


/* ─── SEARCH: OPEN OVERLAY ────────────────────────────────── */
function openSearch() {
  const q = document.getElementById('navSearchInput').value.trim();
  document.getElementById('searchOverlay').classList.add('active');
  const mainInput = document.getElementById('searchMain');
  if (q) mainInput.value = q;
  mainInput.focus();
  runSearch();
}


/* ─── SEARCH: CLOSE OVERLAY ───────────────────────────────── */
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('active');
  document.getElementById('searchResults').innerHTML = '';
}

// Close when clicking the backdrop (outside the search box)
function closeSearchOnBg(e) {
  if (e.target === document.getElementById('searchOverlay')) closeSearch();
}


/* ─── SEARCH: KEYWORD DATA ────────────────────────────────── */
const SERVICES_DATA = [
  { name: 'Veterinary Care', desc: 'Health exams, diagnostics & treatment', anchor: '#services' },
  { name: 'Grooming',        desc: 'Bathing, trimming & coat treatments',   anchor: '#services' },
  { name: 'Pet Boarding',    desc: 'Safe overnight stays with 24/7 care',   anchor: '#services' },
  { name: 'Dental Care',     desc: 'Professional dental cleaning & exams',  anchor: '#services' },
  { name: 'Vaccinations',    desc: 'Complete vaccination schedules',         anchor: '#services' },
  { name: 'Emergency Care',  desc: 'Round-the-clock urgent care',           anchor: '#services' },
  { name: 'About Us',        desc: 'Learn about our team & mission',        anchor: '#about'    },
  { name: 'Contact / Book',  desc: 'Book an appointment or reach out',      anchor: '#contact'  },
];


/* ─── SEARCH: RUN CLIENT-SIDE KEYWORD MATCH ──────────────── */
function runSearch() {
  const q = document.getElementById('searchMain').value.trim().toLowerCase();
  const resultsEl = document.getElementById('searchResults');

  if (!q) { resultsEl.innerHTML = ''; return; }

  const hits = SERVICES_DATA.filter(s =>
    s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
  );

  if (hits.length === 0) {
    resultsEl.innerHTML = '<p style="color:#a07060;margin-top:8px">No results found. Try "grooming" or "vaccination".</p>';
    return;
  }

  resultsEl.innerHTML = hits.map(h => `
    <div
      style="margin-top:10px;padding:10px 12px;background:var(--cream);border-radius:10px;cursor:pointer"
      onclick="goTo('${h.anchor}')"
    >
      <strong style="color:var(--dark)">${h.name}</strong>
      <span style="color:#7a5a40;font-size:.82rem"> — ${h.desc}</span>
    </div>
  `).join('');
}

// Keyboard shortcuts inside the overlay
function handleOverlayKey(e) {
  if (e.key === 'Enter')  runSearch();
  if (e.key === 'Escape') closeSearch();
}

// Navigate to a section and close the overlay
function goTo(anchor) {
  closeSearch();
  document.querySelector(anchor).scrollIntoView({ behavior: 'smooth' });
}


/* ─── CONTACT FORM: SEND MESSAGE ──────────────────────────── */
function sendMessage() {
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const service = document.getElementById('fservice').value;
  const message = document.getElementById('fmessage').value.trim();

  // Basic validation
  if (!name)    { showToast('⚠️ Please enter your name.');    return; }
  if (!email)   { showToast('⚠️ Please enter your email.');   return; }
  if (!service) { showToast('⚠️ Please select a service.');   return; }
  if (!message) { showToast('⚠️ Please enter a message.');    return; }

  // ✅ Replace this block with a real API / EmailJS / backend call
  showToast(`✅ Thanks ${name}! We'll be in touch soon.`);

  // Clear the form fields after submission
  document.getElementById('fname').value    = '';
  document.getElementById('femail').value   = '';
  document.getElementById('fservice').value = '';
  document.getElementById('fmessage').value = '';
}


/* ─── TOAST NOTIFICATION HELPER ───────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
