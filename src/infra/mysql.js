var mysql = require('mysql');
var host = 'localhost'
var user ='admin'
var password ='admin'
var database ='admin'


export default class Banco {
  constructor() {
    this.connection = mysql.createConnection({
      host,
      user,
      password,
      database
    });
  }

  gravar(data, callback) {
    this.connection.connect();

    this.connection.query("INSERT INTO contacts (nome, celular) VALUES ('"+data.nome+"', '"+data.celular+"')", function (error, results, fields) {
      if (error) throw error;
      callback(results);
    });

    this.connection.end();
  }

}
