import { getTodosPosts, criarPost, atualizarPostImg } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarTodosOsPosts(req, res){
  // Chama a função para buscar os posts
  const posts =  await getTodosPosts();
  // Enviar uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
}
 
export async function postarNovoPost(req, res) {
  // Cria um nova variavel para retornar o conteúdo da requisição do novo post
  const novoPost = req.body;
  try {
    const postCriado = await criarPost(novoPost);
    res.status(200).json(postCriado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      "erro": "Falha na requisição"
    });
  }
}

export async function atualizaNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const postAtualizado = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    };
    const postCriado = await atualizarPostImg(id, postAtualizado);
    res.status(200).json(postCriado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      "erro": "Falha na requisição"
    });
  }
}

// export async function atualizarPost(req, res) {
//   const { id } = req.params; // Pega o id da URL
//   const novosPosts = req.body; // Pega os novos dados do corpo da requisição

//   try {
//     // Atualiza o post no banco de dados
//     const postAtualizado = await PostModel.updateOne({ _id: id }, { $set: novosPosts });
    
//     // Verifica se algum documento foi modificado
//     if (postAtualizado.modifiedCount === 0) {
//       return res.status(404).json({ mensagem: "Post não encontrado ou não foi alterado." });
//     }
    
//     res.status(200).json({ mensagem: "Post atualizado com sucesso!" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       erro: "Falha na requisição"
//     });
//   }
// }

export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  try {
    const postCriado = await criarPost(novoPost);
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    fs.renameSync(req.file.path, imagemAtualizada);
    res.status(200).json(postCriado);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      "erro": "Falha na requisição"
    });
  }
}