/* Live demo (live-demo.html): shows the YAML the demo is drawn from, read out of the
   ha-embed-* script tags themselves, so the page and what it shows cannot drift apart. */
(function () {
  'use strict';
  document.querySelectorAll('.live-demo-yaml[data-from]').forEach(function (box) {
    var source = document.querySelector(box.getAttribute('data-from') + ' > script[type="text/yaml"]');
    if (!source) return;
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    code.textContent = source.textContent.replace(/^\n+|\s+$/g, '');
    pre.appendChild(code);
    box.appendChild(pre);
  });
})();
