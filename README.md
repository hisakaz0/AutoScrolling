[![icon][icon] AutoScrolling](https://addons.mozilla.org/ja/firefox/addon/autoscrolling/)
============================
[![build status](https://circleci.com/gh/pinkienort/AutoScrolling.svg?style=svg)](https://circleci.com/gh/pinkienort/AutoScrolling)
[![dev dependencies](https://david-dm.org/pinkienort/AutoScrolling.svg)](https://david-dm.org/pinkienort/AutoScrolling?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/pinkienort/AutoScrolling.svg)](https://greenkeeper.io/)

[AutoScrolling] for Firefox browser enables you auto-scrolling without using
mouse wheel and works in even a non-active window. This plugin
is available on newer version(from 53.0) of Firefox, because the plugin is not
legacy one, but not is coded [WebExtensions].

## Install

```
npm install
```

## Development

For script ...

```
npm start
```

For CSS and HTML ...

```
npm run start:gulp
```

## Build and lint check

Build scripts in production mode.

```
npm run build
```

`lint` is for syntax of codes. `lint:ext` is for packaing for addon.

```
npm run lint # eslint
npm run lint:ext # web-ext lint
```

## Contributes and Pull requests.

If you have some questions, please tell me or issue, or send PRs.
Thank you.

[AutoScrolling]: https://addons.mozilla.org/ja/firefox/addon/autoscrolling/
[WebExtensions]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions
[icon]: https://addons.cdn.mozilla.net/user-media/addon_icons/840/840622-64.png
