![icon][icon] AutoScrolling  
============================



[AutoScrolling] for Firefox browser enables you auto-scrolling without using
mouse wheel and works in even a non-active window. This plugin
is available on newer version(from 53.0) of Firefox, because the plugin is not
legacy one, but not is coded [WebExtensions].


## Building with web-ext

[web-ext] is that

> web-ext is a command line tool designed to speed up various parts of the
> extension development process, making development faster and easier. This
> article explains how to install and use web-ext.

To test and build this plugin, installing the web-ext command.  See the
documents of above web-ext page.

## Test and Build

```sh
### Lint

Currently `eslint` is used intead of `web-ext lint` .

```sh
npm run lint
# or
make lint
```


### Build

```sh
make build
```

If you test the plugin in off-line, `test/run-server.sh` may be useful.
The shellscript run a server and you can access test page on
`localhost:8080`. To kill the server, please run `test/kill-server.sh`.

---


## How to use

1. [Install AutoScrolling plugin from add-ons of mozilla][AutoScrolling].
2. To start auto-scrolling, click the icon on toolbar.

When you do which one of following action, auto-scrolling is stopped.

- Clicking the icon on a toolbar again.
- Changing the active tab on active window.

Else, even if you do following actions, scrolling is not stopped.

- Changing the active tab on inactive window.


### Settings(Options)

User can change behavior of this plugin from the setting page.

__Scrolling Speed__

The value is scrolling speed. Max is 99, min is 1. Default is 50.

__To stop scrolling by click__

The setting decide whether stopping the scrolling when you click the scrolling
window. Default is enabled.


## Contributes and Pull requests.

If you have some questions, please tell me or issue, or send PRs. Thx.


[AutoScrolling]: https://addons.mozilla.org/ja/firefox/addon/autoscrolling/
[WebExtensions]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions
[icon]: https://addons.cdn.mozilla.net/user-media/addon_icons/840/840622-64.png
[web-ext]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext
