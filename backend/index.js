const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
});
const upload = multer({ storage });

app.post('/usuarios', upload.single('avatar'), async (req, res) => {
  try {
    const { nome, email, senha, telefone, dataNascimento, endereco } = req.body;
    const novo = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        telefone,
        endereco,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        avatar: req.file ? req.file.filename : null,
      },
    });
    res.status(201).json(novo);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado', detalhes: err });
    }
    res.status(500).json({ mensagem: 'Erro ao criar usuário', detalhes: err });
  }
});

app.put('/usuarios/:id', upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, dataNascimento, endereco, removeAvatar } = req.body;

  try {
    const dadosUpdate = {
      nome,
      email,
      senha,
      telefone,
      endereco,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
    };

    if (removeAvatar === 'true') {
      dadosUpdate.avatar = null;
    } else if (req.file) {
      dadosUpdate.avatar = req.file.filename;
    }

    const updated = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosUpdate,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário', detalhes: err });
  }
});


app.get('/usuarios', async (req, res) => {
  const list = await prisma.usuario.findMany();
  res.json(list);
});


app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir usuário', detalhes: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
