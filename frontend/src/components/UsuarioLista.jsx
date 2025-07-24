// src/components/UsuarioLista.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import {
  Eye,
  Pencil,
  Trash,
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  CalendarFill,
  HouseFill,
  CalendarCheckFill
} from 'react-bootstrap-icons';

function UsuarioLista({ onEditar, refresh }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalUsuario, setModalUsuario] = useState(null);
  const [ordenadoAsc, setOrdenadoAsc] = useState(true);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const usuariosPorPagina = 5;

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, [refresh]);

  const excluirUsuario = async id => {
    if (window.confirm('Deseja realmente excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  };

  // Filtra e ordena
  const usuariosFiltrados = usuarios
    .filter(u =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      const na = a.nome.toLowerCase();
      const nb = b.nome.toLowerCase();
      return ordenadoAsc ? na.localeCompare(nb) : nb.localeCompare(na);
    });

  // Cálculo da páginação
  const indexInicial = (paginaAtual - 1) * usuariosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indexInicial, indexInicial + usuariosPorPagina);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  return (
    <div>
      <h2 className="text-center mt-4 mb-3">Usuários Cadastrados</h2>

      {/* Busca + Ordenação */}
      <div className="input-group mb-3">
        <span className="input-group-text">🔍</span>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nome ou e-mail"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <button
          className="btn btn-secondary"
          onClick={() => setOrdenadoAsc(!ordenadoAsc)}
        >
          Ordenar: {ordenadoAsc ? 'A → Z' : 'Z → A'}
        </button>
      </div>

      {/* Lista */}
      <ul className="list-group">
        {usuariosPaginados.length > 0 ? (
          usuariosPaginados.map(usuario => (
            <li
              key={usuario.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                {/* Avatar */}
                {usuario.avatar ? (
                  <img
                    src={`http://localhost:5000/uploads/${usuario.avatar}`}
                    alt="avatar"
                    className="me-3 rounded-circle"
                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white text-center me-3"
                    style={{
                      width: 40,
                      height: 40,
                      lineHeight: '40px',
                      fontWeight: 'bold'
                    }}
                  >
                    {usuario.nome
                      .split(' ')
                      .map(p => p[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                )}

                {/* Nome + e-mail */}
                <div>
                  <strong>{usuario.nome}</strong><br />
                  <small className="text-muted">{usuario.email}</small>
                </div>
              </div>

              {/* Ações */}
              <div>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => setModalUsuario(usuario)}
                >
                  <Eye className="me-1" /> Ver Detalhes
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEditar(usuario)}
                >
                  <Pencil className="me-1" /> Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => excluirUsuario(usuario.id)}
                >
                  <Trash className="me-1" /> Excluir
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">
            Nenhum usuário encontrado.
          </li>
        )}
      </ul>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i}
                className={`page-item ${paginaAtual === i + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaAtual(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Modal de detalhes */}
      <Modal show={!!modalUsuario} onHide={() => setModalUsuario(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Usuário</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalUsuario && (
            <div className="text-center">
              {/* Avatar grande */}
              {modalUsuario.avatar && (
                <img
                  src={`http://localhost:5000/uploads/${modalUsuario.avatar}`}
                  alt="avatar"
                  className="mb-3 rounded-circle"
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
              )}

              <ul className="list-unstyled text-start">
                <li>
                  <PersonFill className="me-2" />
                  <strong>Nome:</strong> {modalUsuario.nome}
                </li>
                <li>
                  <EnvelopeFill className="me-2" />
                  <strong>E-mail:</strong> {modalUsuario.email}
                </li>
                <li>
                  <TelephoneFill className="me-2" />
                  <strong>Telefone:</strong> {modalUsuario.telefone}
                </li>
                <li>
                  <CalendarFill className="me-2" />
                  <strong>Nascimento:</strong>{' '}
                  {modalUsuario.dataNascimento?.split('T')[0]}
                </li>
                <li>
                  <HouseFill className="me-2" />
                  <strong>Endereço:</strong> {modalUsuario.endereco}
                </li>
                <li>
                  <CalendarCheckFill className="me-2" />
                  <strong>Data de Cadastro:</strong>{' '}
                  {modalUsuario.criadoEm?.split('T')[0]}
                </li>
              </ul>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalUsuario(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsuarioLista;
