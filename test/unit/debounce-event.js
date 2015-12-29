(function() {
  'use strict'

  describe('Debounce Event', function() {
    describe("debouncing a single callback", function() {
      it("debounces the event to execute the callback after the timeout", function(done) {
        var flag = false

        DebounceEvent.attach({
          elem: window,
          eventName: 'custom-event',
          done: function() {
            flag = true
          },
          timeout: 100
        })

        var event = document.createEvent('Event')
        event.initEvent('custom-event', true, true)
        window.dispatchEvent(event)
        expect(flag).to.be.false

        setTimeout(function() {
          expect(flag).to.be.true
          done()
        }, 120)
      })

      it("debounces the event to execute the callback after the timeout plus the time of subsequent events", function(done) {
        var flag = false

        DebounceEvent.attach({
          elem: window,
          eventName: 'custom-event',
          done: function() {
            flag = true
          },
          timeout: 100
        })

        var event = document.createEvent('Event')
        event.initEvent('custom-event', true, true)
        window.dispatchEvent(event)

        setTimeout(function() {
          window.dispatchEvent(event)
        }, 80)

        setTimeout(function() {
          window.dispatchEvent(event)
        }, 120)

        setTimeout(function() {
          expect(flag).to.be.false
        }, 140)

        setTimeout(function() {
          expect(flag).to.be.true
          done()
        }, 240)
      })

      describe("only once", function() {
        it("debounces the event to execute the callback after the timeout, and doesn't fire the callback more than once upon subsequent events", function(done) {
          var flag = false
          var count = 0

          DebounceEvent.attach({
            elem: window,
            eventName: 'custom-event',
            done: function() {
              flag = true
              count++
            },
            timeout: 100,
            once: true
          })

          var event = document.createEvent('Event')
          event.initEvent('custom-event', true, true)
          window.dispatchEvent(event)
          expect(flag).to.be.false

          setTimeout(function() {
            expect(flag).to.be.true
            expect(count).to.eq(1)
          }, 120)

          setTimeout(function() {
            expect(count).to.eq(1)
            done()
          }, 140)
        })
      })
    })

    describe("debouncing multiple callbacks in a batch", function() {
      it("debounces the event to execute the callbacks in the event batch after the timeout plus the time of subsequent events", function(done) {
        var flag1 = false
        var flag2 = false

        var eventKey = DebounceEvent.attach({
          elem: window,
          eventName: 'custom-event',
          done: function() {
            flag1 = true
          },
          timeout: 100
        })

        DebounceEvent.attach({
          eventKey: eventKey,
          done: function() {
            flag2 = true
          }
        })

        var event = document.createEvent('Event')
        event.initEvent('custom-event', true, true)
        window.dispatchEvent(event)

        setTimeout(function() {
          window.dispatchEvent(event)
        }, 80)

        setTimeout(function() {
          window.dispatchEvent(event)
        }, 120)

        setTimeout(function() {
          expect(flag1).to.be.false
          expect(flag2).to.be.false
        }, 140)

        setTimeout(function() {
          expect(flag1).to.be.true
          expect(flag2).to.be.true
          done()
        }, 240)
      })

      describe("only once", function() {
        it("debounces the event to execute the callback after the timeout, and doesn't fire the callbacks more than once upon subsequent events", function(done) {
          var flag1 = false
          var flag2 = false
          var count = 0

          var eventKey = DebounceEvent.attach({
            elem: window,
            eventName: 'custom-event',
            done: function() {
              flag1 = true
            },
            timeout: 100
          })

          DebounceEvent.attach({
            eventKey: eventKey,
            done: function() {
              flag2 = true
              count++
            }
          })

          var event = document.createEvent('Event')
          event.initEvent('custom-event', true, true)
          window.dispatchEvent(event)
          expect(flag1).to.be.false
          expect(flag2).to.be.false

          setTimeout(function() {
            expect(flag1).to.be.true
            expect(flag2).to.be.true
            expect(count).to.eq(1)
          }, 120)

          setTimeout(function() {
            expect(count).to.eq(1)
            done()
          }, 140)
        })
      })
    })

    describe('#detach', function() {
      describe("after the event batch has been detached", function() {
        it("stops executing all callbacks in the event batch", function(done) {
          var count1 = 0
          var count2 = 0

          var eventKey = DebounceEvent.attach({
            elem: window,
            eventName: 'custom-event',
            done: function() {
              count1++
            },
            timeout: 100
          })

          DebounceEvent.attach({
            eventKey: eventKey,
            done: function() {
              count2++
            }
          })

          var event = document.createEvent('Event')
          event.initEvent('custom-event', true, true)
          window.dispatchEvent(event)

          setTimeout(function() {
            expect(count1).to.equal(1)
            expect(count2).to.equal(1)
            DebounceEvent.detach(eventKey)
          }, 120)

          setTimeout(function() {
            expect(count1).to.equal(1)
            expect(count2).to.equal(1)
            done()
          }, 140)
        })

        it("throws an error when attempting to attach a new callback to the event batch", function() {
          var eventKey = DebounceEvent.attach({
            elem: window,
            eventName: 'custom-event',
            done: function() {},
            timeout: 100
          })

          DebounceEvent.detach(eventKey)

          expect(function() {
            DebounceEvent.attach({
              eventKey: eventKey,
              done: function() {}
            })
          }).to.throw(Error)
        })
      })
    })
  })
})()
