// année dynamique
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// thème avec mémorisation
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

// clic sur le bloc brand -> retour au hero
const brand = document.querySelector('.brand');
if (brand) {
  brand.style.cursor = 'pointer';
  brand.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// bouton "Rejoindre la bêta" dans la navbar -> scroll vers le formulaire
const headerBetaBtn = document.getElementById('header-beta-btn');
if (headerBetaBtn) {
  headerBetaBtn.addEventListener('click', () => {
    const betaSection = document.getElementById('beta-signup');
    if (betaSection) {
      betaSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// boutons du hero
const heroBetaBtn = document.getElementById('hero-beta-btn');
if (heroBetaBtn) {
  heroBetaBtn.addEventListener('click', () => {
    const betaSection = document.getElementById('beta-signup');
    if (betaSection) {
      betaSection.scrollIntoView({ behavior: 'smooth' });
    }
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

// bascule des champs candidate / recruiter
const roleRadios = document.querySelectorAll('input[name="role"]');
const candidateFields = document.querySelector('.beta-fields-candidate');
const recruiterFields = document.querySelector('.beta-fields-recruiter');

roleRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked && radio.value === 'candidate') {
      if (candidateFields) candidateFields.style.display = '';
      if (recruiterFields) recruiterFields.style.display = 'none';
    }
    if (radio.checked && radio.value === 'recruiter') {
      if (candidateFields) candidateFields.style.display = 'none';
      if (recruiterFields) recruiterFields.style.display = '';
    }
  });
});

// compte à rebours jusqu'au 1er juillet 2026
const launchDate = new Date(2026, 6, 1, 0, 0, 0); // 1er juillet 2026

function updateCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) {
    daysEl.textContent = '0';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds - days * 24 * 60 * 60) / 3600);
  const minutes = Math.floor((totalSeconds - days * 24 * 60 * 60 - hours * 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(minutes).padStart(2, '0');
  secsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// --- Gestion soumission formulaire bêta --- //
const betaForm = document.getElementById('beta-form');

if (betaForm) {
  betaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(betaForm);

    const submitBtn = betaForm.querySelector('.beta-submit button');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    try {
      const response = await fetch('https://jobme-api.onrender.com/api/beta-signup', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur serveur');
      }

      const data = await response.json();

      alert(data.message || 'Merci pour ta pré-inscription à la bêta JobMe 😄');

      betaForm.reset();
      // reset rôle -> candidat par défaut
      const candidateRadio = betaForm.querySelector('input[name="role"][value="candidate"]');
      if (candidateRadio) {
        candidateRadio.checked = true;
        if (candidateFields) candidateFields.style.display = '';
        if (recruiterFields) recruiterFields.style.display = 'none';
      }

    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'envoi du formulaire. Merci de réessayer plus tard.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Valider ma pré-inscription';
      }
    }
  });
}
