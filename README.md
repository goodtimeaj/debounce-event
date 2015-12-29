# Debounce Event

Debounces batched browser event callback execution until the last event within a given time period. The utility returns a key upon event/callback attachment which can be later used to attach multiple callbacks to the same debounced event batch by given element, event name, and timeout. Debounced event batches can be manually detached, or will detach automatically if the callback is specified to be executed only once.

## Usage

### Include

Script include creates global `DebounceEvent`:

```html
<script src="debounce-event.min.js"></script>
```


AMD:

```html
<script src="debounce-event.min.js"></script>
<script>
  define([debounce-event], function() {
     // do something
  })
<script>
```


CommonJS:

```bash
npm install debounce-event
```

```javascript
require 'debounce-event'
```

### API

#### Debounce Initializer Parameters

`DebounceEvent.attach()` takes an object with the following named parameters:

| Name | Description | Required |
| ---- | ----------- | -------- |
| eventName | Name of the browser event to handle. | if `eventKey` not given |
| elem | DOM element to attach the event handler. | if `eventKey` not given |
| done | Callback to execute on the debounced event. | always |
| timeout | Timeout (ms) at which to debounce the event before executing the callback. | always |
| once | True if the callback should execute only once. If the event is the only event in its group, its handler will be detached after the callback executes. Default is `false`. | no |
| eventKey | Previously returned key of an event group to add this callback. If this parameter is specified, `eventName` and `elem` are not used since an event group uses a common event handler. | no |

#### Example

```javascript
// Register the first event in a new event batch, set to execute only once
var eventKey = DebounceEvent.attach({
  eventName: 'resize',
  elem: window,
  done: function() {
    console.log('done 1')
  },
  timeout: 200,
  once: true
})

// Register the second event in an existing event batch given the previous
// event key
DebounceEvent.attach({
  eventKey: eventKey1,
  done: function() {
    console.log('done 2')
  },
  once: true
})

// Register the third event in a new event batch
var eventKey2 = DebounceEvent.attach({
  eventName: 'resize',
  elem: window,
  done: function() {
    console.log('done 3')
  },
  timeout: 300
})

// Manually detach the given event group
DebounceEvent.detach(eventKey2)
```

## Development

```bash
$ cd debounce-event
$ npm install
$ grunt install
$ grunt build
$ grunt test

# Build for release
$ grunt dist
```

## License

Copyright (c) 2016 Greg Stallings. See [LICENSE](https://github.com/gregstallings/debounce-event/blob/master/LICENSE) for details.
