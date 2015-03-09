'use strict';

var sektor = require('sektor');
var crossvent = require('crossvent');
var rspaces = /\s+/g;
var keymap = {
  13: 'enter',
  27: 'esc',
  32: 'space'
};
var handlers = {};

function listen () {
  bind();
}

function unlisten () {
  bind(true);
}

function bind (remove) {
  var op = remove ? 'remove' : 'add';
  crossvent[op](window, 'keypress', keypress);
  crossvent[op](window, 'keydown', keydown);
}

function clear (context) {
  if (context) {
    if (context in handlers) {
      handlers[context] = {};
    }
  } else {
    handlers = {};
  }
}

function switchboard (then, combo, filter, fn, ctx) {
  if (ctx === void 0 && fn === void 0) {
    fn = filter;
    filter = null;
  } else if (typeof fn !== 'function') {
    ctx = fn;
    fn = filter;
  }

  var context = ctx || 'defaults';

  if (!fn) {
    return;
  }

  if (handlers[context] === void 0) {
    handlers[context] = {};
  }

  combo.toLowerCase().split(rspaces).forEach(item);

  function item (keys) {
    var c = keys.trim();
    if (c.length === 0) {
      return;
    }
    then(handlers[context], c, fn, filter);
  }
}

function on (combo, filter, fn, ctx) {
  switchboard(add, combo, filter, fn, ctx);

  function add (area, key, fn, filter) {
    var handler = {
      handle: fn,
      filter: filter
    };
    if (area[key]) {
      area[key].push(handler);
    } else {
      area[key] = [handler];
    }
  }
}

function off (combo, filter, fn, ctx) {
  switchboard(rm, combo, filter, fn, ctx);

  function rm (area, key, fn, filter) {
    if (area[key]) {
      area[key] = area[key].filter(matching);
    }

    function matching (handler) {
      return handler.handle === fn && handler.filter === filter;
    }
  }
}

function getKeyCode (e) {
  return e.which || e.keyCode || e.charCode;
}

function keypress (e) {
  var code = getKeyCode(e);
  var key = String.fromCharCode(code);
  if (key && keymap[code] === void 0) {
    handle(key, e);
  }
}

function keydown (e) {
  var code = getKeyCode(e);
  var key = keymap[code];
  if (key) {
    handle(key, e);
  }
}

function parseKeyCombo (key, e) {
  var combo = [key];
  if (e.shiftKey) {
    combo.unshift('shift');
  }
  if (e.altKey) {
    combo.unshift('alt');
  }
  if (e.ctrlKey ^ e.metaKey) {
    combo.unshift('cmd');
  }
  return combo.join('+');
}

function handle (key, e) {
  var combo = parseKeyCombo(key, e);
  var context;
  for (context in handlers) {
    if (handlers[context][combo]) {
      handlers[context][combo].forEach(exec);
    }
  }

  function exec (handler) {
    if (handler.filter && sektor.matchesSelector(e.target, handler.filter) === false) {
      return;
    }
    handler.handle(e);
  }
}

module.exports = {
  listen: listen,
  unlisten: unlisten,
  on: on,
  off: off,
  clear: clear
};
