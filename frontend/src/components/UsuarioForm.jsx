// src/components/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Eye, EyeSlash, Upload } from 'react-bootstrap-icons';
import { ToastContainer, Toast } from 'react-bootstrap';

function UsuarioForm({ usuarioEditando, onAtualizar }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    dataNascimento: '',
    endereco: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Quando entra em modo edição, preenche o form
  useEffect(() => {
    if (usuarioEditando) {
      setFormData({
        nome: usuarioEditando.nome || '',
        email: usuarioEditando.email || '',
        senha: usuarioEditando.senha || '',
        telefone: usuarioEditando.telefone || '',
        dataNascimento: usuarioEditando.dataNascimento
          ? usuarioEditando.dataNascimento.split('T')[0]
          : '',
        endereco: usuarioEditando.endereco || ''
      });
      setAvatar(null);
      setRemoveAvatar(false);
    } else {
      // limpa ao sair da edição
      setFormData({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        dataNascimento: '',
        endereco: ''
      });
      setAvatar(null);
      setRemoveAvatar(false);
    }
  }, [usuarioEditando]);

  // Máscara de telefone BR
  const formatPhone = value => {
    const digits = value.replace(/\D/g, '').substring(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  };

  // Handle change genérico + máscara no telefone
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      setFormData(f => ({ ...f, telefone: formatPhone(value) }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { nome, email, senha, telefone, dataNascimento } = formData;

    // validações básicas
    if (!nome || !email || !senha || !telefone || !dataNascimento) {
      setToastVariant('warning');
      setToastMsg('Preencha todos os campos obrigatórios.');
      setShowToast(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToastVariant('warning');
      setToastMsg('Formato de e-mail inválido.');
      setShowToast(true);
      return;
    }

    try {
      // monta FormData
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => v && fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      if (removeAvatar) fd.append('removeAvatar', 'true');

      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setToastVariant('success');
        setToastMsg('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setToastVariant('success');
        setToastMsg('Usuário cadastrado com sucesso!');
      }

      setShowToast(true);
      onAtualizar(null);
    } catch (err) {
      if (err.response?.data?.detalhes?.code === 'P2002') {
        setToastVariant('danger');
        setToastMsg('Este e-mail já está cadastrado.');
      } else {
        setToastVariant('danger');
        setToastMsg('Erro ao salvar usuário.');
        console.error(err);
      }
      setShowToast(true);
    }
  };

  return (
    <>
      {/* Toasts */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        {/* Nome */}
        <div className="col-md-6">
          <input
            type="text"
            name="nome"
            className="form-control"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        {/* E-mail */}
        <div className="col-md-6">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Senha com botão mostrar/esconder */}
        <div className="col-md-6 position-relative">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            name="senha"
            className="form-control pe-5"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setMostrarSenha(ms => !ms)}
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer' }}
          >
            {mostrarSenha ? <EyeSlash /> : <Eye />}
          </span>
        </div>

        {/* Telefone com máscara */}
        <div className="col-md-6">
          <input
            type="text"
            name="telefone"
            className="form-control"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Data de nascimento */}
        <div className="col-md-6">
          <input
            type="date"
            name="dataNascimento"
            className="form-control"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
          />
        </div>

        {/* Endereço */}
        <div className="col-md-6">
          <input
            type="text"
            name="endereco"
            className="form-control"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>

        {/* Upload de avatar */}
        <div className="col-md-12">
          <label className="form-label">
            <Upload className="me-2" />
            Upload de Avatar:
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={e => setAvatar(e.target.files[0])}
          />
        </div>

        {/* Checkbox remover avatar (só em edição) */}
        {usuarioEditando?.avatar && (
          <div className="col-md-12 form-check">
            <input
              id="removeAvatar"
              type="checkbox"
              className="form-check-input"
              checked={removeAvatar}
              onChange={e => setRemoveAvatar(e.target.checked)}
            />
            <label htmlFor="removeAvatar" className="form-check-label">
              Remover avatar atual
            </label>
          </div>
        )}

        {/* Botões */}
        <div className="col-12 d-flex justify-content-between">
          {usuarioEditando && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onAtualizar(null)}
            >
              Cancelar Edição
            </button>
          )}
          <button type="submit" className="btn btn-primary ms-auto">
            {usuarioEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </>
  );
}

export default UsuarioForm;
