/* Progressive enhancement only. Without this file every page still reads and every link
   still works; what goes missing is the placeholder highlighting, the "on this page"
   column, the marker against the page you are on, and the search box. */
(function () {
  'use strict';

  /* ---- the placeholder is the product, so light it wherever it appears ---------------
     Runs over text nodes rather than innerHTML so Rouge's own spans survive intact. */
  function lightPlaceholders(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [],
      n;
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
      a.textContent = h.textContent
        .replace(/^#/, '')
        .replace(/\(v[\d.]+\+\)/, '')
        .trim();
      li.appendChild(a);
      list.appendChild(li);
    });
    toc.hidden = false;

    if ('IntersectionObserver' in window) {
      var links = {};
      list.querySelectorAll('a').forEach(function (a) {
        links[a.hash.slice(1)] = a;
      });
      var seen = new Set();
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) seen.add(e.target.id);
            else seen.delete(e.target.id);
          });
          var first = headings.filter(function (h) {
            return seen.has(h.id);
          })[0];
          Object.keys(links).forEach(function (id) {
            links[id].classList.toggle('here', !!first && id === first.id);
          });
        },
        // Pixels, not rem: IntersectionObserver throws on any other unit. 64px is the bar's 4rem.
        { rootMargin: '-64px 0px -70% 0px' },
      );
      headings.forEach(function (h) {
        observer.observe(h);
      });
    }
  }

  /* ---- search -----------------------------------------------------------------------
     search.json is one entry per heading of every page (p the page, h the heading, u the
     link, x the words under it), plus one per key row of a table, which also carries k, the
     names the row defines. Fetched the first time the box is used, not on every page load.

     Every word typed has to be found somewhere in an entry, but "found" is generous, because
     people search for what they half remember:
       - the start of a word counts, so "rebuild" finds rebuild_on;
       - the middle of one counts for less, so "build" still finds it;
       - a word the docs never use is tried as the words they do use for it (SYNONYMS), so
         "refresh" finds rebuild_on too;
       - a word nothing contains at all is taken as a typo for the nearest one that is there;
       - small words like "how" and "for" are not required, though they still count when
         they match, so "for each" finds for_each and "rebuild on" finds rebuild_on.
     A key named outright beats a heading, a heading beats the text, and the text beats a
     guess, so the row that defines a thing comes before the sections that mention it. */
  var search = document.querySelector('.search');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (search && input && results && window.fetch) {
    search.hidden = false;
    var entries = null;
    var vocabulary = null;
    var loading = null;
    var active = -1;
    var LIMIT = 20;

    var STOP =
      ' a an and are can do does for from how i in into is it its me my of on or the to use using what when where which why with you ';

    // The word someone might type, and the words the documentation uses for that idea.
    var SYNONYMS = {
      refresh: ['rebuild_on', 'rebuild'],
      reload: ['rebuild_on', 'rebuild'],
      redraw: ['rebuild_on', 'rebuild'],
      rerender: ['rebuild_on', 'rebuild'],
      update: ['rebuild_on', 'rebuild'],
      updates: ['rebuild_on', 'rebuild'],
      live: ['rebuild_on'],
      react: ['rebuild_on'],
      hide: ['visibility', 'optional', 'hidden'],
      show: ['visibility', 'if'],
      conditional: ['visibility', 'if', 'optional'],
      condition: ['visibility', 'if'],
      css: ['styling', 'styles', 'card_mod'],
      style: ['styling', 'styles'],
      colour: ['styling', 'color'],
      theme: ['styling'],
      cardmod: ['card_mod'],
      loop: ['for_each_from', 'repeat', 'repeating'],
      loops: ['for_each_from', 'repeat', 'repeating'],
      foreach: ['for_each_from'],
      iterate: ['for_each_from', 'repeat'],
      generate: ['for_each_from', 'repeat'],
      fallback: ['default', 'or'],
      missing: ['default', 'optional', 'unresolved'],
      unset: ['default', 'optional'],
      blank: ['default', 'optional', 'empty'],
      null: ['default', 'optional'],
      var: ['variables', 'variable'],
      vars: ['variables', 'variable'],
      param: ['variables', 'variable'],
      params: ['variables', 'variable'],
      parameter: ['variables', 'variable'],
      parameters: ['variables', 'variable'],
      argument: ['variables', 'variable'],
      arguments: ['variables', 'variable'],
      input: ['variables', 'selector'],
      field: ['variables', 'selector'],
      fields: ['variables', 'selector'],
      macro: ['template'],
      reuse: ['template'],
      reusable: ['template'],
      jinja: ['template', 'streamline'],
      javascript: ['streamline', 'button'],
      broken: ['troubleshooting', 'debug'],
      error: ['troubleshooting', 'debug', 'errors'],
      problem: ['troubleshooting', 'debug'],
      language: ['translate', 'translations'],
      locale: ['translate', 'translations'],
      gui: ['visual', 'editor'],
      ui: ['visual', 'editor'],
      import: ['sharing', 'share', 'community'],
      export: ['sharing', 'share', 'publish'],
      install: ['installation', 'hacs'],
      chip: ['badge', 'badges'],
      chips: ['badge', 'badges'],
      size: ['grid_options', 'layout'],
      width: ['grid_options', 'layout'],
      order: ['sort'],
      filter: ['exclude', 'domain', 'for_each_from'],
      maths: ['add', 'sub', 'mul', 'div', 'sums'],
      math: ['add', 'sub', 'mul', 'div', 'sums'],
      sum: ['add', 'sums'],
      plus: ['add'],
      minus: ['sub'],
      multiply: ['mul'],
      divide: ['div'],
      uppercase: ['upper'],
      lowercase: ['lower'],
      capitalise: ['capitalize', 'title'],
      truncate: ['max'],
      shorten: ['max'],
      dictionary: ['map', 'lookup'],
      inherit: ['extends', 'inherit_variables'],
      extend: ['extends'],
      parent: ['extends'],
      precedence: ['wins'],
      priority: ['wins'],
      overrides: ['overrides', 'wins'],
      dotted: ['name.key', 'a.b'],
      nested: ['flat', 'inherit_variables'],
      computed: ['let'],
      calculated: ['let'],
      derived: ['let'],
      global: ['decluttering_defaults', 'decluttering_let', 'decluttering_variables'],
      attribute: ['attr'],
      attributes: ['attr'],
      room: ['area', 'areas'],
      rooms: ['area', 'areas'],
      entity_id: ['entity', 'object_id'],
    };

    var load = function () {
      if (!loading) {
        loading = fetch(input.getAttribute('data-index'))
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.json();
          })
          .then(function (list) {
            var words = {};
            entries = list.map(function (e) {
              var item = {
                e: e,
                h: (e.h || e.p).toLowerCase(),
                p: e.p.toLowerCase(),
                x: e.x.toLowerCase(),
                // [[name|slug]] is found as slug, the way people say it.
                k: (e.k || []).map(function (k) {
                  return k
                    .toLowerCase()
                    .replace(/^\[\[[a-z0-9_.!?]*\|?/, '')
                    .replace(/\]\]$/, '');
                }),
              };
              (item.h + ' ' + item.k.join(' ') + ' ' + item.x).split(/[^a-z0-9_]+/).forEach(function (w) {
                if (w.length > 2) words[w] = true;
              });
              return item;
            });
            vocabulary = Object.keys(words);
          })
          .catch(function () {
            loading = null;
            entries = null;
            throw new Error('search index');
          });
      }
      return loading;
    };

    var boundary = function (text, at) {
      return at <= 0 || at >= text.length || /[^a-z0-9]/.test(text.charAt(at));
    };

    // Where the word starts a word in the text, so "rows" finds rows but not browser. An
    // underscore counts as a break, so "on" starts a word in rebuild_on as well.
    var wordAt = function (text, word, from) {
      var at = text.indexOf(word, from || 0);
      while (at !== -1 && !boundary(text, at - 1)) at = text.indexOf(word, at + 1);
      return at;
    };

    var count = function (text, word) {
      var n = 0,
        at = wordAt(text, word);
      while (at !== -1 && n < 3) {
        n++;
        at = wordAt(text, word, at + word.length);
      }
      return n;
    };

    // How well one word matches one entry; 0 for not at all. Inside a word only counts for
    // three letters or more, or "on" would be in everything.
    var score = function (item, w) {
      var inside = w.length > 2;
      var best = 0;
      item.k.forEach(function (k) {
        // A row naming a sentence (an error message) mentions a key rather than being one,
        // so it counts for less than the key's own row.
        var weight = k.indexOf(' ') === -1 ? 1 : 0.4;
        // A step is looked up by its name: or:other is "or", attr:<name> is "attr".
        if (k === w || k.replace(/[:(<].*$/, '') === w) best = Math.max(best, 60 * weight);
        else if (wordAt(k, w) !== -1) best = Math.max(best, 24 * weight);
        else if (inside && k.indexOf(w) !== -1) best = Math.max(best, 14 * weight);
      });
      var at = wordAt(item.h, w);
      if (at !== -1) best += boundary(item.h, at + w.length) ? 20 : 12;
      else if (inside && item.h.indexOf(w) !== -1) best += 6;
      if (wordAt(item.p, w) !== -1) best += 3;
      var inText = count(item.x, w);
      if (inText) best += inText;
      else if (!best && inside && item.x.indexOf(w) !== -1) best = 0.5;
      return best;
    };

    // The nearest word the docs do contain, for a word they do not: one slip in a short
    // word, two in a long one, where two letters swapped round is one slip. Nothing at all
    // rather than a wild guess.
    var distance = function (a, b, limit) {
      if (Math.abs(a.length - b.length) > limit) return limit + 1;
      var rows = [[]];
      for (var j = 0; j <= b.length; j++) rows[0][j] = j;
      for (var i = 1; i <= a.length; i++) {
        var row = (rows[i] = [i]);
        var low = i;
        for (var k = 1; k <= b.length; k++) {
          var cost = a[i - 1] === b[k - 1] ? 0 : 1;
          row[k] = Math.min(rows[i - 1][k] + 1, row[k - 1] + 1, rows[i - 1][k - 1] + cost);
          if (i > 1 && k > 1 && a[i - 1] === b[k - 2] && a[i - 2] === b[k - 1])
            row[k] = Math.min(row[k], rows[i - 2][k - 2] + 1);
          if (row[k] < low) low = row[k];
        }
        if (low > limit) return limit + 1;
      }
      return rows[a.length][b.length];
    };

    var nearest = function (w) {
      if (w.length < 4) return null;
      var limit = w.length > 7 ? 2 : 1;
      var best = null,
        bestD = limit + 1;
      vocabulary.forEach(function (v) {
        var d = distance(w, v, limit);
        if (d < bestD || (d === bestD && best && v.length < best.length)) {
          best = v;
          bestD = d;
        }
      });
      return bestD <= limit ? best : null;
    };

    var known = function (w) {
      for (var i = 0; i < vocabulary.length; i++) if (vocabulary[i].indexOf(w) !== -1) return true;
      return false;
    };

    var find = function (query) {
      var words = query.toLowerCase().split(/\s+/).filter(Boolean);
      var small = function (w) {
        return STOP.indexOf(' ' + w + ' ') !== -1;
      };
      // When every word is small ("let", "if", "or" are keys here), they are all required.
      var optional = words.some(function (w) {
        return !small(w);
      })
        ? small
        : function () {
            return false;
          };
      // Typos: a word found nowhere, and with no synonym, is swapped for the nearest real one.
      var fixed = [];
      words = words.map(function (w) {
        if (optional(w) || known(w) || SYNONYMS[w]) return w;
        var near = nearest(w);
        if (near) fixed.push(near);
        return near || w;
      });
      var phrase = words.join(' ');
      var joined = words.join('_');
      var found = [];
      entries.forEach(function (item) {
        var total = 0;
        for (var i = 0; i < words.length; i++) {
          var s = score(item, words[i]);
          // The first synonym is the likeliest meaning, so it counts for the most.
          if (!s && SYNONYMS[words[i]]) {
            SYNONYMS[words[i]].forEach(function (alt, n) {
              s = Math.max(s, score(item, alt) * Math.max(0.3, 0.7 - 0.1 * n));
            });
          }
          if (!s && !optional(words[i])) return;
          total += s;
        }
        if (words.length > 1) {
          // "rebuild on" is somebody typing rebuild_on.
          if (item.k.indexOf(joined) !== -1) total += 50;
          if (item.h.indexOf(phrase) !== -1) total += 15;
          else if (item.x.indexOf(phrase) !== -1) total += 6;
        }
        found.push({ item: item, score: total });
      });
      found.sort(function (a, b) {
        return b.score - a.score;
      });
      return { words: words, fixed: fixed, hits: found.slice(0, LIMIT), total: found.length };
    };

    // Words come back wrapped in <mark>, built as nodes so nothing in the index is ever
    // read as markup.
    var marked = function (text, words) {
      var frag = document.createDocumentFragment();
      var pattern = new RegExp(
        '(' +
          words
            .map(function (w) {
              var escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              // Two letters inside a word ("if" in notify) is noise, so those only at a start.
              return w.length > 2 ? escaped : '(?<![a-z0-9])' + escaped;
            })
            .join('|') +
          ')',
        'gi',
      );
      // Marked wherever it is, start of a word or not, since find() counts both.
      text.split(pattern).forEach(function (part, i) {
        if (!part) return;
        if (i % 2) {
          var m = document.createElement('mark');
          m.textContent = part;
          frag.appendChild(m);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      return frag;
    };

    // A line of the text around the first word that matched, cut at spaces.
    var snippet = function (x, words) {
      var lower = x.toLowerCase();
      var at = -1;
      words.forEach(function (w) {
        var i = wordAt(lower, w);
        if (i !== -1 && (at === -1 || i < at)) at = i;
      });
      if (at === -1) at = 0;
      var start = Math.max(0, at - 50);
      var end = Math.min(x.length, at + 130);
      if (start > 0) start = x.indexOf(' ', start) + 1 || start;
      if (end < x.length) end = x.lastIndexOf(' ', end) > at ? x.lastIndexOf(' ', end) : end;
      return (start > 0 ? '… ' : '') + x.slice(start, end) + (end < x.length ? ' …' : '');
    };

    var setActive = function (index) {
      var options = results.querySelectorAll('[role="option"]');
      if (!options.length) return;
      active = (index + options.length) % options.length;
      options.forEach(function (o, i) {
        o.setAttribute('aria-selected', i === active ? 'true' : 'false');
      });
      input.setAttribute('aria-activedescendant', options[active].id);
      options[active].scrollIntoView({ block: 'nearest' });
    };

    var close = function () {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };

    var message = function (text) {
      var li = document.createElement('li');
      li.className = 'search-message';
      li.setAttribute('role', 'presentation');
      li.textContent = text;
      results.appendChild(li);
    };

    var show = function () {
      var query = input.value.trim();
      results.textContent = '';
      active = -1;
      input.removeAttribute('aria-activedescendant');
      if (!query) return close();
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      if (!entries) {
        message('Loading…');
        load().then(
          function () {
            if (input.value.trim() === query) show();
          },
          function () {
            results.textContent = '';
            message('Search could not load. The navigation on the left lists every page.');
          },
        );
        return;
      }
      var found = find(query);
      if (!found.hits.length)
        return message('Nothing matches “' + query + '”. The A to Z page lists every key and step.');
      if (found.fixed.length) {
        var note = document.createElement('li');
        note.className = 'search-fixed';
        note.setAttribute('role', 'presentation');
        note.textContent = 'Showing results for ' + found.words.join(' ');
        results.appendChild(note);
      }
      found.hits.forEach(function (hit, i) {
        var e = hit.item.e;
        var li = document.createElement('li');
        li.id = 'search-result-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        var a = document.createElement('a');
        a.href = e.u;
        a.tabIndex = -1;
        var where = document.createElement('span');
        where.className = 'search-where';
        if (e.k) {
          var key = document.createElement('span');
          key.className = 'search-name';
          key.appendChild(marked(e.k.join(' · '), found.words));
          where.appendChild(key);
          where.appendChild(document.createTextNode(' — '));
        }
        where.appendChild(marked(e.h ? e.p + ' › ' + e.h : e.p, found.words));
        a.appendChild(where);
        if (e.x) {
          var text = document.createElement('span');
          text.className = 'search-text';
          text.appendChild(marked(snippet(e.x, found.words), found.words));
          a.appendChild(text);
        }
        li.appendChild(a);
        results.appendChild(li);
      });
      if (found.total > found.hits.length)
        message(found.total - found.hits.length + ' more - add a word to narrow it down.');
    };

    input.addEventListener('focus', function () {
      load().catch(function () {});
      if (input.value.trim()) show();
    });
    input.addEventListener('input', show);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        if (results.hidden) show();
        // Up from the box goes to the last result, not the second last.
        setActive(active === -1 && ev.key === 'ArrowUp' ? -1 : active + (ev.key === 'ArrowDown' ? 1 : -1));
      } else if (ev.key === 'Enter') {
        var link = results.querySelector(active === -1 ? '[role="option"] a' : '#search-result-' + active + ' a');
        if (link) {
          ev.preventDefault();
          close();
          input.blur();
          location.href = link.href;
        }
      } else if (ev.key === 'Escape') {
        if (!results.hidden) close();
        else input.blur();
      }
    });
    // A result on the page you are already on only moves the scroll, so close the list.
    results.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) close();
    });
    document.addEventListener('click', function (ev) {
      if (!search.contains(ev.target)) close();
    });
    // "/" from anywhere that is not already taking typing, as on GitHub and most docs sites.
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var t = ev.target;
      if (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName)) return;
      ev.preventDefault();
      input.focus();
      input.select();
    });
  }
})();
