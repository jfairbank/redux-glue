/* @flow */
import type { GlueAction, GluedItem } from './types';
import isEqual from 'lodash.isequal';
import getGluedAction from './getGluedAction';

export default function hasGluedAction(
  glueAction: GlueAction,
  gluedItem: GluedItem,
  args?: Array<any> = []
): boolean {
  const gluedArgsCopy = glueAction.gluedArgs.slice(0);
  const argsCopy = gluedArgsCopy.map(_ => args);

  return glueAction.gluedItems.some(existingGluedItem => {
    try {
      return isEqual(
        getGluedAction(existingGluedItem, gluedArgsCopy),
        getGluedAction(gluedItem, argsCopy)
      );
    } catch (e) {
      return false;
    }
  });
}
