"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _infraPg = require("./infra/pg");

var _infraPg2 = _interopRequireDefault(_infraPg);

var _infraUtil = require("./infra/util");

var Util = _interopRequireWildcard(_infraUtil);

var _contatos = require("./contatos");

var _contatos2 = _interopRequireDefault(_contatos);

require("dotenv-safe").config();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var database = process.env.POSTGRES_DB || "varejao";
var password = process.env.POSTGRES_PASSWORD || "admin";
var user = process.env.POSTGRES_USER || "admin";
var host = process.env.HOST_DB || "localhost";
_infraPg2["default"].setDatabase(host, database, user, password, 5432);

var server = (0, _express2["default"])();

server.use(bodyParser({
  limit: "50mb"
}));

var id_varejao = 1; //id varejao, esse id viria do banco de dados
var id_macapa = 2; //id varejao, esse id viria do banco de dados
jwt.sign({ id: id_varejao, banco: 1 }, process.env.SECRET);
jwt.sign({ id: id_macapa, banco: 2 }, process.env.SECRET);

server.use("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept, x-access-token");
  return next();
});

server.use("/*", function (req, res, next) {
  jwt.verify(req.headers["x-access-token"], process.env.SECRET, function (err, decoded) {
    if (err) {
      res.send({
        erro: "token api error"
      });
    } else {
      req.banco = decoded.banco;
      return next();
    }
  });
});

new _contatos2["default"](server);

server.listen(7000);