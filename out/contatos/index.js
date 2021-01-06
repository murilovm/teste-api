"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _logica = require("./logica");

var Contato = _interopRequireWildcard(_logica);

var request = require("request");

var Router = function Router(server) {
  _classCallCheck(this, Router);

  server.post("/contatos", function (req, res) {
    Contato.criar(req.body, req.banco, function (data, error) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send(data);
      }
    });
  });
};

exports["default"] = Router;
module.exports = exports["default"];