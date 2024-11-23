import express from "express";
import multer from "multer";
import cors from "cors";
import { listarTodosOsPosts, postarNovoPost, uploadImagem, atualizaNovoPost } from "../controllers/postsController.js";
import { listarTodosOsUsuarios } from "../controllers/usuariosController.js";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento do Multer para uploads de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Especifica o diretório
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({dest: "./uploads", storage});

const routes = (app)=> {
  // Permite que o servidor interprete requisições com corpo no formato JSON
  app.use(express.json());

  app.use(cors(corsOptions));
  // Rota para buscar todos os posts
  app.get("/posts", listarTodosOsPosts);
  // Rota para buscar todos os usuários
  app.get("/usuarios", listarTodosOsUsuarios);
  // Rota para criar um post
  app.post("/posts", postarNovoPost);

  // app.put("/posts/:id", atualizarPost);
  // Rota para upload de imagens
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizaNovoPost);

}

export default routes;