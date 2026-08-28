/* ============================================================
   YAZ Electrical Solution Ltd — site scripts (vanilla JS)
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     ONE-LINE SWAP: your Formspree endpoint goes here.
     Create a free form at https://formspree.io, then paste the
     "https://formspree.io/f/XXXXXX" URL below — and in the
     `action` attribute of the form on contact.html.
     ---------------------------------------------------------- */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var header = document.querySelector('.site-header');

  /* Sticky header state */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) toggle.setAttribute('aria-label', 'Close menu');
      else toggle.setAttribute('aria-label', 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
    });
    document.querySelectorAll('.site-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----------------------------------------------------------
     Quote-request form.
     Works without JS (native POST to the Formspree endpoint).
     With JS: submits via fetch, keeps the visitor on the page
     and shows a clear success / error state.
     ---------------------------------------------------------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var statusEl = document.getElementById('form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      if (!window.fetch || !FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
        /* No endpoint configured yet — fall back to the native
           action so the form still works once the real URL is set. */
        return; // let the browser POST to the form's action
      }
      e.preventDefault();

      /* native constraint validation first */
      if (!form.checkValidity()) {
        /* highlight the offending fields */
        form.querySelectorAll('input, textarea, select').forEach(function (ctrl) {
          var wrap = ctrl.closest('.field');
          if (wrap) wrap.classList.toggle('field--invalid', !ctrl.checkValidity());
        });
        form.reportValidity();
        return;
      }
      form.querySelectorAll('.field--invalid').forEach(function (wrap) {
        wrap.classList.remove('field--invalid');
      });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending\u2026';
      }

      var data = new FormData(form);

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) return res.json();
          return Promise.reject(new Error('Formspree returned ' + res.status));
        })
        .then(function () {
          form.style.display = 'none';
          if (statusEl) {
            statusEl.hidden = false;
            statusEl.classList.add('form-done');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          var err = document.getElementById('form-error');
          if (err) err.classList.add('form-error--show');
        });
    });
  }
})();
