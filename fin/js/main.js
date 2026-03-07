/* ========================================
   Main JavaScript - Navigation & Utilities
   ======================================== */

// --- Mobile Navigation ---
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // --- Spoiler toggles ---
  document.querySelectorAll('.spoiler-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content && content.classList.contains('spoiler-content')) {
        content.classList.toggle('show');
        btn.textContent = content.classList.contains('show') ? 'Hide Solution' : 'Show Solution';
      }
    });
  });

  // --- Tab system ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabGroup = btn.closest('.tabs-container');
      const targetId = btn.dataset.tab;

      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = tabGroup.querySelector(`#${targetId}`);
      if (target) target.classList.add('active');
    });
  });

  // --- Reading progress bar ---
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = progress + '%';
    });
  }

  // --- Highlight current nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // --- Initialize any interactive elements ---
  if (typeof initVisualizations === 'function') {
    initVisualizations();
  }
});

// --- Utility: Format number nicely ---
function fmt(n, decimals = 2) {
  return Number(n).toFixed(decimals);
}

// --- Utility: Clamp ---
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// --- Utility: Linear interpolation ---
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// --- Utility: Map range ---
function mapRange(val, inMin, inMax, outMin, outMax) {
  return outMin + (val - inMin) * (outMax - outMin) / (inMax - inMin);
}

// --- Utility: Create slider with live value display ---
function createSlider(container, label, min, max, value, step, onChange) {
  const group = document.createElement('div');
  group.className = 'control-group';

  const lbl = document.createElement('label');
  lbl.textContent = label;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.step = step || 0.1;

  const valSpan = document.createElement('span');
  valSpan.className = 'control-value';
  valSpan.textContent = value;

  slider.addEventListener('input', () => {
    valSpan.textContent = slider.value;
    if (onChange) onChange(parseFloat(slider.value));
  });

  group.appendChild(lbl);
  group.appendChild(slider);
  group.appendChild(valSpan);
  container.appendChild(group);

  return slider;
}
