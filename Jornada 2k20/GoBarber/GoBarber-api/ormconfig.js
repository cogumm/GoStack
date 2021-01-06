export default [
    {
        name: "default",
        type: process.env.DB_CONNECTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,

        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,

        logging: process.env.DB_PG_LOGGING,
        logger: "advanced-console",
        migrationsRun: process.env.DB_PG_MIGRATIONS_RUN,
        acquireTimeout: process.env.DB_PG_TIMEOUT,
        synchronize: process.env.DB_PG_SYNCHRONIZE,

        charset: "utf8mb4",
        collation: "utf8mb4_general_ci",
        keepConnectionAlive: true,

        entities: [process.env.DB_PG_ENTITIES],
        migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
        cli: {
            migrationsDir: "./src/shared/infra/typeorm/migrations",
        },

        rejectUnauthorized: true,
        extra: {
            ssl: process.env.DB_PG_SSL,
        },
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
