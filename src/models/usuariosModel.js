import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export default async function getTodosUsuarios() {
  // Seleciona o banco de dados "imersao-instabytes"
  const db = conexao.db("imersao-instabytes");
  // Seleciona a coleção "usuarios" dentro do banco de dados
  const colecao = db.collection("usuarios");
  // Retorna um array com todos os documentos da coleção
  return colecao.find().toArray();

}