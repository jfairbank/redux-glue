/* @flow */
import test from 'ava';
import glue from '../src/glue';
import isGlueAction from '../src/isGlueAction';

test('returns true if the action was created with glue', t => {
  const gluedAction = glue(
    { type: 'HELLO' },
    { type: 'WORLD' },
  )();

  t.ok(isGlueAction(gluedAction));
});

test('returns false if there is no action', t => {
  t.notOk(isGlueAction(undefined));
});

test('returns false for other actions', t => {
  const action = { type: 'HELLO' };

  t.notOk(isGlueAction(action));
});
