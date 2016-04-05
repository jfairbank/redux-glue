/* @flow */
import test from 'ava';
import td from 'testdouble';
import glue from '../src/glue';
import glueMiddleware from '../src/middleware';

import {
  helloAction,
  worldAction,
  hello,
  world,
  increment,
  decrement,
} from './helpers';

let next;
let store;
let appliedMiddleware;

test.beforeEach(() => {
  next = td.function('next');
  store = td.object(['dispatch']);
  appliedMiddleware = glueMiddleware(store)(next);
});

test('dispatches each glued action', t => {
  const gluedAction = glue(helloAction, worldAction)();
  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch(helloAction)),
    undefined
  );

  t.is(
    td.verify(store.dispatch(worldAction)),
    undefined
  );
});

test('dispatches each action from an action creator', t => {
  const gluedAction = glue(hello, world)();
  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch(helloAction)),
    undefined
  );

  t.is(
    td.verify(store.dispatch(worldAction)),
    undefined
  );
});

test('dispatches each literal action or action from an action creator', t => {
  const gluedAction = glue(helloAction, world)();
  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch(helloAction)),
    undefined
  );

  t.is(
    td.verify(store.dispatch(worldAction)),
    undefined
  );
});

test('dispatches each action creator with its args', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);
  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch({ type: 'INCREMENT', n: 42 })),
    undefined
  );

  t.is(
    td.verify(store.dispatch({ type: 'DECREMENT', n: 13 })),
    undefined
  );
});

test('dispatches each action with args applied early', t => {
  const gluedAction = glue(
    increment(42),
    decrement(13)
  )();

  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch({ type: 'INCREMENT', n: 42 })),
    undefined
  );

  t.is(
    td.verify(store.dispatch({ type: 'DECREMENT', n: 13 })),
    undefined
  );
});

test('dispatches a mix of early and late args', t => {
  const gluedAction = glue(
    increment(42),
    decrement
  )([13]);

  const result = appliedMiddleware(gluedAction);

  t.true(result);

  t.is(
    td.verify(store.dispatch({ type: 'INCREMENT', n: 42 })),
    undefined
  );

  t.is(
    td.verify(store.dispatch({ type: 'DECREMENT', n: 13 })),
    undefined
  );
});

//test('does not dispatch other actions', t => {
//  appli
//});
