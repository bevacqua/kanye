# Kanye

> Smash your keyboards with ease

Browser support includes every sane browser and **IE7+**.

# Install

From `npm`

```shell
npm install kanye --save
```

From `bower`

```shell
bower install kanye --save
```

# API

Kanye exposes a few methods for interacting with keyboard events.

## `kanye.listen()`

Kanye starts listening for user keyboard input on `window`.

## `kanye.unlisten()`

Kanye stops listening for user keyboard input on `window`.

## `kanye.on(combo, filter?, listener, ctx?)`

Adds an event listener `listener` to the registry. This event listener will fire only when the user input is `combo`, and it can be optionally filtered by a `filter` selector.

- `combo` is expected to be a human-readable keyboard input string such as `cmd+a` or `cmd+shift+b`.
- `filter` is entirely optional, and helps you filter out the event target based on a selector.
- `listener` is the actual event listener that will be invoked when your query is satistied
- `context` is also optional, and it allows you to define a group of event listeners that you can `.clear` in the future

## `kanye.off(combo, filter?, listener, ctx?)`

Removes an event listener previously registered by `kanye.on`.

## `kanye.clear(context?)`

Remove all event listeners previously added with `.on` to `context`. If a `context` is not provided, every single event listener ever registered with Kanye will be removed.

# License

MIT
