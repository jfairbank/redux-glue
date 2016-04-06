/* @flow */
import test from 'ava';
import isGluedFrom from '../src/isGluedFrom';
import glue from '../src/glue';

import {
  helloAction,
  worldAction,
  hello,
  world,
  increment,
  decrement,
} from './helpers';

test('returns true if the actions match', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.true(
    isGluedFrom(gluedAction, [helloAction, worldAction])
  );
});

test('returns true if the action creators match', t => {
  const gluedAction = glue(hello, world)();

  t.true(
    isGluedFrom(gluedAction, [hello, world])
  );
});

test('returns true if the action creators match the actions', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.true(
    isGluedFrom(gluedAction, [hello, world])
  );
});

test('returns true if the actions match the action creators', t => {
  const gluedAction = glue(hello, world)();

  t.true(
    isGluedFrom(gluedAction, [helloAction, worldAction])
  );
});

test('returns true if the args also match', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);

  t.true(
    isGluedFrom(gluedAction, [increment, decrement], [[42], [13]])
  );
});

test('returns true with mix of early and late args', t => {
  const gluedAction = glue(increment(42), decrement)([13]);

  t.true(
    isGluedFrom(gluedAction, [increment(42), decrement], [[13]])
  );
});

test('returns false if the action is not a glue action', t => {
  t.false(
    isGluedFrom(helloAction, [])
  );
});

test('returns false if the number of actions do not match', t => {
  const gluedAction = glue(helloAction)();

  t.false(
    isGluedFrom(gluedAction, [helloAction, worldAction])
  );

  t.false(
    isGluedFrom(gluedAction, [])
  );
});

test('returns false if the actions do not match', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.false(
    isGluedFrom(gluedAction, [helloAction, helloAction])
  );
});

test('returns false if the number of args do not match', t => {
  const gluedAction = glue(increment)([42]);

  t.false(
    isGluedFrom(gluedAction, [increment])
  );

  t.false(
    isGluedFrom(gluedAction, [increment], [])
  );

  t.false(
    isGluedFrom(gluedAction, [increment], [[42], [13]])
  );
});

test('returns false if the arguments do not match', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);

  t.false(
    isGluedFrom(gluedAction, [increment, decrement], [[13], [42]])
  );

  t.false(
    isGluedFrom(gluedAction, [increment, decrement], [[43], [13]])
  );
});
