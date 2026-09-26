/* ============================================================
   YAZ Electrical Solution Ltd — site scripts (vanilla JS)
   ============================================================ */

(function () {
  'use strict';

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
     Submits via fetch to /api/contact, keeps the visitor on
     the page and displays inline status messages.
     ---------------------------------------------------------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var statusMsg = document.getElementById('form-status-msg');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
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

      if (statusMsg) {
        statusMsg.textContent = 'Sending...';
        statusMsg.className = 'form-status-msg form-status-msg--info';
      }

      var formData = new FormData(form);
      var payload = {
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        service: formData.get('service') || '',
        message: formData.get('message') || ''
      };

      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) {
              throw new Error((data && data.error) ? data.error : 'HTTP ' + res.status);
            }
            return data;
          });
        })
        .then(function () {
          if (statusMsg) {
            statusMsg.textContent = "Thanks, we'll be in touch shortly";
            statusMsg.className = 'form-status-msg form-status-msg--success';
          }
          form.reset();
        })
        .catch(function () {
          if (statusMsg) {
            statusMsg.textContent = 'Something went wrong, please try again';
            statusMsg.className = 'form-status-msg form-status-msg--error';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }
})();
