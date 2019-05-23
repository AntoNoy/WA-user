
//Users
import {Request, Response} from "express";
import * as userController from "../controller/user.controller";
import * as serieController from "../controller/serie.controller";
import * as filmController from "../controller/film.controller";
import {AnecdoteGroupe} from "../entity/AnecdoteGroupe";
import * as defaultController from "../controller/default.controller";

var express = require('express');
var router = express.Router();

import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {FavorisSerie} from "../entity/Serie";
import {FavorisFilm} from "../entity/Film";
import {Anecdote} from "../entity/Anecdote";

const connection = getConnection();


const serieRepository= connection.getRepository(FavorisSerie);



//Series
router.get("/", async function (req: Request, res: Response) {
    serieController.getAll(serieRepository, req, res);
});
router.post("/", async function (req: Request, res: Response) {
    serieController.post(serieRepository, req, res)
});


router.get("/:id", async function (req: Request, res: Response) {
    serieController.getById(serieRepository, req, res);
});

router.put("/:id", async function (req: Request, res: Response) {
    serieController.put(serieRepository, req, res)

});

router.delete("/:id", async function (req: Request, res: Response) {
    serieController.remove(serieRepository, req, res)
});
module.exports=router