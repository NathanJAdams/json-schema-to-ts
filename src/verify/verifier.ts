import {
    NullProperties,
    NumberProperties,
    Properties,
    StringProperties
} from './properties';

type Verification = {
    verified: boolean;
    errors: string[];
}

type Verifier<T> = (value: T) => Verification;

type VerifierCreator<F, P extends Properties<F>> = <T extends F>(properties: P) => Verifier<T>;

const createNullVerifier: VerifierCreator<any, NullProperties<any>> =
    <T extends any>(_properties: NullProperties<any>): Verifier<T> =>
        (_value: T): Verification => ({
    verified: true,
    errors: []
});

const createNumberVerifier: VerifierCreator<number, NumberProperties<number>> =
    <T extends number>(properties: NumberProperties<number>): Verifier<T> =>
        (value: T): Verification => {
    const errors: string[] = [];
    const multipleOf = properties.multipleOf;
    if (multipleOf && (value % multipleOf !== 0)) {
        errors.push(`${value} must be a multiple of ${multipleOf}`);
    }
    const min = properties.minimum;
    if (min !== undefined) {
        if(properties.exclusiveMinimum) {
            if (value <= min) {
                errors.push(`${value} must be > ${min}`);
            }
        } else {
            if (value < min) {
                errors.push(`${value} must be >= ${min}`);
            }
        }
    }
    const max = properties.maximum;
    if (max !== undefined) {
        if(properties.exclusiveMaximum) {
            if (value >= max) {
                errors.push(`${value} must be < ${max}`);
            }
        } else {
            if (value > max) {
                errors.push(`${value} must be <= ${max}`);
            }
        }
    }
    return {
        verified: (errors.length === 0),
        errors
    }
};

const createStringVerifier: VerifierCreator<string, StringProperties<string>> =
    <T extends string>(properties: StringProperties<string>): Verifier<T> =>
        (value: T): Verification => {
    const errors: string[] = [];
    const minLength = properties.minLength;
    if (minLength && value.length < minLength) {
        errors.push(`${value} must have a min length of ${minLength}`);
    }
    const maxLength = properties.maxLength;
    if (maxLength && value.length > maxLength) {
        errors.push(`${value} must have a max length of ${maxLength}`);
    }
    return {
        verified: (errors.length === 0),
        errors
    }
};


type ObjectVerifiers<T> = {
    [K in keyof T]: Verifier<T[K]>;
};

type Abc = {
    a: string;
    b: number;
    c: Record<string, number>;
}

const v: ObjectVerifiers<Abc> = {
    a: createStringVerifier({
        minLength: 1
    }),
    b: createNumberVerifier({
        minimum: 123
    }),
    c: createNullVerifier({})
}

const createObjectVerifier = <T>(verifiers: ObjectVerifiers<T>): Verifier<T> => (value: T): Verification => {
    const errors: string[] = [];
    let fieldKey: keyof T;
    for (fieldKey in value) {
        const verifier: Verifier<T[keyof T]> = verifiers[fieldKey];
        const fieldValue = value[fieldKey];
        const fieldVerification: Verification = verifier(fieldValue);
        errors.push(...fieldVerification.errors.map((error) => `${String(fieldKey)}: ${error}`));
    }
    return {
        verified: (errors.length == 0),
        errors
    }
}

export {
    Verification,
    Verifier
}
