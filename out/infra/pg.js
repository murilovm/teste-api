"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _banco_multiplo = require("./banco_multiplo");

var _banco_multiplo2 = _interopRequireDefault(_banco_multiplo);

var moment = require("moment");
var client = null;
var debug = false;

exports.setDatabase = function (host, nome, PUser, Ppassword, port) {
  _banco_multiplo2["default"].setDatabase(host, nome, PUser, Ppassword, port);
  // NovoCliente();
};
exports.setDebug = function (status) {
  _banco_multiplo2["default"].setDebug(status);
  debug = status;
};
exports.setPort = function (pt) {
  _banco_multiplo2["default"].setPort(pt);
  port = pt;
};

exports.desativarItemUso = function (item) {
  _banco_multiplo2["default"].desativarItemUso(item);
};

exports.getDB = function (callback) {
  _banco_multiplo2["default"].getClientNew(function (clientNew) {
    callback(clientNew);
  });
};

function getPgCliente(callback) {
  _banco_multiplo2["default"].getClientNew(function (clientNew) {
    callback(clientNew);
  });
}

exports.first = function (sql, retorno) {
  _banco_multiplo2["default"].first(sql, retorno);
};
exports.select = function (sql, retorno) {
  _banco_multiplo2["default"].select(sql, retorno);
};

exports.exec = function (sql, retorno) {
  _banco_multiplo2["default"].select(sql, retorno);
};

exports.gravar = function gravar(sql, retorno) {
  _banco_multiplo2["default"].query(sql, function (err, result) {
    if (err) {
      if (debug) console.log(err);
      if (retorno) retorno(result, err);
    } else {
      retorno(result.rows[0]);
    }
  });
};