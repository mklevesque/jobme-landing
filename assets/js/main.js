// ===========================
// Année dynamique
// ===========================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===========================
// Thème avec mémorisation
// ===========================
const body = document.body;
const stored = localStorage.getItem('jobme-theme');
if (stored === 'light' || stored === 'dark') {
  body.setAttribute('data-theme', stored);
}

const toggleBtn = document.querySelector('.theme-toggle');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', current);
    localStorage.setItem('jobme-theme', current);
  });
}

// ===========================
// Clic sur le bloc brand -> retour au haut de page
// ===========================
const brand = document.querySelector('.brand');
if (brand) {
  brand.style.cursor = 'pointer';
  brand.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===========================
// Boutons "Rejoindre la bêta" (index + autres pages)
// ===========================
function scrollToBeta() {
  // D’abord chercher la section sur la page courante
  let betaSection = document.getElementById('beta-signup');
  if (betaSection) {
    betaSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Sinon rediriger vers la home
    window.location.href = 'index.html#beta-signup';
  }
}

const headerBetaLink = document.querySelector('.header-nav-cta');
if (headerBetaLink) {
  headerBetaLink.addEventListener('click', (e) => {
    // si on est déjà sur index.html, on laisse l’ancre fonctionner
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (isIndex) return;
    e.preventDefault();
    scrollToBeta();
  });
}

const heroBetaBtn = document.getElementById('hero-beta-btn');
if (heroBetaBtn) {
  heroBetaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToBeta();
  });
}

const heroHowBtn = document.getElementById('hero-how-btn');
if (heroHowBtn) {
  heroHowBtn.addEventListener('click', () => {
    const howSection = document.getElementById('how');
    if (howSection) {
      howSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===========================
// Bascule des champs candidate / recruiter
// ===========================
const roleRadios = document.querySelectorAll('input[name="role"]');
const candidateFields = document.querySelector('.beta-fields-candidate');
const recruiterFields = document.querySelector('.beta-fields-recruiter');

if (roleRadios && roleRadios.length > 0) {
  roleRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!candidateFields || !recruiterFields) return;

      if (radio.checked && radio.value === 'candidate') {
        candidateFields.style.display = '';
        recruiterFields.style.display = 'none';
      }
      if (radio.checked && radio.value === 'recruiter') {
        candidateFields.style.display = 'none';
        recruiterFields.style.display = '';
      }
    });
  });
}

// ===========================
// COMPTE À REBOURS – format "007"
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  const compactEl = document.getElementById('beta-timer'); // <- ton nouvel ID
  if (!compactEl) return;

  // Date cible : 1er juillet 2026 à 00:00:00 UTC (à ajuster si besoin)
  const targetDate = new Date(Date.UTC(2026, 6, 1, 0, 0, 0)); // mois = 6 (juillet)

  function formatCountdown(diffMs) {
    if (diffMs <= 0) {
      return '000:00:00:00';
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    const d = String(days).padStart(3, '0'); // "007"
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    return `${d}:${h}:${m}:${s}`;
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    const text = formatCountdown(diff);
    compactEl.textContent = text;

    if (diff <= 0) {
      clearInterval(timerId);
    }
  }

  updateCountdown();
  const timerId = setInterval(updateCountdown, 1000);
});

// ===========================
// Soumission formulaire bêta
// ===========================
const betaForm = document.getElementById('beta-form');

if (betaForm) {
  betaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(betaForm);

    // Debug : voir ce qui part réellement vers l’API
    console.table([...formData.entries()]);

    const submitBtn = betaForm.querySelector('.beta-submit button');
    const initialLabel = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    try {
      const response = await fetch('https://jobme-api.onrender.com/api/beta-signup', {
        method: 'POST',
        body: formData
      });

      const contentType = response.headers.get('content-type') || '';
      let payload = {};
      let rawText = '';

      // On essaie d’abord de lire la réponse
      if (contentType.includes('application/json')) {
        try {
          payload = await response.json();
        } catch (errJson) {
          console.warn('Réponse JSON invalide', errJson);
        }
      } else {
        try {
          rawText = await response.text();
          if (rawText) {
            payload.message = rawText;
          }
        } catch (errText) {
          console.warn('Impossible de lire la réponse texte', errText);
        }
      }

      if (!response.ok) {
        console.error('Réponse API non OK', response.status, payload || rawText);
        const msg =
          (payload && payload.message) ||
          rawText ||
          `Erreur serveur (${response.status})`;
        throw new Error(msg);
      }

      console.log('Réponse API OK', payload);

      alert(payload.message || 'Merci pour ta pré-inscription à la bêta JobMe 😄');

      betaForm.reset();

      // Reset rôle -> candidat par défaut
      const candidateRadio = betaForm.querySelector('input[name="role"][value="candidate"]');
      if (candidateRadio) {
        candidateRadio.checked = true;
        if (candidateFields) candidateFields.style.display = '';
        if (recruiterFields) recruiterFields.style.display = 'none';
      }
    } catch (err) {
      console.error('Erreur lors de l’envoi du formulaire bêta', err);
      alert(
        err.message ||
        "Une erreur est survenue lors de l'envoi du formulaire. Merci de réessayer plus tard."
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = initialLabel || 'Valider ma pré-inscription à la bêta';
      }
    }
  });
}

// ===========================
// Menu burger mobile
// ===========================
(function () {
  const burger = document.querySelector('.nav-burger');
  // on essaie d’abord #main-nav, sinon la première .header-nav
  const nav = document.getElementById('main-nav') || document.querySelector('.header-nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();
