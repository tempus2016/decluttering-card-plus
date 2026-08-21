/* Progressive enhancement only. Without this file every page still reads and every link
   still works; what goes missing is the placeholder highlighting, the "on this page"
   column, and the marker against the page you are on. */
(function () {
  'use strict';

  /* ---- the placeholder is the product, so light it wherever it appears ---------------
     Runs over text nodes rather than innerHTML so Rouge's own spans survive intact. */
  function lightPlaceholders(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.indexOf('[[') !== -1) nodes.push(n);

    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\[\[[^\]\n]+\]\])/);
      if (parts.length < 2) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (/^\[\[[^\]\n]+\]\]$/.test(part)) {
          var span = document.createElement('span');
          span.className = 'ph-var';
          span.textContent = part;
          frag.appendChild(span);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  document.querySelectorAll('.content pre, .content code').forEach(function (el) {
    if (!el.closest('pre') || el.tagName === 'PRE') lightPlaceholders(el);
  });

  /* ---- mark the page you are on ---------------------------------------------------- */
  var here = location.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.pathname.replace(/\/$/, '/index.html') === here) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ---- on this page ---------------------------------------------------------------- */
  var toc = document.getElementById('toc');
  var list = toc && toc.querySelector('ul');
  var headings = [].slice.call(document.querySelectorAll('.content h2[id]'));

  if (list && headings.length > 1) {
    headings.forEach(function (h) {
      // Give the heading a quiet anchor handle while we are here.
      var handle = document.createElement('a');
      handle.className = 'anchor';
      handle.href = '#' + h.id;
      handle.textContent = '#';
      handle.setAttribute('aria-label', 'Link to this section');
      h.insertBefore(handle, h.firstChild);

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      // Drop the *(v1.1.0+)* tag; the column is for finding your place, not for detail.
      a.textContent = h.textContent.replace(/^#/, '').replace(/\(v[\d.]+\+\)/, '').trim();
      li.appendChild(a);
      list.appendChild(li);
    });
    toc.hidden = false;

    if ('IntersectionObserver' in window) {
      var links = {};
      list.querySelectorAll('a').forEach(function (a) { links[a.hash.slice(1)] = a; });
      var seen = new Set();
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id);
        });
        var first = headings.filter(function (h) { return seen.has(h.id); })[0];
        Object.keys(links).forEach(function (id) {
          links[id].classList.toggle('here', !!first && id === first.id);
        });
      }, { rootMargin: '-4rem 0px -70% 0px' });
      headings.forEach(function (h) { observer.observe(h); });
    }
  }
})();
