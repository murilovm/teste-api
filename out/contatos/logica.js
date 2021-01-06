"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.criar = criar;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _infraPg = require("../infra/pg");

var _infraPg2 = _interopRequireDefault(_infraPg);

var _infraMysql = require("../infra/mysql");

var _infraMysql2 = _interopRequireDefault(_infraMysql);

var _infraUtil_sqlJs = require("../infra/util_sql.js");

var Sql = _interopRequireWildcard(_infraUtil_sqlJs);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function criar(data, banco, callback) {
  if (validar(data).erro == true) return callback(null, { msg: validar(data).msg, status: 500 });
  if (banco && banco == 1) {
    salvarRecursivaVarejao(data.contacts, 0, 0, function (res, error) {
      callback(res, error);
    });
  } else if (banco && banco == 2) {
    salvarRecursivaMacapa(data.contacts, 0, 0, function (res, error) {
      callback(res, error);
    });
  } else {
    callback(null, { msg: "Banco de dados não encontrado!" });
  }
}

function validar(data) {
  if (!data) return { erro: true, msg: "Dados inválidos!" };
  if (data && !data.contacts) return { erro: true, msg: "Campo contacts não informado!" };
  if (data && !Array.isArray(data.contacts)) return { erro: true, msg: "Campo contacts não é um array!" };
  return { erro: false };
}

function salvarVarejao(data, callback) {
  var sql = Sql.insert('contacts', ['nome', 'celular'], data);
  _infraPg2["default"].gravar(sql, function (res, error) {
    if (callback) callback(res, error);
  });
}

function salvarMacapa(data, callback) {
  var banco = new _infraMysql2["default"]();
  banco.gravar(data, function (res, error) {
    callback(res, error);
  });
}

function salvarRecursivaVarejao(data, pos, erro, callback) {
  if (pos < data.length && erro == 0) {
    var item = data[pos];
    salvarVarejao({ nome: item.name, celular: item.cellphone.replace(/\D/g, '') }, function (res, error) {
      if (error) erro = 1;
      pos++;
      salvarRecursivaVarejao(data, pos, erro, callback);
    });
  } else {
    if (erro == 1) return callback(null, { msg: "Erro ao salvar contatos!" });
    callback({ success: 1 });
  }
}

function salvarRecursivaMacapa(data, pos, erro, callback) {
  if (pos < data.length && erro == 0) {
    var item = data[pos];
    salvarMacapa({ nome: item.name.toUpperCase(), celular: mascaraCelular(item.cellphone) }, function (res, error) {
      if (error) erro = 1;
      pos++;
      salvarRecursivaMacapa(data, pos, erro, callback);
    });
  } else {
    if (erro == 1) return callback(null, { msg: "Erro ao salvar contatos!" });
    callback({ success: 1 });
  }
}

function mascaraCelular(numero) {

  var parte1 = "+" + numero.slice(0, 2);
  var parte2 = " (" + numero.slice(2, 4) + ")";
  var parte3 = " " + numero.slice(4, 9) + "-";
  var parte4 = numero.slice(9, 13);

  return parte1 + parte2 + parte3 + parte4;
}