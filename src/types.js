/* @flow */
export type Action = { type: any };
export type ActionCreator = (...args?: Array<any>) => Action;
export type Store = {
  dispatch: (action: Action) => any;
};

export type GluedItem = Action | ActionCreator;

export type GlueAction = {
  gluedItems: Array<GluedItem>;
  gluedArgs: Array<Array<any>>;
  type: Symbol | string;
};

export type GlueActionCreator = (...gluedArgs: Array<any>) => GlueAction;
