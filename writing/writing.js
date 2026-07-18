/* faiman.com /writing/ — click-to-enlarge lightbox for the architecture diagrams.
   Vector SVGs scale crisply, so enlarging makes the small labels easy to read. */
(function () {
  var diagrams = [].slice.call(document.querySelectorAll('.diagram'));
  if (!diagrams.length) return;

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // One reusable overlay for every diagram.
  var ov = document.createElement('div');
  ov.className = 'lightbox';
  ov.hidden = true;
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Enlarged diagram');

  var big = document.createElement('img');
  big.alt = '';

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lb-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '×';

  var hint = document.createElement('div');
  hint.className = 'lb-hint';
  hint.textContent = 'click anywhere or press Esc to close';

  ov.appendChild(big);
  ov.appendChild(closeBtn);
  ov.appendChild(hint);
  document.body.appendChild(ov);

  var lastFocus = null;

  function open(src, alt) {
    big.src = src;
    big.alt = alt || 'Enlarged diagram';
    lastFocus = document.activeElement;
    ov.hidden = false;
    if (reduce) {
      ov.classList.add('open');
    } else {
      requestAnimationFrame(function () { ov.classList.add('open'); });
    }
    document.addEventListener('keydown', onKey);
    closeBtn.focus();
  }

  function finishClose() {
    ov.hidden = true;
    big.removeAttribute('src');
    ov.removeEventListener('transitionend', finishClose);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function close() {
    ov.classList.remove('open');
    document.removeEventListener('keydown', onKey);
    if (reduce) {
      finishClose();
    } else {
      ov.addEventListener('transitionend', finishClose);
      setTimeout(finishClose, 260); // fallback if transitionend doesn't fire
    }
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  ov.addEventListener('click', close);
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });

  diagrams.forEach(function (dia) {
    var img = dia.querySelector('img');
    if (!img) return;

    dia.setAttribute('role', 'button');
    dia.setAttribute('tabindex', '0');
    dia.setAttribute('aria-label', 'Enlarge diagram');
    dia.title = 'Click to enlarge';

    function trigger() { open(img.currentSrc || img.src, img.alt); }
    dia.addEventListener('click', trigger);
    dia.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });

    var fig = dia.closest('figure');
    if (fig) {
      var badge = document.createElement('span');
      badge.className = 'lb-badge';
      badge.textContent = '⤢ Enlarge';
      fig.appendChild(badge);
    }
  });
})();
