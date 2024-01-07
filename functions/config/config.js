const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    port: process.env.BE_PORT || 3000,
    dbURL: "mongodb://localhost:27017/tennisHub",
    origin: [
      "http://localhost:5173",
      "http://localhost:4200",
      "https://tennishub-5978b.web.app",
    ],
  },
  production: {
    port: process.env.BE_PORT || 3000,
    dbURL: process.env.DB_URL_CREDENTIALS,
    origin: ["https://tennishub-5978b.web.app"],
  },
};

module.exports = config[env];
