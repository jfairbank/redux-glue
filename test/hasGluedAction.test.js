/* @flow */
import test from 'ava';
import glue from '../src/glue';
import hasGluedAction from '../src/hasGluedAction';

import {
  helloAction,
  worldAction,
  holaAction,
  hello,
  world,
  hola,
  increment,
  decrement,
} from './helpers';

test('it returns true if it has the glued action', t => {
  const glueAction = glue(hello, world)();

  t.true(
    hasGluedAction(glueAction, helloAction)
  );

  t.true(
    hasGluedAction(glueAction, worldAction)
  );
});

test('it returns true if it has the glued action creator', t => {
  const glueAction = glue(hello, world)();

  t.true(
    hasGluedAction(glueAction, hello)
  );

  t.true(
    hasGluedAction(glueAction, world)
  );
});

test('it returns false if it does not have the glued action', t => {
  const glueAction = glue(hello, world)();

  t.false(
    hasGluedAction(glueAction, holaAction)
  );
});

test('it returns false if it does not have the glued action creator', t => {
  const glueAction = glue(hello, world)();

  t.false(
    hasGluedAction(glueAction, hola)
  );
});

test('it returns true if it has the glued action creator and args', t => {
  const glueAction = glue(increment, decrement)([42], [13]);

  t.true(
    hasGluedAction(glueAction, increment, [42])
  );

  t.true(
    hasGluedAction(glueAction, decrement, [13])
  );
});

test('it returns true if it has the glued action with args', t => {
  const glueAction = glue(increment, decrement)([42], [13]);

  t.true(
    hasGluedAction(glueAction, increment(42))
  );

  t.true(
    hasGluedAction(glueAction, decrement(13))
  );
});

test('it returns false if it does have the args for a given action creator', t => {
  const glueAction = glue(increment, decrement)([42], [13]);

  t.false(
    hasGluedAction(glueAction, increment, [43])
  );

  t.false(
    hasGluedAction(glueAction, decrement, [12])
  );

  t.false(
    hasGluedAction(glueAction, increment)
  );

  t.false(
    hasGluedAction(glueAction, decrement)
  );
});

test('it returns false if it does not have the glued action with the wrong args', t => {
  const glueAction = glue(increment, decrement)([42], [13]);

  t.false(
    hasGluedAction(glueAction, increment(43))
  );

  t.false(
    hasGluedAction(glueAction, decrement(12))
  );
});
