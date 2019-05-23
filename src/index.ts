import * as express from "express";


import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {ConnectionOptions, createConnection, Repository} from "typeorm";
import * as loginController from "./controller/login.controller";
import {User} from "./entity/User";
import {RefreshTocken} from "./entity/refreshToken";
import {environment} from "./environment";

let apiName: string = "utilisateurService";


let jwt = require('jsonwebtoken');


// create typeorm connection
createConnection(environment.bddConfig as ConnectionOptions).then(connection => {
    const userRepository = connection.getRepository(User);
    const refreshTokenRepository = connection.getRepository(RefreshTocken);





    // create and setup express app
    const app = express();
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", environment.cors["Access-Control-Allow-Headers"]);
        res.header("Access-Control-Allow-Origin", environment.cors["Access-Control-Allow-Origin"]);
        res.header("Access-Control-Allow-Methods", environment.cors["Access-Control-Allow-Methods"]);
        res.header("Content-Type", "application/json; charset=utf-8");

        if ('OPTIONS' === req.method) {
            //respond with 200
            res.send(200);
        }
        else {
            //move on
            next();
        }
    });
    app.use(bodyParser.json());



    app.get("/test/", async function (req: Request, res: Response) {
        console.log('test')
res.send('ca marche')
    });



    app.post("/login", async function (req: Request, res: Response) {
        loginController.login(userRepository, req, res, refreshTokenRepository);
    });

    app.post("/token", async function (req: Request, res: Response) {
        loginController.tokenAuth(userRepository, req, res);
    });

    app.post("/refresh-token", async function (req: Request, res: Response) {
        loginController.refreshToken(refreshTokenRepository, req, res);
    });

    app.post("/newCompte", async function (req: Request, res: Response) {
        loginController.newCompte(userRepository, req, res);
    });




    app.use('/api', (req, res) => {
        console.log('-------------------------------------------------------------')
        console.log(req.method)

        if(req.method == 'OPTIONS') {
            res.status(200).send({options: 'OK'})
        }
        else if (req.headers['authorization']) {

            verifyToken(req.headers['authorization'], req, res)

        } else {

            res.status(401).send({msg: 'User non authentifié'})
        }
    });

    app.use('/self', (req, res) => {
        console.log('--------SELF-----------------------------------------------------')
        console.log(req.method)

        if(req.method == 'OPTIONS') {
            res.status(200).send({options: 'OK'})
        }
        else if (req.headers['authorization']) {

            verifyTokenForSelf(req.headers['authorization'], req, res)

        } else {

            res.status(401).send({msg: 'User non authentifié'})
        }
    });

    app.use('/self-token', (req, res) => {
        console.log('--------SELF-----------------------------------------------------')
        console.log(req.method)

        if(req.method == 'OPTIONS') {
            res.status(200).send({options: 'OK'})
        }
        else if (req.headers['authorization']) {

            verifyTokenForSelf(req.headers['authorization'], req, res, true)

        } else {

            res.status(401).send({msg: 'User non authentifié'})
        }
    });

    app.use(function(req, res, next) {
        res.status(404).send('Sorry cant find that!');
    });


    // start express server
    let server = app.listen(+environment.port, function () {

        var host = server.address().address
        var port = process.env.PORT || server.address().port

        console.log("App Utilisateur-API at http://%s:%s", host, port)
    })









function verifyToken(token, req, res) :any {
        console.log(token)
    jwt.verify(token, environment.jwtSecret, (err, decoded) => {
        if (err) {
            res.status(401).send({msg: 'User non autorisé - Erreur jwt'})
        }
        else {
            userRepository.findOne({
                where: {
                    username: decoded.username.toLowerCase()
                }
            }).then(user => {
                if (user !== null && user !== undefined) {
                    req['user']=user
                    require('./router/0-api')(req, res)
                }
                else {
                    res.status(401).send({msg: 'User non autorisé - Erreur jwt'})
                }
            })
        }
    });
}

    function verifyTokenForSelf(token, req, res, avecToken:boolean=false) :any {
        jwt.verify(token, environment.jwtSecret, (err, decoded) => {
            console.log('---errrr',err)
            if (err) {
                res.status(401).send({msg: 'User non autorisé - Erreur jwt'})
            }
            else {
                console.log('---username',decoded.username)

                userRepository.findOne({
                    where: {
                        username: decoded.username.toLowerCase()
                    }
                }).then(user => {
                    if (user !== null && user !== undefined) {
                        if(!avecToken){
                            req['user']=user
                            res.status(200).send(user)
                        } else {
                            // res.status(401).send(user)
                            loginController.loginProcess(user, req, res, refreshTokenRepository)
                        }
                    }
                    else {
                        res.status(401).send({msg: 'User non autorisé - Erreur jwt'})
                    }
                })
            }
        });
    }


});