import { Router } from 'express';
import { LivrosController } from '#controllers/livros.controller.js';
import db from '#db/singleton-connection.js';
const router = Router();

const livrosController = new LivrosController(db);

router.get('/livros', (req, res) => livrosController.listarLivros(req, res));
router.get('/livros/:id', (req, res) => livrosController.buscarLivroPorId(req, res));
router.post('/livros', livrosController.cadastrarLivro);

export default router;
