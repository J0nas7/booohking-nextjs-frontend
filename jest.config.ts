import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': [
            'babel-jest',
            {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript',
                ],
            },
        ],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '\\.scss$', // Ignore SCSS files
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS/SCSS imports
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.tsx']
};

export default config;
