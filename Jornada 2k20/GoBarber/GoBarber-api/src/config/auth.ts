export default {
    jwt: {
        secret: process.env.JWT_SECRET_KEY || "default",
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
};
