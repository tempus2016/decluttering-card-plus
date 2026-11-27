/*
 * The trash's watcher (src/trash.ts) when saves come close together or the connection lets
 * it down: every save's templates are kept, and nothing is left rejected with nobody
 * listening. Run with `npm test`.
 */
const { watchForTrash, TRASH_KEY } = require('../.test-build/trash.js');

const { check } = require('./check');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  global.document = { location: { pathname: '/first/0' } };
  const unhandled = [];
  process.on('unhandledRejection', (reason) => unhandled.push(String(reason?.message ?? reason)));

  const template = (name) => ({ type: 'custom:decluttering-template-plus', template: name, card: { type: 'tile' } });
  const dashboards = {
    first: { views: [{ cards: [template('one')] }] },
    second: { views: [{ cards: [template('two')] }] },
    lovelace: { views: [] },
  };
  let stored = [];
  let failWrites = 0;
  let handler;
  let subscriptions = 0;
  const hass = {
    user: { is_admin: true },
    connection: {
      subscribeEvents: (callback) => {
        subscriptions += 1;
        handler = callback;
        // As a connection that then drops answers: the subscription itself fails.
        return Promise.reject(new Error('Connection lost'));
      },
    },
    callWS: async (message) => {
      await wait(5);
      if (message.type === 'lovelace/dashboards/list') return [{ url_path: 'first' }, { url_path: 'second' }];
      if (message.type === 'lovelace/config') return dashboards[message.url_path ?? 'lovelace'];
      if (message.type === 'frontend/get_user_data') return { value: message.key === TRASH_KEY ? stored : undefined };
      if (message.type === 'frontend/set_user_data') {
        if (failWrites > 0) {
          failWrites -= 1;
          throw new Error('Connection lost');
        }
        stored = message.value;
      }
      return null;
    },
  };
  watchForTrash(hass, 20);
  await wait(80);
  check('a failed subscription is asked for once more, and only once', subscriptions, 2);

  // Two dashboards saved in the same moment, each losing a template.
  dashboards.first = { views: [{ cards: [] }] };
  dashboards.second = { views: [{ cards: [] }] };
  handler({ data: { url_path: 'first' } });
  handler({ data: { url_path: 'second' } });
  await wait(120);
  check('two saves at once both reach the trash', stored.map((entry) => `${entry.dashboard}/${entry.name}`).sort(), [
    'first/one',
    'second/two',
  ]);

  // A write that fails loses that entry, and the watcher goes on.
  dashboards.first = { views: [{ cards: [template('three')] }] };
  handler({ data: { url_path: 'first' } });
  await wait(60);
  failWrites = 1;
  dashboards.first = { views: [{ cards: [] }] };
  handler({ data: { url_path: 'first' } });
  await wait(60);
  dashboards.second = { views: [{ cards: [template('four')] }] };
  handler({ data: { url_path: 'second' } });
  await wait(60);
  dashboards.second = { views: [{ cards: [] }] };
  handler({ data: { url_path: 'second' } });
  await wait(80);
  check('a save after a failed write is still kept', stored.map((entry) => `${entry.dashboard}/${entry.name}`).sort(), [
    'first/one',
    'second/four',
    'second/two',
  ]);
  check('and nothing is left rejected with nobody listening', unhandled, []);
})();
