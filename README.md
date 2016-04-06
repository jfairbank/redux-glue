# Redux Glue

[![Travis
branch](https://img.shields.io/travis/jfairbank/redux-glue/master.svg?style=flat-square)](https://travis-ci.org/jfairbank/redux-glue)
[![npm](https://img.shields.io/npm/v/redux-glue.svg?style=flat-square)](https://www.npmjs.com/package/redux-glue)

Glue together actions to create testable, sequenced actions.

## Install

    $ npm install --save redux-glue

## Problem

Sometimes you need to dispatch multiple actions together, so a typical approach
is to wrap multiple actions creators in a function and use the
[redux-thunk middleware](https://github.com/gaearon/redux-thunk).

```js
// actions.js
// ==========
export const greet = () => ({ type: 'GREET' });
export const hug = () => ({ type: 'HUG' });

export const seeFriend = () => (dispatch) => {
  dispatch(greet());
  dispatch(hug());
};
```

```js
// store.js
// ========
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';

export default createStore(
  reducer,
  applyMiddleware(thunkMiddleware)
);
```

This works great, but one issue is that it's harder to test, typically needing
mocks/stubs.

```js
import { greet, hug, seeFriend } from 'app/actions';

describe('actions', () => {
  it('can see a friend', () => {
    const dispatch = jasmine.createSpy('dispatch');

    seeFriend()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(greet());
    expect(dispatch).toHaveBeenCalledWith(hug());
  });
});
```

Again, this is not a huge problem, but it would be nice to sequence actions
together and just assert a sequenced action comprises other actions.

```js
import { greet, hug, seeFriend } from 'app/actions';

describe('actions', () => {
  it('can see a friend', () => {
    expect(
      isSequencedAction(seeFriend(), [greet, hug])
    ).toBe(true);
  });
});
```

## Usage

Redux Glue allows you to sequence actions and action creators together to create
a new action creator that sequences them in the order you supply. The sequenced
action creator just returns a well-defined object that you can more easily test.

### `glue`

To create a sequenced action creator, use the `glue`. It takes a variable number
of actions and action creators as arguments.

```js
// actions.js
// ==========
import { glue } from 'redux-glue';

export const greet = () => ({ type: 'GREET' });
export const hug = () => ({ type: 'HUG' });

// created with actionCreators
export let seeFriend = glue(greet, hug);

// created with actions
seeFriend = glue(greet(), hug());

// created with a mix
seeFriend = glue(greet, hug());
```

```js
// myFile.js
// =========
store.dispatch(seeFriend());

// which is the same as
store.dispatch(greet());
store.dispatch(hug());
```

Sometimes action creators take arguments, you can supply those as well in
various fashions.

The first way is supply arguments to the new action creator that you glued
together. You can supply arguments to each inner action creator by passing in a
variable number of arrays with each action creator's arguments.

```js
// actions.js
// ==========
import { glue } from 'redux-glue';

export const increment = (n) => ({ n, type: 'INCREMENT' });
export const decrement = (n) => ({ n, type: 'DECREMENT' });

export const sillyAdd = glue(increment, decrement);
```

```js
// myFile.js
// =========
store.dispatch(
  sillyAdd([42], [13])
);

// which is the same as
store.dispatch(increment(42));
store.dispatch(decrement(13));
```

If you want to supply arguments early, then you can still pass those into the
action creators when you glue them together. Remember, they just return actions
anyway.

```js
const sillyAdd = glue(
  increment(42),
  decrement(13)
);

store.dispatch(sillyAdd());

// which is the same as
store.dispatch(increment(42));
store.dispatch(decrement(13));
```

You can even mix them up if you want. If you've already supplied arguments to an
inner action creator (thus producing an action), then the glued action creator
will know not to consider that inner action when consuming arguments passed in
later.

```js
const sillyAdd = glue(
  increment(42),
  decrement
);

// the first array of arguments here will go to `decrement` instead of
// `increment` because we already called it with its arguments and produced an
// action
store.dispatch(
  sillyAdd([13])
);

// which is the same as
store.dispatch(increment(42));
store.dispatch(decrement(13));
```

### `glueMiddleware`

To ensure your sequenced actions all get dispatched, you'll need to add the
glueMiddleware to your store.

```js
// store.js
// ========
import { applyMiddleware, createStore } from 'redux';
import { glueMiddleware } from 'redux-glue';
import reducer from './reducer';

export default createStore(
  reducer,
  applyMiddleware(glueMiddleware)
);
```

## Testing

### `verifyGluedFrom`

To test your glued action creators, you can use `verifyGluedFrom`.  It
takes an action produced from a glued action creator that you want to verify as
the first argument. The second argument is an array of actions and action
creators that you expect it to be produced from. The third argument is an array
of array of arguments that should have been passed into the glued action creator
to create the final action. The third argument is optional if your action
creator does not need to take any arguments.

It throws if the passed in action does not match the expected inner
actions/action creators or expected passed-in arguments. The error message will
explain why the action did not match. If the action is valid, then it simply
returns `undefined`.

```js
import { verifyGluedFrom } from 'redux-glue';

const greet = () => ({ type: 'GREET' });
const hug = () => ({ type: 'HUG' });
const seeFriend = glue(greet, hug);
const friendAction = seeFriend();

const increment = (n) => ({ n, type: 'INCREMENT' });
const decrement = (n) => ({ n, type: 'DECREMENT' });
const sillyAdd = glue(increment, decrement);
const addAction = sillyAdd([42], [13]);

verifyGluedFrom(friendAction, [greet, hug]); // undefined, so valid
verifyGluedFrom(friendAction, [greet]);      // throws
verifyGluedFrom(friendAction, []);           // throws
verifyGluedFrom(friendAction, [hug, greet]); // throws, out of order

// undefined, so valid
verifyGluedFrom(addAction, [increment, decrement], [ [42], [13] ]);

// all throw
verifyGluedFrom(addAction, [increment, decrement], [ [42] ]);
verifyGluedFrom(addAction, [increment, decrement], [ [13], [42] ]);
verifyGluedFrom(addAction, [increment, decrement], []);
verifyGluedFrom(addAction, [increment, decrement]);
```

### `isGluedFrom`

If you don't need the fine-grained control of the different errors that
`verifyGluedFrom` might throw, then you can use the simpler `isGluedFrom`. It
takes the same arguments as `verifyGluedFrom` and returns `true` if there is a
match and `false` if not.

```js
import { isGluedFrom } from 'redux-glue';

const greet = () => ({ type: 'GREET' });
const hug = () => ({ type: 'HUG' });
const seeFriend = glue(greet, hug);
const friendAction = seeFriend();

const increment = (n) => ({ n, type: 'INCREMENT' });
const decrement = (n) => ({ n, type: 'DECREMENT' });
const sillyAdd = glue(increment, decrement);
const addAction = sillyAdd([42], [13]);

isGluedFrom(friendAction, [greet, hug]); // true
isGluedFrom(friendAction, [greet]);      // false
isGluedFrom(friendAction, []);           // false
isGluedFrom(friendAction, [hug, greet]); // false

// true
isGluedFrom(addAction, [increment, decrement], [ [42], [13] ]);

// all false
isGluedFrom(addAction, [increment, decrement], [ [42] ]);
isGluedFrom(addAction, [increment, decrement], [ [13], [42] ]);
isGluedFrom(addAction, [increment, decrement], []);
isGluedFrom(addAction, [increment, decrement]);
```

### `hasGluedAction`

If you want to test that an action produced from a glued action creator contains
a specific inner action or action creator, then you can use `hasGluedAction`.
The first argument is the action produced from a glued action creator, the
second argument is the inner action or action creator, and the third optional
argument is an array of arguments that go with the inner action/action creator.

```js
import { hasGluedAction } from 'redux-glue';

const greet = () => ({ type: 'GREET' });
const hug = () => ({ type: 'HUG' });
const seeFriend = glue(greet, hug);
const friendAction = seeFriend();

const increment = (n) => ({ n, type: 'INCREMENT' });
const decrement = (n) => ({ n, type: 'DECREMENT' });
const sillyAdd = glue(increment, decrement);
const addAction = sillyAdd([42], [13]);

hasGluedAction(friendAction, greet);            // true
hasGluedAction(friendAction, greet());          // true
hasGluedAction(friendAction, hug);              // true
hasGluedAction(friendAction, hug());            // true
hasGluedAction(friendAction, { type: 'HOLA' }); // false

// true
hasGluedAction(addAction, increment, [42]); // true
hasGluedAction(addAction, increment, [42]); // true
hasGluedAction(addAction, decrement, [13]); // true
hasGluedAction(addAction, increment, [13]); // false
hasGluedAction(addAction, increment, []);   // false

// Also pass in args early
hasGluedAction(addAction, increment(42)); // true
hasGluedAction(addAction, decrement(13)); // true

// No args when they are expected
hasGluedAction(addAction, increment); // false
hasGluedAction(addAction, decrement); // false
```

## API

```js
type Action = { type: any };
type ActionCreator = (...args?: Array<any>) => Action;

type GluedItem = Action | ActionCreator;

type GlueAction = {
  gluedItems: Array<GluedItem>;
  gluedArgs: Array<Array<any>>;
  type: Symbol | string;
};

type GlueActionCreator = (...gluedArgs: Array<any>) => GlueAction;

glue(...gluedItems: Array<GluedItem>): GlueActionCreator;

verifyGluedFrom(
  glueAction: any,
  gluedItems: Array<GluedItem>,
  gluedArgs: Array<Array<any>> = []
): void;

isGluedFrom(
  glueAction: any,
  gluedItems: Array<GluedItem>,
  gluedArgs: Array<Array<any>> = []
): void;

hasGluedAction(
  glueAction: GlueAction,
  gluedItem: GluedItem,
  args?: Array<any> = []
): boolean;
 ```
