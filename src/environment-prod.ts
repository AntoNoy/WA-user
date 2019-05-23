


export const environment: any = {
    production: true,
    port: 17100,
    bddConfig: {
        type: "mysql",
        host: "192.168.1.3",
        port: 3307,
        username: "root",
        password: "NoyeauP@ssword",
        database: "noyeau_service_utilisateurs",
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
        upload: 'http://localhost:17101'
    },
};