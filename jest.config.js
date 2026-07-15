module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        'api/**/*.js',
        '!api/**/node_modules/**',
        '!**/test/**'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/test/'
    ]
};
