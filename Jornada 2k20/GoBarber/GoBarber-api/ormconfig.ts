export default [
    {
        name: "default",
        type: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,

        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,

        logging: process.env.DB_LOGGING,
        logger: "advanced-console",
        migrationsRun: process.env.DB_MIGRATIONS_RUN,
        acquireTimeout: process.env.DB_TIMEOUT,
        synchronize: process.env.DB_SYNCHRONIZE,

        charset: "utf8mb4",
        collation: "utf8mb4_general_ci",
        // https://stackoverflow.com/questions/35553432/error-handshake-inactivity-timeout-in-node-js-mysql-module
        keepConnectionAlive: true,

        entities: [process.env.DB_ENTITIES],
        migrations: [process.env.DB_MIGRATIONS],
        cli: {
            migrationsDir: process.env.DB_MIGRATIONSDIR,
        },

        rejectUnauthorized: true,
        // extra: {
        //     ssl: process.env.DB_SSL,
        // },
    },
    {
        name: "mongo",
        type: process.env.DB_MONGO_TYPE,
        host: process.env.DB_MONGO_HOST,
        port: process.env.DB_MONGO_PORT,

        database: process.env.DB_MONGO_DATABASE,
        entities: [process.env.DB_MONGO_ENTITIES],

        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: process.env.DB_MONGO_TIMEOUT,
        family: 4,
    },
];
