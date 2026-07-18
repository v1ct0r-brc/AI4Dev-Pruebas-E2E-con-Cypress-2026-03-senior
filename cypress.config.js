const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/integration/**/*.spec.js',
    fixturesFolder: false,
    video: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
