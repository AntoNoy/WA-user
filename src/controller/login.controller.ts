import {Request, Response} from "express";
import {Repository} from "typeorm";
import {User} from "../entity/User";
import {RefreshTocken} from "../entity/refreshToken";
import {environment} from "../environment";


var bcrypt = require('bcryptjs');


var jwt = require('jsonwebtoken');
const jwtSecret = environment.jwtSecret

// const connection = getConnection();
// const refreshTokenRepository = connection.getRepository(RefreshTocken);


export function login(repository, req: Request, res: Response, refreshTokenRepository) {
    let password = bcrypt.hashSync(req.body.password, 8);

    console.log(password)
    repository.findOne(
        {
            select: ["id", "username", "password"],
            where: {
                username: req.body.username.toLowerCase()
            }
        })
        .then(item => {
            console.log('----------------')
            console.log(item)


            if (item !== null && item !== undefined) {
                let passwordIsValid = bcrypt.compareSync(req.body.password, item.password)
                console.log(passwordIsValid)
                if (passwordIsValid) {


                    repository.findOne({
                        where: {username: item.username},
                        relation: ['refreshToken']
                    }).then((user: User) => {


                        loginProcess(user, req, res, refreshTokenRepository)


                    })


                } else {
                    res.status(400).send({err: "Nom d'utilisateur ou mot de passe incorrecte"})
                }
            } else {
                res.status(400).send({err: "Nom d'utilisateur incorrecte"})
            }




        })
}


export function tokenAuth(repository, req: Request, res: Response) {
    if (req.headers['authorization']) {
        // je le décode
        jwt.verify(req.headers['authorization'], jwtSecret, (err, decoded) => {
            if (err) {
                res.status(400).send({err: err})
            }
            else {
                repository.findOne({
                    where: {
                        username: decoded.username.toLowerCase()
                    },
                    select: ["id", "username", "nom", "prenom", "civilite", "avatar"],

                }).then(user => {
                    if (user !== null && user !== undefined) {
                        res.status(200).send(user);
                    }
                    else {
                        res.status(405).send(user)
                    }
                })
            }
        });
    }
}


export function newCompte(repository: Repository<User>, req: Request, res: Response) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    repository.save(req.body).then(item => {
        console.log('item')
        console.log(item)
        res.status(201).send({msg: 'Utilisateur créé'})
    }, err => {
        console.log(err)
        res.status(403).send({msg: 'Erreur Username déjà existant'})
    })
}


function makeToken(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


export function refreshToken(repository: Repository<RefreshTocken>, req: Request, res: Response) {
    repository.findOne({
        where: {ip: req.ip, refreshToken: req.body['refreshToken']},
        relations: ["user"]
    }).then(token=>{
        if (token){
            loginProcess(token.user, req, res, repository);
        } else {
            res.status(401).send()
        }
    })




}


export function loginProcess(user: User, req: Request, res: Response, refreshTokenRepository) {

    let token = jwt.sign({username: user.username}, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
    });
    req.headers['authorization'] = token;


    refreshTokenRepository.findOne({
        where: {user: user.id, ip: req.ip}
    }).then(refreshToken => {
        let tmpRefresh: RefreshTocken;
        if (refreshToken) {
            tmpRefresh = {...refreshToken}
            tmpRefresh.validDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        } else {
            tmpRefresh = new RefreshTocken();
            tmpRefresh.ip = req.ip || null;
            tmpRefresh.refreshToken = makeToken() + '-' + makeToken() + '-' + makeToken() + '-' + makeToken();
            tmpRefresh.validDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            tmpRefresh.user = user;
        }

        refreshTokenRepository.save(tmpRefresh).then(refreshToken => {
            res.status(200).send({
                user: user,
                token: token,
                refreshToken: refreshToken.refreshToken,
                ip: req.ip
            });
        })

    });
}