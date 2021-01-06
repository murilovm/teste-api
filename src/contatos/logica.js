import Postgres from "../infra/pg";
import MySQL from "../infra/mysql";
import * as Sql from "../infra/util_sql.js";
import request from "request";


export function criar(data, banco, callback){
  if(validar(data).erro == true) return callback(null, {msg: validar(data).msg, status: 500})
  if(banco && banco == 1) {
    salvarRecursivaVarejao(data.contacts, 0 , 0, (res, error) => {
      callback(res, error)
    })
  } else if(banco && banco == 2) {
    salvarRecursivaMacapa(data.contacts, 0 , 0, (res, error) => {
      callback(res, error)
    })
  } else {
    callback(null, {msg: "Banco de dados não encontrado!"})
  }
}

function validar(data){
  if(!data) return {erro: true, msg: "Dados inválidos!"}
  if(data && !data.contacts) return {erro:true, msg: "Campo contacts não informado!"}
  if(data && !Array.isArray(data.contacts)) return {erro:true, msg: "Campo contacts não é um array!"}
  return {erro:false}
}

function salvarVarejao(data, callback){
  var sql = Sql.insert('contacts', ['nome', 'celular'], data)
  Postgres.gravar(sql, (res, error) => {
    if(callback) callback(res, error)
  })
}


function salvarMacapa(data, callback){
  let banco = new MySQL();
  banco.gravar(data, (res, error) => {
    callback(res, error)
  })
}

function salvarRecursivaVarejao(data, pos, erro, callback){
  if(pos < data.length && erro == 0) {
    let item = data[pos]
    salvarVarejao({nome: item.name, celular: item.cellphone.replace(/\D/g,'') }, (res, error) => {
      if(error) erro = 1;
      pos++;
      salvarRecursivaVarejao(data, pos, erro, callback)
    })
  } else {
    if(erro == 1) return callback(null, {msg: "Erro ao salvar contatos!"})
    callback({success:1});
  }
}

function salvarRecursivaMacapa(data, pos, erro, callback){
  if(pos < data.length && erro == 0) {
    let item = data[pos]
    salvarMacapa({nome: item.name.toUpperCase(), celular: mascaraCelular(item.cellphone) }, (res, error) => {
      if(error) erro = 1;
      pos++;
      salvarRecursivaMacapa(data, pos, erro, callback)
    })
  } else {
    if(erro == 1) return callback(null, {msg: "Erro ao salvar contatos!"})
    callback({success:1});
  }
}

function mascaraCelular(numero){

  let parte1 = "+" + numero.slice(0,2);
  let parte2 = " (" + numero.slice(2,4) + ")";
  let parte3 = " " + numero.slice(4,9) + "-"
  let parte4 = numero.slice(9,13)

  return parte1 + parte2 + parte3 + parte4;

}
