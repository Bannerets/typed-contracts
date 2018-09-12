/* @flow */

import { ValidationError } from '../../ValidationError';
import { createContract, type Contract } from '../../createContract';

import { union } from '../union';

type ObjectOf = <T, L: string | number | boolean>(
  ...rules: $ReadOnlyArray<
    ((name: string, value: mixed) => ValidationError | T) | L,
  >
) => Contract<{ [string]: T | L }>;

export const objectOf: ObjectOf = <T, L: string | number | boolean>(
  ...rules: $ReadOnlyArray<
    ((name: string, value: mixed) => ValidationError | T) | L,
  >
): Contract<{ [string]: T | L }> => {
  const validate = union(...rules);

  return createContract(
    (valueName, value): any => {
      if (!value || typeof value != 'object' || Array.isArray(value)) {
        return new ValidationError(valueName, value, 'Object');
      }

      const errors = Object.entries(value).reduce((acc, [key, val]) => {
        const result = validate(`${valueName}.${key}`, val);
        if (result instanceof ValidationError) acc.push(result);
        return acc;
      }, []);

      return errors.length
        ? new ValidationError(valueName, value, ...errors[0].expectedTypes)
        : value;
    },
  );
};

export const isObjectOf = objectOf;
export const passObjectOf = objectOf;

export const objOf = objectOf;
export const isObjOf = objectOf;
export const passObjOf = objectOf;
