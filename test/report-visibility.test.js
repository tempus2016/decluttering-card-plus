/*
 * Unit tests for src/report-visibility.ts (#460): which `report_entity:` states hide the
 * debug report, and which `report_entity:` values count as an entity at all. Run with `npm test`.
 */
const { check } = require('./check.js');
const { reportSwitchedOff, reportEntity } = require('../.test-build/report-visibility.js');

const hass = (state) => ({ states: { 'input_boolean.reports': state === undefined ? undefined : { state } } });

// report_entity: only off hides the report
check('report_entity: off', reportSwitchedOff(hass('off'), 'input_boolean.reports'), true);
check('report_entity: on', reportSwitchedOff(hass('on'), 'input_boolean.reports'), false);
check('report_entity: unavailable', reportSwitchedOff(hass('unavailable'), 'input_boolean.reports'), false);
check('report_entity: unknown', reportSwitchedOff(hass('unknown'), 'input_boolean.reports'), false);

// report_entity: a missing entity or no hass leaves the report showing
check('report_entity: missing entity', reportSwitchedOff(hass(undefined), 'input_boolean.reports'), false);
check('report_entity: other entity', reportSwitchedOff(hass('off'), 'input_boolean.other'), false);
check('report_entity: no hass', reportSwitchedOff(undefined, 'input_boolean.reports'), false);
check('report_entity: no entity named', reportSwitchedOff(hass('off'), undefined), false);

// report_entity: only an entity id is taken
check('report_entity: id', reportEntity('input_boolean.reports'), 'input_boolean.reports');
check('report_entity: trimmed', reportEntity('  switch.dcp_reports '), 'switch.dcp_reports');
check('report_entity: placeholder', reportEntity('[[reports]]'), undefined);
check('report_entity: no domain', reportEntity('reports'), undefined);
check('report_entity: not text', reportEntity(true), undefined);
check('report_entity: absent', reportEntity(undefined), undefined);
