/* @flow */
import type { GluedItem } from './types';
import verifyGluedFrom from './verifyGluedFrom';

export default function isGluedFrom(
  glueAction: any,
  gluedItems: Array<GluedItem>,
  gluedArgs: Array<Array<any>> = []
): boolean {
  try {
    return verifyGluedFrom(glueAction, gluedItems, gluedArgs) === undefined;
  } catch (e) {
    return false;
  }
}
