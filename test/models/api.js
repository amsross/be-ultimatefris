const sinon = require('sinon')
const test = require('tape')

test('models/api', assert => {

  assert.test('reducers', assert => {
    const reducers = {}
    const emitter = {
      'on': sinon.spy((event, reducer) => {
        reducers[event] = reducer
      }),
      'emit': sinon.spy((event, data) => {})
    }

    assert.test('selectGame', assert => {
      const state = {
        'games': [{'id': 1}, {'id': 2}]
      }
      const api = require('../../models/api')(state, emitter)
      emitter.on.reset()

      reducers.selectGame({'id': 2, 'coords': [50, 70]})

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
      const api = require('../../models/api')(state, emitter)
      emitter.on.reset()

      reducers.unselectGame()

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
      const api = require('../../models/api')(state, emitter)
      emitter.on.reset()

      reducers.updateCoords([50, 70])

      assert.equal(emitter.emit.callCount, 0, 'correct number of emitted events')

      assert.deepEqual(state.coords, [50, 70], 'should set the state\'s \'coords\' prop to the supplied coords')

      emitter.on.reset()
      emitter.emit.reset()
      assert.end()
    })

    assert.test('receiveGames', assert => {
      const state = {
        'game': {'id': 1, 'bar': 'baz'},
        'games': [],
      }
      const api = require('../../models/api')(state, emitter)
      emitter.on.reset()

      reducers.receiveGames([{'id': 1, 'bar': 'foo'}])

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

  assert.end()
})
