/**
 * Garantindo que o driver tenha só essas duas opções.
 */
interface IMailConfig {
    driver: "ethereal" | "ses";
    defaults: {
        from: {
            email: string;
            name: string;
        };
    };
}

export default {
    driver: process.env.MAIL_DRIVER || "ethereal",

    defaults: {
        from: {
            email: "cogumm@brasillinux.com.br",
            name: "Gabriel da Equipe GoBarber",
        },
    },
} as IMailConfig;
