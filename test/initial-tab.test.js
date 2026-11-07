const { check } = require('./check');
const { requestInitialTab, takeInitialTab } = require('../.test-build/initial-tab');

check('nothing asked, nothing taken', takeInitialTab(), undefined);
requestInitialTab('usages');
check('the next editor takes the tab it was asked for', takeInitialTab(), 'usages');
check('and only once', takeInitialTab(), undefined);
requestInitialTab('usages');
check('a request nobody took within five seconds lapses', takeInitialTab(Date.now() + 6000), undefined);
