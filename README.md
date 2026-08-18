# Decluttering Card Plus

📝 Reuse multiple times the same card configuration with variables to declutter your config.

[![GitHub Release][releases-shield]][releases]
[![GitHub Activity][commits-shield]][commits]
[![License][license-shield]](LICENSE)

[![Community Forum][forum-shield]][forum]

This card is for [Lovelace](https://www.home-assistant.io/lovelace) on [Home Assistant](https://www.home-assistant.io/).

We all use multiple times the same block of configuration across our lovelace configuration and we don't want to change the same things in a hundred places across our configuration each time we want to modify something.

`decluttering-card-plus` to the rescue!! This card allows you to reuse multiple times the same configuration in your lovelace configuration to avoid repetition and supports variables and default values.

## About this fork

This is a maintained continuation of [custom-cards/decluttering-card][upstream], which has not
had a release since April 2023. It combines the work of three people:

- [RomRider][romrider] — the original card.
- [j9brown][j9brown] — visual editors, and support for templating entity rows and picture
  elements as well as cards ([upstream PR #78][pr78], unmerged).
- [simbaja][simbaja] — modernisation to lit 3 and TypeScript 5, plus the `style` option.

Everything here is MIT licensed, as was all of the work it builds on.

### Migrating from `decluttering-card`

**Your existing configuration keeps working.** As well as its own `custom:decluttering-card-plus`
and `custom:decluttering-template-plus` types, this card also registers the original
`custom:decluttering-card` and `custom:decluttering-template` types when the original card is
not installed. The `decluttering_templates` key is unchanged. So you can install this, remove
the old card, and change nothing else.

If you install both cards at once, whichever loads first claims `decluttering-card` and
`decluttering-template`. Home Assistant loads resources in the order they were added, so the
original card usually wins and carries on serving your existing `custom:decluttering-card`
cards — they keep working, but they get none of the fixes here until you remove the original
card. In the other order this card serves them instead, and the original's bundle logs a
`define` error to the console when it finds the name already taken; nothing breaks, because
the type is already being served.

Either way, there is no reason to run both. Remove the original card.

New configuration should use `custom:decluttering-card-plus` and
`custom:decluttering-template-plus`, which are always available.

## Configuration

### Defining your templates

There are two ways to define your templates. You can use both methods together.

#### Option 1. Create a template as a card with the visual editor or with YAML

Add a *Custom: Decluttering Template Plus* card in any view of your dashboard to define your template,
set variables with their default values, and preview the results with those defaults with the
visual editor. The card type is `custom:decluttering-template-plus` in YAML.

You can place the template card anywhere and it will only be visible when the dashboard is in edit mode.
Each template must have a unique name.

**Example:**

```yaml
type: custom:decluttering-template-plus
template: follow_the_sun
card:
  type: entity
  entity: sun.sun
```

#### Option 2. Create a template at the root of your lovelace configuration

Open your dashboard's YAML configuration file or click on the *Raw configuration editor* menu item
in the dashboard.

The templates are defined in an object at the root of your lovelace configuration. This object is
named `decluttering_templates` and it contains your template declarations. Each template must have
a unique name.

**Example:**

```yaml
title: Example Dashboard
decluttering_templates:
  follow_the_sun:
    card:
      type: entity
      entity: sun.sun
  touch_the_sun:
    row:
      type: button
      entity: sun.sun
      action_name: Boop
  hello_sunshine:
    element:
      type: icon
      icon: mdi:weather-sunny
      title: Hello!
      style:
        color: yellow
views:
```

**Syntax:**

```yaml
decluttering_templates:
  <template name>:
    <template content>
  [...]
```

### Adding content to your templates

You can make decluttering templates for cards, entity rows, and picture elements. Each content type
has a different syntax and can be used in different places.

#### [Card](https://www.home-assistant.io/dashboards/cards/)

A decluttering template can hold a standard dashboard card, custom card, or another decluttering card.
It is particularly useful for complex cards such as stacks, grids, and tiles.

**Example:**

```yaml
type: custom:decluttering-template-plus
template: follow_the_sun
card:
  type: entity
  entity: sun.sun
```

**Syntax:**

```yaml
type: custom:decluttering-template-plus
template: <template_name>
card:
  # This is where you put your [Card](https://www.home-assistant.io/dashboards/cards/) configuration (it can be a card embedding other cards)
  type: <card_type>
  [...]
default:
  # An optional list of variables and their default values to substitute into the template
  - <variable_name>: <variable_value>
  - <variable_name>: <variable_value>
  [...]
```

#### [Entities card](https://www.home-assistant.io/dashboards/entities/) row

A decluttering template can hold an Entities card row such as a Button row or a Conditional row.

**Example:**

```yaml
type: custom:decluttering-template-plus
template: touch_the_sun
row:
  type: button
  entity: sun.sun
  action_name: Boop
```

**Syntax:**

```yaml
type: custom:decluttering-template-plus
template: <template_name>
row:
  # This is where you put your [Entities card](https://www.home-assistant.io/dashboards/entities/) row
  type: <element_type>
  [...]
default:
  # An optional list of variables and their default values to substitute into the template
  - <variable_name>: <variable_value>
  - <variable_name>: <variable_value>
  [...]
```

#### [Picture elements card](https://www.home-assistant.io/dashboards/picture-elements/) element

A decluttering template can hold a Picture elements card element such as an Icon or an Image.

**Example:**

```yaml
type: custom:decluttering-template-plus
template: hello_sunshine
element:
  type: icon
  icon: mdi:weather-sunny
  title: Hello!
  style:
    color: yellow
```

**Syntax:**

```yaml
type: custom:decluttering-template-plus
template: <template_name>
element:
  # This is where you put your [Picture elements card](https://www.home-assistant.io/dashboards/picture-elements/) element configuration
  type: <element_type>
  [...]
default:
  # An optional list of variables and their default values to substitute into the template
  - <variable_name>: <variable_value>
  - <variable_name>: <variable_value>
  [...]
```

#### Variables

Templates can contain variables. Each variable will later be replaced by a real value when you
instantiate a card which uses this template.

A variable needs to be enclosed in double square brackets `[[variable_name]]`. If a variable is alone
on its line, enclose it in single quotes: `'[[variable_name]]'`.

You can also define default values for your variables in the `default` object. The visual editor uses the
provided default values to render the preview.

**Example:**

```yaml
type: custom:decluttering-template-plus
template: touch_anything
row:
  type: button
  entity: '[[what]]'
  action_name: '[[how]]'
default:
  what: sun.sun
  how: 'Boop'
```

#### Nested variables

A variable's value can itself contain variables. Substitution repeats until nothing is left
to replace, so the order you declare them in does not matter.

```yaml
type: custom:decluttering-template-plus
template: area_sensor
card:
  type: tile
  entity: '[[entity]]'
  name: '[[label]]'
default:
  - label: '[[area]] sensor'
  - area: Garden
  - entity: sun.sun
```

Used like this, `label` resolves to `Shed sensor` — a value you pass in always wins over the
template's default, including when the placeholder only appears because of another substitution:

```yaml
type: custom:decluttering-card-plus
template: area_sensor
variables:
  - area: Shed
```

A variable that refers to itself cannot be resolved. Substitution gives up after 10 passes and
logs a warning to the browser console rather than looping forever.

### Using the card

If your template content is a card, add a *Custom: Decluttering Card Plus* to your dashboard
to instantiate your template, set variables, and preview the results with the visual editor.
The card type is `custom:decluttering-card-plus` in YAML.

If your template content is an Entities card row, first add an *Entities card* to your dashboard or
open an existing one. Then switch to the code editor and add a new item to the `entities`
list in YAML as shown below.

If your template content is a Picture elements card element, first add a *Picture elements* card to your
dashboard or open an existing one. Then switch to the code editor and add a new item to the
`elements` list in YAML as shown below.

You can also use templates in different places than they were intended. For example, an
Entities card row or Picture elements card element can be displayed as a card in the dashboard but
it might not look right.

**Example which references the previous templates:**

```yaml
type: vertical-stack
cards:
  # A card
  - type: custom:decluttering-card-plus
    template: follow_the_sun
  # An Entities card
  - type: entities
    entities:
      # An entity row
      - type: custom:decluttering-card-plus
        template: touch_the_sun
      # An entity row with variables using default values
      - type: custom:decluttering-card-plus
        template: touch_anything
      # An entity row with variables using specified values
      - type: custom:decluttering-card-plus
        template: touch_anything
        variables:
          - what: sensor.moon_phase
          - how: 'Kiss'
  # A Picture elements card
  - type: picture-elements
    elements:
      - type: custom:decluttering-card-plus
        template: hello_sunshine
        style:
          top: 50%
          left: 33%
      - type: custom:decluttering-card-plus
        template: hello_sunshine
        style:
          top: 50%
          left: 66%
```

**Syntax:**

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:decluttering-card-plus`
| template | object | **Required** | Name of your template
| variables | list | **Optional** | List of variables and their values to replace in the template content
| style | string | **Optional** | CSS styles to inject into the card. Supports variable replacement.

### Styling

The card supports injecting custom CSS styles directly into the card. This is useful for customizing the appearance of templates and instances without needing external tools like `card-mod`.

#### `decluttering-container` class

The host element is automatically assigned the `decluttering-container` class. You can use this class to target the card itself in your styles.

**Example:**

```yaml
- type: custom:decluttering-card-plus
  template: my_styled_card
  variables:
    - color: red
  style: |
    :host(.decluttering-container) {
      border: 2px solid [[color]];
    }
```

#### Template styles

You can also define styles within your templates. These styles will be injected whenever the template is used.

**Example:**

```yaml
decluttering_templates:
  my_styled_card:
    card:
      type: entity
      entity: sun.sun
    style: |
      ha-card {
        background-color: var(--primary-background-color);
        border-radius: 15px;
      }
```

## Installation

### Using HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=tempus2016&repository=decluttering-card-plus&category=lovelace)

### Manually

#### Step 1

Save [decluttering-card-plus.js][latest-release] to `<config directory>/www/decluttering-card-plus.js` on your Home Assistant instance.

**Example:**

```bash
wget https://raw.githubusercontent.com/tempus2016/decluttering-card-plus/master/dist/decluttering-card-plus.js
mv decluttering-card-plus.js /config/www/
```

#### Step 2

Link `decluttering-card-plus` inside your `ui-lovelace.yaml` or Raw Editor in the UI Editor

```yaml
resources:
  - url: /local/decluttering-card-plus.js
    type: module
```

## Troubleshooting

See this guide: [Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)

## Developers

Fork and then clone the repo to your local machine. From the cloned directory run

`npm install && npm run build`

[commits-shield]: https://img.shields.io/github/commit-activity/y/tempus2016/decluttering-card-plus.svg?style=for-the-badge
[commits]: https://github.com/tempus2016/decluttering-card-plus/commits/master
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/lovelace-decluttering-card/118625
[j9brown]: https://github.com/j9brown/decluttering-card
[latest-release]: https://github.com/tempus2016/decluttering-card-plus/releases/latest
[license-shield]: https://img.shields.io/github/license/tempus2016/decluttering-card-plus.svg?style=for-the-badge
[pr78]: https://github.com/custom-cards/decluttering-card/pull/78
[releases-shield]: https://img.shields.io/github/release/tempus2016/decluttering-card-plus.svg?style=for-the-badge
[releases]: https://github.com/tempus2016/decluttering-card-plus/releases
[romrider]: https://github.com/RomRider
[simbaja]: https://github.com/simbaja/ha-decluttering-card
[upstream]: https://github.com/custom-cards/decluttering-card
