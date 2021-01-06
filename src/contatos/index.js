var request = require("request");
import * as Contato from "./logica";

export default class Router {
  constructor(server) {

    server.post("/contatos", (req, res) => {
        Contato.criar(req.body, req.banco, (data, error) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(data);
          }
        });
    });

  }
}
