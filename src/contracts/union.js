/* @flow */

import { ValidationError } from '../ValidationError';
import { createContract, type Contract } from '../createContract';

import { literal } from './literal';

type UnionContract = <T>(
  ...contracts: Array<
    | string
    | number
    | boolean
    | ((name: string, value: mixed) => ValidationError | T),
  >
) => Contract<T>;

export const union: UnionContract = /* :: <T> */ (
  ...riles: Array<
    | string
    | number
    | boolean
    | ((name: string, value: mixed) => ValidationError | T),
  >
): any => {
  const contracts = riles.map(
    rule => (typeof rule == 'function' ? rule : literal(rule)),
  );

  const unionContract = (name, value: any): ValidationError | T => {
    const errors = contracts
      .map(contract => contract(name, value))
      .reduce((scope, error): ValidationError[] => {
        if (error instanceof ValidationError) scope.push(error);
        return scope;
      }, []);

    if (errors.length !== contracts.length) return value;

    const types = errors.reduce((scope, { expectedTypes }): string[] => {
      for (let i = 0; i < expectedTypes.length; i += 1) {
        scope.push(expectedTypes[i]);
      }
      return scope;
    }, []);

    return (ValidationError.of: any)(name, value, ...types);
  };

  return createContract(unionContract);
};

export const isUnion = union;
export const passUnion = union;

export const uni = union;
export const isUni = union;
export const passUni = union;
