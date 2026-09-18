(() => {
  'use strict';

  // Navigation bleibt ohne JavaScript auf großen Bildschirmen erreichbar.
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const setMenu = (open) => {
    menu?.setAttribute('aria-expanded', String(open));
    navigation?.classList.toggle('is-open', open);
    const label = menu?.querySelector('.menu-label');
    if (label) label.textContent = open ? 'Schließen' : 'Menü';
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (menu?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false);
  });
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 601px)').addEventListener('change', () => setMenu(false));
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // Native Dialoge: Fokusbegrenzung, Escape und Tastaturbedienung durch den Browser.
  const projectDialogs = [...document.querySelectorAll('.project-dialog')];
  const readProjectHash = () => {
    try { return decodeURIComponent(location.hash.slice(1)); } catch { return ''; }
  };
  const syncProject = () => {
    if (!projectDialogs.length) return;
    const id = readProjectHash();
    const selected = projectDialogs.find((dialog) => dialog.id === `projekt-${id}`);
    projectDialogs.forEach((dialog) => { if (dialog.open && dialog !== selected) dialog.close(); });
    if (selected && !selected.open) {
      selected.showModal();
      selected.scrollTop = 0;
    }
  };
  projectDialogs.forEach((dialog) => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      // Der Klick auf den abgedunkelten Außenbereich schließt den Dialog.
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (readProjectHash() === dialog.id.replace('projekt-', '')) history.replaceState(null, '', location.pathname + location.search);
    });
  });
  document.querySelectorAll('[data-project]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState(null, '', `#${link.dataset.project}`);
      syncProject();
    });
  });
  window.addEventListener('hashchange', syncProject);
  window.addEventListener('popstate', syncProject);
  syncProject();

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-card')];
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      cards.forEach((card) => {
        card.hidden = selected !== 'alle' && card.dataset.category !== selected;
        if (!card.hidden) count++;
      });
      document.querySelector('.project-grid')?.classList.toggle('is-filtered', selected !== 'alle');
      const countLabel = document.querySelector('#project-count');
      if (countLabel) countLabel.textContent = `${count} ${count === 1 ? 'Studie' : 'Studien'}`;
    });
  });

  const config = window.SITE_CONFIG || {};
  const email = typeof config.contactEmail === 'string' ? config.contactEmail.trim() : '';
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/[\r\n?&#]/.test(email);
  let endpoint = '';
  try {
    const url = new URL(config.formEndpoint);
    if (url.protocol === 'https:' && !url.username && !url.password) endpoint = url.href;
  } catch { /* Leere Konfiguration: sicherer Vorschaumodus. */ }
  document.querySelectorAll('[data-contact-email]').forEach((link) => {
    if (emailValid) {
      link.textContent = email;
      link.href = `mailto:${email}`;
      link.hidden = false;
    }
  });

  const form = document.querySelector('#contact-form');
  if (form) {
    const notice = document.querySelector('#form-mode-notice');
    const submit = document.querySelector('#contact-submit');
    const submitLabel = document.querySelector('#submit-label');
    const feedback = document.querySelector('#form-feedback');
    const draft = document.querySelector('#draft-result');
    const draftText = document.querySelector('#draft-text');
    const emailLink = document.querySelector('#email-request');
    const copyButton = document.querySelector('#copy-request');
    const mode = endpoint ? 'endpoint' : emailValid ? 'email' : 'preview';
    if (mode === 'endpoint') {
      notice.textContent = 'Ihre Nachricht wird über den eingerichteten Formulardienst an Marcel Steek übermittelt.';
      submitLabel.textContent = 'Nachricht senden';
    } else if (mode === 'email') {
      notice.textContent = 'Das Formular bereitet eine E-Mail vor. Sie versenden die Nachricht anschließend in Ihrem E-Mail-Programm.';
      submitLabel.textContent = 'E-Mail vorbereiten';
    }
    const setFeedback = (message, type = '') => {
      feedback.textContent = message;
      feedback.className = `form-feedback ${type}`;
    };
    let busy = false;
    form.addEventListener('input', () => {
      // Veraltete Entwürfe nach einer Eingabeänderung nicht weiter anbieten.
      draft.hidden = true;
      emailLink.removeAttribute('href');
      setFeedback('');
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      if (form.elements._gotcha.value) {
        setFeedback('Die Anfrage konnte nicht verarbeitet werden.', 'error');
        return;
      }
      const data = new FormData(form);
      const name = String(data.get('name')).trim();
      const message = String(data.get('message')).trim();
      if (!name || !message) {
        setFeedback('Bitte geben Sie Ihren Namen und eine Nachricht ein.', 'error');
        (!name ? form.elements.name : form.elements.message).focus();
        return;
      }
      const subject = `${data.get('topic')} – ${name}`;
      const body = [
        `Name: ${name}`, `E-Mail: ${data.get('email')}`,
        data.get('phone') ? `Telefon: ${data.get('phone')}` : '',
        `Anliegen: ${data.get('topic')}`, '', message,
        '', 'Hinweis: Datenschutzhinweise gelesen und Verarbeitung zur Bearbeitung der Anfrage bestätigt.'
      ].filter((line) => line !== null).join('\n');

      if (mode !== 'endpoint') {
        draftText.value = `Betreff: ${subject}\n\n${body}`;
        draft.hidden = false;
        if (mode === 'email') {
          emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          emailLink.hidden = false;
          document.querySelector('#draft-help').textContent = 'Prüfen Sie den Text. Mit „E-Mail öffnen“ übernehmen Sie ihn in Ihr E-Mail-Programm und versenden ihn dort. Alternativ können Sie die Anfrage kopieren.';
          setFeedback('Der E-Mail-Entwurf ist vorbereitet. Es wurde noch nichts versendet.');
        } else {
          emailLink.hidden = true;
          setFeedback('Die Anfrage ist vorbereitet. Der Versand ist in dieser Vorschau noch nicht aktiviert.');
        }
        draft.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
        return;
      }
      if (!navigator.onLine) {
        setFeedback('Sie sind offline. Bitte verbinden Sie sich mit dem Internet und senden Sie Ihre Nachricht erneut.', 'error');
        return;
      }
      busy = true;
      submit.disabled = true;
      const editable = [...form.querySelectorAll('input,select,textarea')];
      editable.forEach((field) => { field.disabled = true; });
      submitLabel.textContent = 'Wird gesendet …';
      setFeedback('Ihre Nachricht wird übermittelt.');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        data.set('_subject', subject);
        data.set('name', name);
        data.set('message', message);
        const response = await fetch(endpoint, {
          method: 'POST', body: data, headers: { Accept: 'application/json' },
          signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer'
        });
        if (!response.ok) throw new Error('delivery-not-confirmed');
        setFeedback('Vielen Dank. Ihre Nachricht wurde erfolgreich übermittelt.', 'success');
        form.reset();
        draft.hidden = true;
      } catch {
        setFeedback('Die Übermittlung konnte nicht bestätigt werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es später erneut oder nutzen Sie die E-Mail-Adresse, sofern angegeben.', 'error');
      } finally {
        clearTimeout(timeout);
        editable.forEach((field) => { field.disabled = false; });
        submit.disabled = false;
        submitLabel.textContent = 'Nachricht senden';
        busy = false;
      }
    });
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(draftText.value);
        setFeedback('Die Anfrage wurde in die Zwischenablage kopiert.');
      } catch {
        draftText.focus();
        draftText.select();
        setFeedback('Der Text ist markiert. Bitte kopieren Sie ihn mit Strg+C bzw. über das Kopiermenü Ihres Geräts.');
      }
    });
  }

  const connection = document.querySelector('.connection-status');
  const updateConnection = () => { if (connection) connection.hidden = navigator.onLine; };
  window.addEventListener('online', updateConnection);
  window.addEventListener('offline', updateConnection);
  updateConnection();

  // Die App funktioniert auch im Unterordner einer GitHub-Project-Page.
  if ('serviceWorker' in navigator && ['https:', 'http:'].includes(location.protocol) && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
        // Bei nicht verfügbarem Offline-Speicher bleibt die Website regulär nutzbar.
      });
    });
  }
  let installPrompt = null;
  const installButtons = [...document.querySelectorAll('.install-button')];
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    installButtons.forEach((button) => { button.hidden = false; });
  });
  installButtons.forEach((button) => button.addEventListener('click', async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      installPrompt = null;
      installButtons.forEach((item) => { item.hidden = true; });
    }
  }));
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButtons.forEach((button) => { button.hidden = true; });
  });
})();
