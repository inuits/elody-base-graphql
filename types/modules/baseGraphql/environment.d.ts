import { Environment, FullyOptionalEnvironmentInput } from './types/environmentTypes';
export declare let currentEnvironment: Environment | undefined;
export declare const setCurrentEnvironment: (environment: Environment) => void;
export declare const getCurrentEnvironment: () => Environment;
export declare const baseEnvironment: Environment;
export declare const createElodyEnvironment: (environmentInput: FullyOptionalEnvironmentInput) => Environment;
