module.exports = {
    presets: [
        /* ENV responsável por alterar as funcionalidades do JS para que o navegador entenda
         * Exemplo: import e exports, arrow function, algumas classes
         */
        "@babel/preset-env",

        /* React é responsável em transformar as coisas que o navegador não entenda.
         * Exemplo: jsx e outras funcionalidades do react
         */
        "@babel/preset-react"
    ],
    /*
     * Plugin para que o babel entenda as propriedades definidas diretamente dentro das class
     */
    plugins: ["@babel/plugin-proposal-class-properties"]
};
