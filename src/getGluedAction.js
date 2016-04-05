/* @flow */
import type { Action, GluedItem } from './types';

export default function getGluedAction(
  gluedItem: GluedItem,
  gluedArgs?: Array<any>
): Action {
  if (typeof gluedItem !== 'function') {
    return gluedItem;
  }

  if (Array.isArray(gluedArgs)) {
    const args = gluedArgs.shift();

    if (Array.isArray(args)) {
      return gluedItem(...args);
    }
  }

  return gluedItem();
}
