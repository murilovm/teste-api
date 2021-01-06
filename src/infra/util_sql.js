var SqlString = require("sqlstring");
import fs from "fs";
import Util from "./util";
export function select(sql, values) {
  var entradas = [];
  for (let i = 0; i < values.length; i++) {
    let value = values[i];

    entradas.push(value);
  }
  var sql = SqlString.format(sql, entradas);
  return sql;
}

export function insert(tabela, fields, data) {
  var entradas = [];
  var resultInsert = "insert into " + tabela + " (";
  var resultValues = " values ( ";
  var contador = 0;
  for (let i = 0; i < fields.length; i++) {
    if (data[fields[i]] == undefined) continue;
    let {nome,value,escape}=tratarDados(fields[i],data[fields[i]]);
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

  var sql = SqlString.format(resultInsert + resultValues , entradas);
  return sql;
}

export function update(tabela, fields, data, where) {
  var entradas = [];
  var resultUpdate = "update " + tabela + " set ";
  var contador = 0;

  for (let i = 0; i < fields.length; i++) {
    if (data[fields[i]] == undefined) continue;
    let {nome,value,escape}=tratarDados(fields[i],data[fields[i]]);
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


function tratarDados(nome,value){
  let escape=false;
  if (isObject(value) || isArray(value)) {
    if (isArray(value)&&Number.isInteger(value[0])) {
      value = JSON.stringify(value);
      value = Util.replaceAll(value, "[", "{");
      value = Util.replaceAll(value, "]", "}");
      escape = true;
    }else if (isArray(value)&&!value[0]){
      value=null;

    }else{
      value = JSON.stringify(value);
      escape = true;
    }

  }else if(isText(value)){
    escape = true;
  }
  if(!isBool(value)&&!value&&!Number.isInteger(value)||value=="null"){
    value=null;
    escape = false;
  }
  return {nome,value,escape};
}


function isObject(val) {
  return typeof val === "object";
}

export function isText(val) {
  return typeof val === 'string' || val instanceof String;
}

export function isBool(bool) {
  return typeof bool === 'boolean' ||
  (typeof bool === 'object' &&
  bool !== null            &&
  typeof bool.valueOf() === 'boolean');
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
export function getSql(path) {
  if (dataSqlMemory[path]) {
    return dataSqlMemory[path];
  }
  try {
    var buf = fs.readFileSync("./out/sql/" + path + ".sql", "utf8");
    dataSqlMemory[path] = buf;
    return buf;
  } catch (e) {
    console.log(e);
    return "";
  }
}

export function monteListaWhere(listAdds){
  if(!isArray(listAdds)&&!listAdds[0])return '';
  var whereAdds = "";
  for (var i = 0; i < listAdds.length; i++) {
    let tags = listAdds[i];
    if (i > 0) {
      whereAdds += " AND ";
    }
    whereAdds += tags;
  }
  return whereAdds;
}

export function montarEndereco (tabela){
  tabela=tabela?tabela+".":''
  return ` concat(${tabela}rua,', ',${tabela}numero,', ',${tabela}bairro,', ',${tabela}cidade,', ',${tabela}estado,', ',${tabela}cep) `
}
