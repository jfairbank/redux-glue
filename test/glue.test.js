/* @flow */
import test from 'ava';
import glue from '../src/glue';

import {
  helloAction,
  worldAction,
  hello,
  world,
  increment,
  decrement,
} from './helpers';

test('glues actions', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.same(gluedAction.gluedItems, [helloAction, worldAction]);
});

test('glues action creators', t => {
  const gluedAction = glue(hello, world)();

  t.same(gluedAction.gluedItems, [hello, world]);
});

test('glues actions and action creators', t => {
  const gluedAction = glue(helloAction, world)();

  t.same(gluedAction.gluedItems, [helloAction, world]);
});

test('takes arguments in order for glued action creators', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);

  t.same(gluedAction.gluedArgs, [[42], [13]]);
});

test('applies args early by invoking glued action creators', t => {
  const gluedAction = glue(
    increment(42),
    decrement(13)
  )();

  t.same(gluedAction.gluedArgs, []);

  t.same(gluedAction.gluedItems, [
    { type: 'INCREMENT', n: 42 },
    { type: 'DECREMENT', n: 13 },
  ]);
});

test('takes arguments in a mix', t => {
  const gluedAction = glue(
    increment(42),
    decrement
  )([13]);

  t.same(gluedAction.gluedArgs, [[13]]);

  t.same(gluedAction.gluedItems, [
    { type: 'INCREMENT', n: 42 },
    decrement,
  ]);
});
