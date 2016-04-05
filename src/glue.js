/* @flow */
import type { GluedItem, GlueActionCreator } from './types';
import GLUE_SYMBOL from './symbol';

export default function glue(
  ...gluedItems: Array<GluedItem>
): GlueActionCreator {
  return (...gluedArgs: Array<Array<any>>) => ({
    gluedItems,
    gluedArgs,
    type: GLUE_SYMBOL,
  });
}
