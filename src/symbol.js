/* @flow */
export default typeof Symbol === 'function' ?
  Symbol('redux-glue') :
  '__redux-glue__';
