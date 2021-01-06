'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var mysql = require('mysql');
var host = 'localhost';
var user = 'admin';
var password = 'admin';
var database = 'admin';

var Banco = (function () {
  function Banco() {
    _classCallCheck(this, Banco);

    this.connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });
  }

  _createClass(Banco, [{
    key: 'gravar',
    value: function gravar(data, callback) {
      this.connection.connect();

      this.connection.query("INSERT INTO contacts (nome, celular) VALUES ('" + data.nome + "', '" + data.celular + "')", function (error, results, fields) {
        if (error) throw error;
        callback(results);
      });

      this.connection.end();
    }
  }]);

  return Banco;
})();

exports['default'] = Banco;
module.exports = exports['default'];