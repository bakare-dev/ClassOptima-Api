require("dotenv").config();
module.exports = {
  server: {
    port: process.env.PORT,
    mode: process.env.MODE
  },
  database: {
    development: {
      database: process.env.DEV_DB,
      username: process.env.DEV_USER,
      password: process.env.DEV_PASSWORD,
      host: process.env.DEV_HOST,
      dialect: "mysql",
      logging: false,
    },
    test: {},
    production: {},
  },
  infrastructure: {
    dateFormat: "YYYY-MM-DD HH:mm:ss",
    serverbaseUrl: {
      production: "",
      development: "http://localhost:9001",
      test: "",
    },
    clientbaseUrl: {
      production: "",
      production2: "",
      development: "http://localhost:5173",
      test: "",
    },
    winston: {
      server: process.env.WINSTONSOURCESERVER,
      sourceToken: process.env.WINSTONSOURCETOKEN,
    },
    redis: {
      url: process.env.REDISURL,
      port: process.env.REDISPORT,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SCERET_KEY,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USN,
      password: process.env.SMTP_PASSWORD,
    },
  },
  security: {
    jwtSecret: process.env.JWT_SECRET,
    unprotectedRoutes: [],
    saltLength: process.env.saltLength,
  },
};
