/* @flow */
import test from 'ava';
import { helloAction, hello, increment } from './helpers';
import getGluedAction from '../src/getGluedAction';

test('returns normal actions', t => {
  t.is(getGluedAction(helloAction), helloAction);
});

test('returns the return value of an action creator', t => {
  t.is(getGluedAction(hello), helloAction);
});

test('consumes next args from gluedArgs if an action creator is supplied', t => {
  const gluedArgs = [[42]];
  const action = getGluedAction(increment, gluedArgs);

  t.same(action, { type: 'INCREMENT', n: 42 });
  t.is(gluedArgs.length, 0);
});
