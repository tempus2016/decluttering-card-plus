# Security

## What this card can reach

It runs in your browser, as part of Home Assistant's frontend, with whatever access the
logged-in user has. In the course of doing its job it reads:

- the dashboard's configuration, including templates defined on other dashboards you have
  listed in `decluttering_templates_from`;
- Home Assistant's area, floor, device, entity and label registries, when a card repeats
  over them or a placeholder asks for a name;
- the attributes of entities a template names, for `attr:` and `device_class`.

Everything it reads from Home Assistant is treated as text: a device name, a friendly name
or an attribute that happens to look like a placeholder is shown as written, never read as
template code, and an attribute that carries a token (`access_token`, `entity_picture`,
`entity_picture_local`, or any value with `token=` in it) is refused. The same text is kept
from opening a language another card runs: a name shaped like button-card JavaScript
(`[[[ ... ]]]`), a Jinja template (`{{ ... }}`, `{% ... %}`) or a config-template-card
expression (`${ ... }`) reaches that card with an invisible word joiner (U+2060) inside the
opening brackets, so it is shown as a name and not run. Inside a stylesheet - the template's
`style:`, card-mod's `card_mod:`, button-card's `styles:` - the characters that would let a
name end a declaration or fetch something are taken out of it altogether.

One thing it cannot do is quote Home Assistant's text for you inside code you wrote: a
placeholder inside a JavaScript or Jinja string literal, `[[[ return '[[name]]' ]]]`, is still
the author's string with whatever the name holds spliced in. Write `[[name|json]]` there, which
puts the name in as a quoted, escaped string literal.

A dashboard never reaches the internet by being opened. The starter templates in the editor
are carried in the bundle rather than fetched. The one network request the card makes is the
editor's "Load shared templates" button, which asks GitHub's public API for the posts in the
project's [Share your templates][share] discussion category, without a token, and keeps the
list for six hours. Anyone with a GitHub account can post there and nobody checks what they
post, so the editor shows the whole post before offering to install it and says what the
template would do once installed: the services it calls, the addresses it reaches, whether it
embeds a page, and whether it carries JavaScript or Jinja. Read that before you install, as
you would before pasting YAML from a forum.

It writes to your dashboard only where you ask it to: renaming a template, duplicating one,
installing a starter or a shared template, and moving a dashboard off the original card's
type names. Each of those asks twice before saving, and says what it is about to change.

[share]: https://github.com/tempus2016/decluttering-card-plus/discussions/categories/share-your-templates

## Reporting something

Please report privately through [GitHub's advisory form][advisory] rather than opening an
issue, and give it a few days before saying anything publicly.

Useful things to include: what an attacker would gain, the dashboard YAML that shows it, and
the Home Assistant version. A proof of concept is welcome but not required.

[advisory]: https://github.com/tempus2016/decluttering-card-plus/security/advisories/new
