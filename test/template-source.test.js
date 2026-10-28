/*
 * Unit tests for src/template-source.ts and the template source in registry.ts - a list
 * worked out by a Jinja template, rendered once over the websocket and never again.
 * Run with `npm test`.
 */
const { check } = require('./check');
const { renderTemplateOnce, templateList, sourceTemplate } = require('../.test-build/template-source.js');
const { resolveRegistryItems, registryNames, isRegistrySource } = require('../.test-build/registry.js');
const { renderStrategyTemplates, generateView } = require('../.test-build/strategy.js');

/*
 * A connection that answers render_template with the messages given, the way Home
 * Assistant does: each one delivered to the callback, then (or before) the unsubscribe.
 */
function fakeHass(messages, { unsubscribeFirst = false, reject } = {}) {
  const log = { subscribed: [], unsubscribed: 0 };
  const hass = {
    connection: {
      subscribeMessage(callback, message) {
        log.subscribed.push(message);
        if (reject) return Promise.reject(reject);
        const unsub = () => {
          log.unsubscribed += 1;
          return Promise.resolve();
        };
        if (unsubscribeFirst) {
          return Promise.resolve(unsub).then((value) => {
            setTimeout(() => messages.forEach((each) => callback(each)), 0);
            return value;
          });
        }
        messages.forEach((each) => callback(each));
        return Promise.resolve(unsub);
      },
    },
  };
  return { hass, log };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

// For entity results: a house with two lights and a hidden one, and a sensor.
const house = {
  floors: {},
  devices: {},
  areas: { kitchen: { area_id: 'kitchen', name: 'Kitchen', labels: [] } },
  entities: {
    'light.a': { entity_id: 'light.a', area_id: 'kitchen' },
    'light.b': { entity_id: 'light.b' },
    'light.hidden': { entity_id: 'light.hidden', hidden: true },
    'sensor.t': { entity_id: 'sensor.t' },
  },
  states: {
    'light.a': { attributes: { friendly_name: 'Lamp A' } },
    'light.b': { attributes: { friendly_name: 'Lamp B' } },
    'light.hidden': { attributes: { friendly_name: 'Hidden lamp' } },
    'sensor.t': { attributes: { friendly_name: 'Temperature' } },
    // In the state machine but not the entity registry - a YAML light with no unique id.
    'light.yaml': { attributes: { friendly_name: 'YAML lamp' } },
  },
};
const rendered = (template, result) => ({ rendered: { [template]: { result } } });
const T = "{{ states.light | selectattr('state','eq','on') | map(attribute='entity_id') | list }}";

(async () => {
  /* ------------------------------------------------------------- rendering once */

  {
    const { hass, log } = fakeHass([{ result: ['light.a'], listeners: {} }]);
    const render = await renderTemplateOnce(hass, T);
    check('the first result is what it rendered to', render, { result: ['light.a'] });
    check('it asks for render_template with errors reported and strict off', log.subscribed, [
      { type: 'render_template', template: T, report_errors: true, strict: false },
    ]);
    await tick();
    check('and unsubscribes straight away, so state changes never rebuild', log.unsubscribed, 1);
  }

  {
    const { hass, log } = fakeHass([{ result: [1] }, { result: [2] }], { unsubscribeFirst: true });
    const render = await renderTemplateOnce(hass, T);
    await tick();
    check(
      'a result after the unsubscribe arrived is still taken once',
      [render, log.unsubscribed],
      [{ result: [1] }, 1],
    );
  }

  {
    const { hass } = fakeHass([{ error: 'x is undefined', level: 'WARNING' }, { result: [] }]);
    check('a warning is not the end - the result after it is', await renderTemplateOnce(hass, T), { result: [] });
  }

  {
    const { hass, log } = fakeHass([{ error: "TemplateSyntaxError: unexpected '}'", level: 'ERROR' }]);
    check('an error is', await renderTemplateOnce(hass, T), { error: "TemplateSyntaxError: unexpected '}'" });
    await tick();
    check('and unsubscribes too', log.unsubscribed, 1);
  }

  {
    const { hass } = fakeHass([], { reject: { code: 'template_error', message: 'bad template' } });
    check('a refused subscription is an error, not a throw', await renderTemplateOnce(hass, T), {
      error: 'bad template',
    });
  }

  {
    const { hass } = fakeHass([]);
    check('no answer at all gives up', await renderTemplateOnce(hass, T, 10), {
      error: 'no answer from Home Assistant',
    });
  }

  check('no connection is an error', await renderTemplateOnce({}, T), { error: 'no connection to Home Assistant' });

  /* -------------------------------------------------------------- as a list */

  check('a real list is a list', templateList({ result: ['a', 1] }), { list: ['a', 1] });
  check('a JSON list in text is a list', templateList({ result: '["a", "b"]' }), { list: ['a', 'b'] });
  check("Python's quotes are read too", templateList({ result: "['light.a', 'light.b']" }), {
    list: ['light.a', 'light.b'],
  });
  check('an empty list is a list, not a problem', templateList({ result: [] }), { list: [] });
  check('a word is not a list', templateList({ result: 'light.a, light.b' }), {
    problem: 'not_list',
    detail: 'light.a, light.b',
  });
  check('a number is not either', templateList({ result: 3 }), { problem: 'not_list', detail: '3' });
  check('an error stays an error', templateList({ error: 'boom' }), { problem: 'error', detail: 'boom' });
  check('a long result is cut short for the console', templateList({ result: 'x'.repeat(200) }).detail.length, 80);

  check('sourceTemplate reads the text', sourceTemplate({ template: T }), T);
  check(
    'blank or not text is no template',
    [sourceTemplate({ template: '  ' }), sourceTemplate({ template: 3 })],
    [undefined, undefined],
  );

  /* ------------------------------------------------------ the copies it makes */

  check('a template is a source on its own', isRegistrySource({ template: T }), true);
  check('not rendered yet is no copies', resolveRegistryItems(house, { template: T }), []);

  check(
    'entity ids become the copies an entities: sweep would make, in the order rendered',
    resolveRegistryItems(house, { template: T }, rendered(T, ['light.b', 'light.a'])),
    [
      { entity: 'light.b', name: 'Lamp B', domain: 'light', area: '', area_id: '', total: 2 },
      { entity: 'light.a', name: 'Lamp A', domain: 'light', area: 'Kitchen', area_id: 'kitchen', total: 2 },
    ],
  );

  check(
    'an entity only in the state machine counts, and a hidden one picked by the template is kept',
    resolveRegistryItems(house, { template: T }, rendered(T, ['light.yaml', 'light.hidden'])).map((i) => i.name),
    ['YAML lamp', 'Hidden lamp'],
  );

  check(
    'the other filters still narrow entity results',
    resolveRegistryItems(house, { template: T, area: 'Kitchen' }, rendered(T, ['light.a', 'light.b'])).map(
      (i) => i.entity,
    ),
    ['light.a'],
  );

  check(
    'and exclude leaves some out',
    resolveRegistryItems(house, { template: T, exclude: 'light.b' }, rendered(T, ['light.a', 'light.b'])).map(
      (i) => i.entity,
    ),
    ['light.a'],
  );

  check(
    'sort, limit and offset apply',
    resolveRegistryItems(house, { template: T, sort: 'name', limit: 1 }, rendered(T, ['light.b', 'light.a'])).map(
      (i) => i.entity,
    ),
    ['light.a'],
  );

  check(
    'the same entity twice is one copy',
    resolveRegistryItems(house, { template: T }, rendered(T, ['light.a', 'light.a'])).length,
    1,
  );

  check(
    'plain values become item',
    resolveRegistryItems(house, { template: T }, rendered(T, ['Monday', 'Tuesday', 3])),
    [
      { item: 'Monday', total: 3 },
      { item: 'Tuesday', total: 3 },
      { item: 3, total: 3 },
    ],
  );

  check(
    'one unknown id makes the whole list plain values, never half and half',
    resolveRegistryItems(house, { template: T }, rendered(T, ['light.a', 'light.gone'])).map((i) => i.item ?? i.entity),
    ['light.a', 'light.gone'],
  );

  check(
    'a url carrying a token is refused wherever it sits in a copy, as attr: refuses it',
    resolveRegistryItems(
      house,
      { template: T },
      rendered(T, [
        { name: 'Front', pic: '/api/camera_proxy/camera.front?token=abc', deep: { more: 'http://x/?a=1&token=z' } },
        'http://x/?token=q',
      ]),
    ).map((item) => [item.name, item.pic, item.deep?.more, item.item]),
    [
      ['Front', undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ],
  );

  check(
    "a mapping is that copy's variables",
    resolveRegistryItems(
      house,
      { template: T },
      rendered(T, [
        { name: 'Bins', day: 'Tue' },
        { name: 'Glass', day: 'Fri' },
      ]),
    ),
    [
      { name: 'Bins', day: 'Tue', total: 2 },
      { name: 'Glass', day: 'Fri', total: 2 },
    ],
  );

  check(
    'overrides match a plain value',
    resolveRegistryItems(
      house,
      { template: T, overrides: { 'Mon*': { icon: 'mdi:x' } } },
      rendered(T, ['Monday', 'Friday']),
    ).map((i) => i.icon ?? ''),
    ['mdi:x', ''],
  );

  check(
    'a result that is not a list makes no copies',
    resolveRegistryItems(house, { template: T }, rendered(T, 'light.a')),
    [],
  );
  check(
    'nor does an error',
    resolveRegistryItems(house, { template: T }, { rendered: { [T]: { error: 'boom' } } }),
    [],
  );
  check(
    'a template text that is also an Object method name finds nothing it did not render',
    resolveRegistryItems(house, { template: 'toString' }, { rendered: {} }),
    [],
  );

  check(
    'text from the template is substituted as text, never read as a placeholder',
    resolveRegistryItems(house, { template: T }, rendered(T, ['[[secret]]']))[0].item === '[[secret]]',
    false,
  );

  check('a template source names entity variables and item', registryNames({ template: T }), [
    'entity',
    'name',
    'domain',
    'area',
    'area_id',
    'total',
    'item',
  ]);

  /* ---------------------------------------------------------- in the strategy */

  const asked = [];
  const strategy = {
    sections: [
      { for_each_from: { template: T }, section: { type: 'grid', cards: [{ type: 'tile', entity: '[[entity]]' }] } },
      { for_each_from: { template: T }, section: { type: 'grid', cards: [] } },
      { type: 'grid', cards: [] },
    ],
    badges: [{ for_each_from: { template: '{{ [1, 2] }}' }, badge: { type: 'entity', name: '[[item]]' } }],
  };
  const renders = await renderStrategyTemplates(strategy, async (template) => {
    asked.push(template);
    return { result: template === T ? ['light.a'] : [1, 2] };
  });
  check('the strategy renders each distinct template once', asked, [T, '{{ [1, 2] }}']);
  const view = generateView(strategy, house, { rendered: renders });
  check('and its sections are written from what they rendered', view.sections[0].cards, [
    { type: 'tile', entity: 'light.a' },
  ]);
  check(
    'its badges too, a whole-value placeholder keeping the number',
    view.badges.map((b) => b.name),
    [1, 2],
  );
})();
