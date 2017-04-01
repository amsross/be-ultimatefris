const sinon = require('sinon')
const test = require('tape')
const api = require('../../models/api')

test('models/api', assert => {
  const listeners = {}
  const emitter = {
    'on': sinon.spy((event, reducer) => {
      listeners[event] = reducer
    }),
    'emit': sinon.spy((event, data) => {})
  }

  assert.test('reducers', assert => {
    assert.test('selectGame', assert => {
      const state = {
        'games': [{'id': 1}, {'id': 2}]
      }
      api(state, emitter)
      emitter.on.reset()

      listeners.selectGame({'id': 2, 'coords': [50, 70]})

      assert.equal(emitter.emit.callCount, 2, 'correct number of emitted events')
      assert.ok(emitter.emit.calledWith('updateCoords', [50, 70]), 'coords were set to those of supplied game')
      assert.ok(emitter.emit.calledWith('render'), 'rendered after updates')

      assert.deepEqual(state.coords, [50, 70])

      emitter.on.reset()
      emitter.emit.reset()
      assert.end()
    })

    assert.test('unselectGame', assert => {
      const state = {
        'games': [{'id': 1}, {'id': 2}],
        'game': {'id': 1}
      }
      api(state, emitter)
      emitter.on.reset()

      listeners.unselectGame()

      assert.equal(emitter.emit.callCount, 1, 'correct number of emitted events')
      assert.ok(emitter.emit.calledWith('render'), 'rendered after updates')

      assert.equal(state.game, null, 'should set the state\'s \'game\' prop to null')

      emitter.on.reset()
      emitter.emit.reset()
      assert.end()
    })

    assert.test('updateCoords', assert => {
      const state = {
        'games': [{'id': 1}, {'id': 2}],
        'game': {'id': 1}
      }
      api(state, emitter)
      emitter.on.reset()

      listeners.updateCoords([50, 70])

      assert.equal(emitter.emit.callCount, 0, 'correct number of emitted events')

      assert.deepEqual(state.coords, [50, 70], 'should set the state\'s \'coords\' prop to the supplied coords')

      emitter.on.reset()
      emitter.emit.reset()
      assert.end()
    })

    assert.test('receiveGames', assert => {
      const state = {
        'game': {'id': 1, 'bar': 'baz'},
        'games': []
      }
      api(state, emitter)
      emitter.on.reset()

      listeners.receiveGames([{'id': 1, 'bar': 'foo'}])

      assert.equal(emitter.emit.callCount, 1, 'correct number of emitted events')
      assert.ok(emitter.emit.calledWith('render'), 'rendered after updates')

      assert.deepEqual(state.games,
        [{'id': 1, 'bar': 'foo'}],
        'should set the state\'s \'games\' prop to the supplied array')

      assert.deepEqual(state.game,
        {'id': 1, 'bar': 'foo'},
        'should update \'game\' prop with the new version from the passed array')

      emitter.on.reset()
      emitter.emit.reset()

      assert.end()
    })

    assert.end()
  })

  assert.test('effects', assert => {
    assert.test('updateLocation', assert => {
      const state = {
        'game': {'id': 1, 'location': 'foo', 'coords': [0, 0]}
      }
      api(state, emitter)
      emitter.on.reset()

      listeners.updateLocation('1600 Pennsylvania Ave NW, Washington, DC 20006')

      setTimeout(() => {
        assert.equal(emitter.emit.callCount, 1, 'correct number of emitted events')
        assert.ok(emitter.emit.calledWith('selectGame'), 'select the game ')

        assert.deepEqual(state.game.coords,
          [ 38.8987586, -77.0376581 ],
          'should set game\'s \'coords\' prop to the returned value')

        assert.deepEqual(state.game.location,
          '1600 Pennsylvania Ave NW, Washington, DC 20006',
          'should set game\'s \'location\' prop to the passed value')

        emitter.on.reset()
        emitter.emit.reset()

        assert.end()
      }, 1000)
    })

    assert.test('moveMap', assert => {
      const state = {}
      api(state, emitter)
      emitter.on.reset()

      listeners.moveMap([50, 70])

      setTimeout(() => {
        assert.equal(emitter.emit.callCount, 2, 'correct number of emitted events')
        assert.ok(emitter.emit.calledWith('updateCoords', [50, 70]), 'properly set coords')
        assert.ok(emitter.emit.calledWith('readGames'), 'query for games within map bounds')

        emitter.on.reset()
        emitter.emit.reset()

        state.coords = [50, 70]
        listeners.moveMap([50, 70])

        setTimeout(() => {
          assert.equal(emitter.emit.callCount, 0, 'correct number of emitted events')

          emitter.on.reset()
          emitter.emit.reset()

          assert.end()
        }, 350)
      }, 350)
    })

    assert.end()
  })

  assert.end()
})
