/* @flow */
import test from 'ava';
import verifyGluedFrom from '../src/verifyGluedFrom';
import glue from '../src/glue';

import {
  helloAction,
  worldAction,
  hello,
  world,
  increment,
  decrement,
} from './helpers';

test('does not throw if the actions match', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [helloAction, worldAction]);
  });
});

test('does not throw if the action creators match', t => {
  const gluedAction = glue(hello, world)();

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [hello, world]);
  });
});

test('does not throw if the action creators match the actions', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [hello, world]);
  });
});

test('does not throw if the actions match the action creators', t => {
  const gluedAction = glue(hello, world)();

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [helloAction, worldAction]);
  });
});

test('does not throw if the args also match', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [increment, decrement], [[42], [13]]);
  });
});

test('does not throw with mix of early and late args', t => {
  const gluedAction = glue(increment(42), decrement)([13]);

  t.notThrows(_ => {
    verifyGluedFrom(gluedAction, [increment(42), decrement], [[13]]);
  });
});

test('throws if the action is not a glue action', t => {
  t.throws(_ => {
    verifyGluedFrom(helloAction, []);
  });
});

test('throws if the number of actions do not match', t => {
  const gluedAction = glue(helloAction)();

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [helloAction, worldAction]);
  });

  t.throws(_ => {
    verifyGluedFrom(gluedAction, []);
  });
});

test('throws if the actions do not match', t => {
  const gluedAction = glue(helloAction, worldAction)();

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [helloAction, helloAction]);
  });
});

test('throws if the number of args do not match', t => {
  const gluedAction = glue(increment)([42]);

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [increment]);
  });

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [increment], []);
  });

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [increment], [[42], [13]]);
  });
});

test('throws if the arguments do not match', t => {
  const gluedAction = glue(increment, decrement)([42], [13]);

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [increment, decrement], [[13], [42]]);
  });

  t.throws(_ => {
    verifyGluedFrom(gluedAction, [increment, decrement], [[43], [13]]);
  });
});
