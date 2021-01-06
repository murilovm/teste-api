"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = select;
exports.insert = insert;
exports.update = update;
exports.isText = isText;
exports.isBool = isBool;
exports.getSql = getSql;
exports.monteListaWhere = monteListaWhere;
exports.montarEndereco = montarEndereco;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

var SqlString = require("sqlstring");

function select(sql, values) {
  var entradas = [];
  for (var i = 0; i < values.length; i++) {
    var value = values[i];

    entradas.push(value);
  }
  var sql = SqlString.format(sql, entradas);
  return sql;
}

function insert(tabela, fields, data) {
  var entradas = [];
  var resultInsert = "insert into " + tabela + " (";
  var resultValues = " values ( ";
  var contador = 0;
  for (var i = 0; i < fields.length; i++) {
    if (data[fields[i]] == undefined) continue;

    var _tratarDados = tratarDados(fields[i], data[fields[i]]);

    var nome = _tratarDados.nome;
    var value = _tratarDados.value;
    var escape = _tratarDados.escape;

    // Util.replaceAll(Util.replaceAll(value,"D'","D`"),"d'","d`");
    entradas.push(value);
    if (contador > 0) {
      resultInsert += ", ";
      resultValues += ", ";
    }
    resultInsert += ' "' + nome + '" ';
    resultValues += escape ? "E?" : " ? ";
    contador++;
  }
  resultInsert += " ) ";
  resultValues += " )  RETURNING * ";

  var sql = SqlString.format(resultInsert + resultValues, entradas);
  return sql;
}

function update(tabela, fields, data, where) {
  var entradas = [];
  var resultUpdate = "update " + tabela + " set ";
  var contador = 0;

  for (var i = 0; i < fields.length; i++) {
    if (data[fields[i]] == undefined) continue;

    var _tratarDados2 = tratarDados(fields[i], data[fields[i]]);

    var nome = _tratarDados2.nome;
    var value = _tratarDados2.value;
    var escape = _tratarDados2.escape;

    entradas.push(value);
    if (contador > 0) {
      resultUpdate += ", ";
    }
    resultUpdate += ' "' + nome + '" = ' + (escape ? "E?" : " ? ");
    contador++;
  }
  resultUpdate += "    " + (where ? where : "") + " RETURNING * ";

  var sql = SqlString.format(resultUpdate, entradas);
  return sql;
}

function tratarDados(nome, value) {
  var escape = false;
  if (isObject(value) || isArray(value)) {
    if (isArray(value) && Number.isInteger(value[0])) {
      value = JSON.stringify(value);
      value = _util2["default"].replaceAll(value, "[", "{");
      value = _util2["default"].replaceAll(value, "]", "}");
      escape = true;
    } else if (isArray(value) && !value[0]) {
      value = null;
    } else {
      value = JSON.stringify(value);
      escape = true;
    }
  } else if (isText(value)) {
    escape = true;
  }
  if (!isBool(value) && !value && !Number.isInteger(value) || value == "null") {
    value = null;
    escape = false;
  }
  return { nome: nome, value: value, escape: escape };
}

function isObject(val) {
  return typeof val === "object";
}

function isText(val) {
  return typeof val === 'string' || val instanceof String;
}

function isBool(bool) {
  return typeof bool === 'boolean' || typeof bool === 'object' && bool !== null && typeof bool.valueOf() === 'boolean';
}

function isArray(object) {
  if (object && JSON.stringify(object) == "[]") {
    return true;
  }
  if (object && object.constructor && object.constructor === Array) {
    return true;
  } else {
    return false;
  }
}

var dataSqlMemory = {};

function getSql(path) {
  if (dataSqlMemory[path]) {
    return dataSqlMemory[path];
  }
  try {
    var buf = _fs2["default"].readFileSync("./out/sql/" + path + ".sql", "utf8");
    dataSqlMemory[path] = buf;
    return buf;
  } catch (e) {
    console.log(e);
    return "";
  }
}

function monteListaWhere(listAdds) {
  if (!isArray(listAdds) && !listAdds[0]) return '';
  var whereAdds = "";
  for (var i = 0; i < listAdds.length; i++) {
    var tags = listAdds[i];
    if (i > 0) {
      whereAdds += " AND ";
    }
    whereAdds += tags;
  }
  return whereAdds;
}

function montarEndereco(tabela) {
  tabela = tabela ? tabela + "." : '';
  return " concat(" + tabela + "rua,', '," + tabela + "numero,', '," + tabela + "bairro,', '," + tabela + "cidade,', '," + tabela + "estado,', '," + tabela + "cep) ";
}