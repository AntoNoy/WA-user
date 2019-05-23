import {Request, Response} from "express";
import {Repository} from "typeorm";
import {User} from "../entity/User";

var bcrypt = require('bcryptjs');

export function getAll(repository, req: Request, res: Response) {
    repository.find().then(item => res.status(200).send(item))
}

export function getById(repository, req: Request, res: Response) {
    repository.findOne(req.params.id).then(item => {
        res.status(200).send(item);
    })
}

export function post(repository, req: Request, res: Response) {
 /*   if (req.body.username) {
        req.body.username = req.body.username.toLowerCase()
    }*/

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    repository.save(req.body).then(item => {
        repository.findOne(item.id).then(item => {
            res.status(200).send(item);
        })
    }).catch(err => {
        console.log(err + 'erreur POST USER');
        res.status(400).send(req.headers)
    })
}

export function put(repository, req: Request, res: Response) {
    req.body.username = req.body.username.toLowerCase()
    repository.update(req.params.id, req.body).then(item => {
        repository.findOne(item.id).then(item => {
            res.status(200).send(item);
        })
    })
}

export function changePassword(repository:Repository<User>, req: Request, res: Response) {
    if (req.body.newPassword == req.body.newPassword2){
        repository.findOne({
            where : {id : req['user'].id},
            select: ["id", "username", "password"]
        }).then(user => {
            bcrypt.compare(req.body.oldPassword, user.password).then(valid=>{
                if (valid){
                   user.password = bcrypt.hashSync(req.body.newPassword, 8)

                    repository.save(user).then(userNew=>{
                        bcrypt.compare(req.body.newPassword2, user.password).then(valid=>{
                            if (valid){
                                res.status(200).send({message:'Mot de passe changé'})
                            } else {
                                res.status(400).send({message:"Erreur lors de l'enregistrement du mot de passe"})
                            }
                        })
                    })

                } else {
                    res.status(400).send({message:'Ancien mot de passe non valid'})
                }
            })
        })
    } else {
        res.status(400).send({message:'les mots de passes ne correspondent pas'})
    }
}











