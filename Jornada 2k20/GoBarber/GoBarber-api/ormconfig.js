export default [
    {
        name: "default",
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT,

        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_PASSWORD,

        // logging: process.env.DB_PG_LOGGING,
        // logger: "advanced-console",
        // migrationsRun: process.env.DB_PG_MIGRATIONS_RUN,
        // acquireTimeout: process.env.DB_PG_TIMEOUT,
        // synchronize: process.env.DB_PG_SYNCHRONIZE,

        charset: "utf8mb4",
        collation: "utf8mb4_general_ci",
        // keepConnectionAlive: true,

        entities: ["./src/modules/**/infra/typeorm/entities/*.ts"],
        migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
        cli: {
            migrationsDir: "./src/shared/infra/typeorm/migrations",
        },

        // rejectUnauthorized: true,
        // extra: {
        //     ssl: process.env.DB_PG_SSL,
        // },
    },
    {
        name: "mongo",
        type: process.env.TYPEORM_MONGO_TYPE,
        host: process.env.TYPEORM_MONGO_HOST,
        port: process.env.TYPEORM_MONGO_PORT,

        database: process.env.TYPEORM_MONGO_DATABASE,
        entities: [process.env.TYPEORM_MONGO_ENTITIES],

        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: process.env.TYPEORM_MONGO_TIMEOUT,
        family: 4,
    },
];
