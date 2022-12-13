import { Schema } from '../schema';
import { NumberProperties, StringProperties } from './properties';
import { Verification } from './verifier';

type ValueVerifier<T> = (value: T) => boolean | string;

type Verifier<T> = (value: T) => Verification;

type ObjectValueVerifiers<T> = {
    [K in keyof T]: Verifier<T[K]>;
};

const multipleOfVerifier = (multipleOf?: number): ValueVerifier<number> | undefined => (multipleOf)
    ? (value: number) => {
        if (value % multipleOf !== 0) {
            return `${value} must be a multiple of ${multipleOf}`;
        }
        return true;
    }
    : undefined;

const minimumVerifier = (minimum?: number, exclusive?: boolean): ValueVerifier<number> | undefined => (minimum)
    ? (value: number) => {
        if (exclusive) {
            if (value <= minimum) {
                return `${value} must be > ${minimum}`;
            }
        } else {
            if (value < minimum) {
                return `${value} must be >= ${minimum}`;
            }
        }
        return true;
    }
    : undefined;

    const maximumVerifier = (maximum?: number, exclusive?: boolean): ValueVerifier<number> | undefined => (maximum)
    ? (value: number) => {
        if (exclusive) {
            if (value >= maximum) {
                return `${value} must be < ${maximum}`;
            }
        } else {
            if (value > maximum) {
                return `${value} must be <= ${maximum}`;
            }
        }
        return true;
    }
    : undefined;

const minLengthVerifier = (minLength?: number): ValueVerifier<string> | undefined => (minLength)
    ? (value: string) => {
        if (value.length < minLength) {
            return `${value} must be >= ${minLength}`;
        }
        return true;
    }
    : undefined;

const maxLengthVerifier = (maxLength?: number): ValueVerifier<string> | undefined => (maxLength)
    ? (value: string) => {
        if (value.length > maxLength) {
            return `${value} must be <= ${maxLength}`;
        }
        return true;
    }
    : undefined;

const formatVerifier = (format?: string): ValueVerifier<string> | undefined => (format)
    ? (value: string) => {
        if (true) {
            return `${value} must be in the format ${format}`;
        }
        return true;
    }
    : undefined;

const patternVerifier = (pattern?: string): ValueVerifier<string> | undefined => (pattern)
    ? (value: string) => {
        if (true) {
            return `${value} must be in the pattern ${pattern}`;
        }
        return true;
    }
    : undefined;

const isDefined = <T>(t?: T): t is T => {
    return t !== undefined;
}

const combineVerifiers = <T>(...verifiers: ValueVerifier<T>[]): Verifier<T> => (value: T): Verification => {
    const errors: string[] = [];
    for (const v of verifiers) {
        const validation = v(value);
        if (typeof validation === 'string') {
            errors.push(validation);
        }
    }
    return {
        verified: (errors.length === 0),
        errors
    }
}

const numberVerifier = (props: NumberProperties<number>): Verifier<number> => {
    return combineVerifiers(...[
        multipleOfVerifier(props.multipleOf),
        minimumVerifier(props.minimum, props.exclusiveMinimum),
        maximumVerifier(props.maximum, props.exclusiveMaximum)
    ].filter(isDefined));
}

const stringVerifier = (props: StringProperties<string>): Verifier<string> => {
    return combineVerifiers(...[
        minLengthVerifier(props.minLength),
        maxLengthVerifier(props.maxLength),
        formatVerifier(props.format),
        patternVerifier(props.pattern)
    ].filter(isDefined));
}

// const arrayVerifiers = (schema: Schema): Verifier<Array<any>>[] => {
//     return [
//         multipleOfVerifier(schema.multipleOf),
//         minimumVerifier(schema.minimum, schema.exclusiveMinimum),
//         maximumVerifier(schema.maximum, schema.exclusiveMaximum)
//     ].filter(isDefined);
// }

const verifiers: ObjectValueVerifiers<Abc> = {
    a: numberVerifier(schema),
    b: stringVerifier(schema)
};

const objectVerifier: Verifier<Abc> = (value: Abc): Verification => {

    return {
        verified: true,
        errors: []
    };
}

type Abc = {
    a: number;
    b: string;
}

const verifier: ObjectValueVerifiers<Abc> = {
    a: numberVerifier({}),
    b: stringVerifier({})
}

export {
    ValueVerifier,
    ObjectValueVerifiers,
    maximumVerifier,
    minimumVerifier,
    multipleOfVerifier
}