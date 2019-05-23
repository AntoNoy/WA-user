


export const environment: any = {
    production: false,
    port: 1985,
    bddConfig: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "noyeau_utilisateurs",
        entities: [
            "src/entity/**/*.ts"
        ],
        synchronize: true
    },
    cors: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS"
    },
    jwtSecret: "maTokenAMoi",
    noyeauApi: {
        upload: 'http://localhost:3005'
    },
};