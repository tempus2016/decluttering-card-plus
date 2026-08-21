# Security

## What this card can reach

It runs in your browser, as part of Home Assistant's frontend, with whatever access the
logged-in user has. In the course of doing its job it reads:

- the dashboard's configuration, including templates defined on other dashboards you have
  listed in `decluttering_templates_from`;
- Home Assistant's area, floor, device, entity and label registries, when a card repeats
  over them or a placeholder asks for a name;
- the attributes of entities a template names, for `attr:` and `device_class`.

It makes no network requests of its own. The starter templates in the editor are carried in
the bundle rather than fetched, so using one does not contact anything.

It writes to your dashboard only where you ask it to: renaming a template, duplicating one,
installing a starter, and moving a dashboard off the original card's type names. Each of
those asks twice before saving, and says what it is about to change.

## Reporting something

Please report privately through [GitHub's advisory form][advisory] rather than opening an
issue, and give it a few days before saying anything publicly.

Useful things to include: what an attacker would gain, the dashboard YAML that shows it, and
the Home Assistant version. A proof of concept is welcome but not required.

[advisory]: https://github.com/tempus2016/decluttering-card-plus/security/advisories/new
