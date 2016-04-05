/* @flow */
import type { Store } from './types';
import isGlueAction from './isGlueAction';
import getGluedAction from './getGluedAction';

export default function glueMiddleware(
  { dispatch }: Store
): Function {
  return next => action => {
    if (isGlueAction(action)) {
      const { gluedItems, gluedArgs } = action;

      gluedItems.forEach(gluedItem => {
        dispatch(
          getGluedAction(gluedItem, gluedArgs)
        );
      });

      return true;
    }

    return next(action);
  };
}
