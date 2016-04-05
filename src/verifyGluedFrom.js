/* @flow */
import type { GluedItem } from './types';
import invariant from 'invariant';
import isEqual from 'lodash.isequal';
import isGlueAction from './isGlueAction';
import getGluedAction from './getGluedAction';

export default function verifyGluedFrom(
  glueAction: any,
  gluedItems: Array<GluedItem>,
  gluedArgs: Array<Array<any>> = []
): void {
  invariant(
    isGlueAction(glueAction),
    'Please provide a valid redux-glue action'
  );

  invariant(
    gluedItems.length === glueAction.gluedItems.length,
    'Number of expected glued actions do not match'
  );

  invariant(
    gluedArgs.length === glueAction.gluedArgs.length,
    'Number of expected arguments for action creators do not match'
  );

  const gluedArgsCopy = gluedArgs.slice(0);
  const glueActionGluedArgsCopy = glueAction.gluedArgs.slice(0);

  gluedItems.forEach((gluedItem, i) => {
    invariant(
      isEqual(
        getGluedAction(gluedItem, gluedArgsCopy),
        getGluedAction(glueAction.gluedItems[i], glueActionGluedArgsCopy)
      ),

      `Glued action at index ${i} is not correct`
    );
  });
}
