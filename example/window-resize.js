(function() {

  // Register the first event in a new event batch, set to execute only once
  var eventKey1 = DebounceEvent.attach({
    elem: window,
    eventName: 'resize',
    done: function() {
      console.log('done1')
    },
    timeout: 200,
    once: true
  })

  // Register the second event in an existing event batch given the previous
  // event key
  DebounceEvent.attach({
    eventKey: eventKey1,
    done: function() {
      console.log('done2')
    },
    once: true
  })

  // Register the third event in an existing event batch given the previous
  // event key
  DebounceEvent.attach({
    eventKey: eventKey1,
    done: function() {
      console.log('done3')
    }
  })

  // Register the fourth event in a new event batch
  var eventKey2 = DebounceEvent.attach({
    elem: window,
    eventName: 'resize',
    done: function() {
      console.log('done4')
    },
    timeout: 300
  })

  // Manually detach after the given timeout
  setTimeout(function() {
    console.log('detach')
    DebounceEvent.detach(eventKey2)
  }, 5000)
})()
