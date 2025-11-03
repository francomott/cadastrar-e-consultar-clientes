const { URL } = require('url');

const mongoUri = process.env.MONGO_URI;

module.exports = {
  mongodb: {
    url: mongoUri,
    databaseName: 'crm',
    options: {}
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};
