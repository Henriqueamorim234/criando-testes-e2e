import { Router } from 'express';
import { VendasController } from '#controllers/vendas.controller.js';
import db from '#db/singleton-connection.js';
import VendasServices from '#services/vendas.services.js';

export default function vendasRoutes(dependencias) {
  const router = Router();

  const vendasServices = new VendasServices(
    db,
    dependencias.emailGateway,
    dependencias.estoqueGateway,
  );
  const vendasController = new VendasController(db, vendasServices);

  router.post('/vendas', vendasController.registrarVenda.bind(vendasController));

  return router;
}
