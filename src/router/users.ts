//Users
import {Request, Response} from "express";
import * as userController from "../controller/user.controller";


var express = require('express');
var router = express.Router();

import {getConnection} from "typeorm";
import {User} from "../entity/User";


const connection = getConnection();

const userRepository = connection.getRepository(User);


router.get("/", async function (req: Request, res: Response) {
    userController.getAll(userRepository, req, res);
});

router.get("/:id", async function (req: Request, res: Response) {
    userController.getById(userRepository, req, res);
});

router.post("/", async function (req: Request, res: Response) {
    userController.post(userRepository, req, res)
});

router.put("/:id", async function (req: Request, res: Response) {
    userController.put(userRepository, req, res)
});

router.delete("/:id", async function (req: Request, res: Response) {
    return userRepository.remove(req.params.id);
});

router.post("/change-password", async function (req: Request, res: Response) {
    userController.changePassword(userRepository, req, res);
});


module.exports = router