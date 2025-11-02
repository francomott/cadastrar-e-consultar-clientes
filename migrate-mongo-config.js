const { URL } = require('url');

const mongoUri = process.env.MONGO_URI;
const u = new URL(mongoUri);
const databaseName = (u.pathname || '').replace(/^\//, '');
const url = `${u.protocol}//${u.host}`; 

module.exports = {
  mongodb: {
    url,
    databaseName,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};
