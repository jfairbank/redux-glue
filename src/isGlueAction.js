/* @flow */
import type { Action, GlueAction } from './types';
import GLUE_SYMBOL from './symbol';

export default function isGlueAction(
  action?: Action | GlueAction
): boolean {
  if (!action) {
    return false;
  }

  return action.type === GLUE_SYMBOL;
}
