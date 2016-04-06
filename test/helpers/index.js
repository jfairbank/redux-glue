/* @flow */
import type { ActionCreator } from '../../src/types';

export const helloAction = { type: 'HELLO' };
export const worldAction = { type: 'WORLD' };
export const holaAction = { type: 'HOLA' };

export const hello: ActionCreator = () => helloAction;
export const world: ActionCreator = () => worldAction;
export const hola: ActionCreator = () => holaAction;

export const increment: ActionCreator = (n) => ({ n, type: 'INCREMENT' });
export const decrement: ActionCreator = (n) => ({ n, type: 'DECREMENT' });
