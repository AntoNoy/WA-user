import {Request, Response} from "express";


export function getAll(repository, req: Request, res: Response) {
    repository.find().then(item => res.status(200).send(item))
}

export function getById(repository, req: Request, res: Response) {
    repository.findOne(req.params.id).then(item => {
        console.log(item)
        if (item === undefined) {
            res.status(400).send({msg: "id inconnu"})
        } else {
            send200(item, res)
        }
    }).catch(err => res.status(400).send(err))
}

export function post(repository, req: Request, res: Response) {
    repository.save(req.body).then(item => {
        repository.findOne(item.id).then(item => {
            send200(item, res)
        })
    })
}

export function put(repository, req: Request, res: Response) {
    repository.update(req.params.id, req.body).then(item => {
        repository.findOne(item.id).then(item => {
            send200(item, res)
        })
    })
}

export function remove(repository, req: Request, res: Response) {
    repository.delete(req.params.id).then(item => {
send200(item, res)

    })
}



function send200(item, res){
    res.status(200).send(item)
}
