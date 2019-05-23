import {Request, Response} from "express";
import * as loginController from "../controller/login.controller";

var express = require('express');
var router = express.Router();


router.use('/users', require('./users'));

module.exports=router