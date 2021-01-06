import express from "express";
import Banco from "./infra/pg";
import * as Util from "./infra/util";
import Contato from "./contatos";


require("dotenv-safe").config();
var bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

var database = process.env.POSTGRES_DB || "varejao";
var password = process.env.POSTGRES_PASSWORD || "admin";
var user = process.env.POSTGRES_USER || "admin";
var host = process.env.HOST_DB || "localhost";
Banco.setDatabase(host, database, user, password,5432);


var server = express();

server.use(
  bodyParser({
    limit: "50mb"
  })
);


const id_varejao = 1; //id varejao, esse id viria do banco de dados
const id_macapa = 2; //id varejao, esse id viria do banco de dados
jwt.sign({ id: id_varejao, banco: 1 }, process.env.SECRET)
jwt.sign({ id: id_macapa, banco: 2 }, process.env.SECRET)



server.use("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept, x-access-token");
  return next();
});


server.use("/*", function(req, res, next) {
  jwt.verify(req.headers["x-access-token"], process.env.SECRET, function(err, decoded) {
    if(err) {
      res.send({
        erro: "token api error"
      });
    } else {
      req.banco = decoded.banco
      return next();
    }
  });
});





new Contato(server);


server.listen(7000);
