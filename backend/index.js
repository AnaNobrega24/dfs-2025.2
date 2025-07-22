const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("API do Projeto DFS-2025.2 está funcionando ✅");
});

// Listar todos os usuários
app.get("/usuarios", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// Cadastrar novo usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha, telefone, dataNascimento, endereco } = req.body;
  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        telefone,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        endereco,
      },
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao cadastrar usuário", detalhes: error });
  }
});

// Editar usuário
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, dataNascimento, endereco } = req.body;
  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senha,
        telefone,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        endereco,
      },
    });
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao editar usuário", detalhes: error });
  }
});

// Excluir usuário
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ mensagem: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao excluir usuário", detalhes: error });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
