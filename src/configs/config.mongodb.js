export default {
  dev: {
    app: {
      port: process.env.DEV_APP_PORT || 3052,
    },
    db: {
      host: process.env.DEV_DB_HOST || '127.0.0.1',
      port: process.env.DEV_DB_PORT || 27017,
      name: process.env.DEV_DB_NAME || 'shopDEV',
    },
  },
  pro: {
    app: {
      port: process.env.PRO_APP_PORT,
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: process.env.PRO_DB_PORT,
      name: process.env.PRO_DB_NAME,
    },
  },
};
