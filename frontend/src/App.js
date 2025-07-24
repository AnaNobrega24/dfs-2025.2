import React, { useState } from 'react';
import UsuarioForm from './components/UsuarioForm';
import UsuarioLista from './components/UsuarioLista';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const atualizarLista = (usuario = null) => {
    setUsuarioEditando(usuario);
    setRefresh(prev => !prev);
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow p-4">
        <h1 className="text-center mb-4">Cadastro e Gerenciamento de Usuários</h1>

        <UsuarioForm
          usuarioEditando={usuarioEditando}
          onAtualizar={atualizarLista}
        />

        <UsuarioLista
          onEditar={usuario => setUsuarioEditando(usuario)}
          refresh={refresh}
        />
      </div>
    </div>
  );
}

export default App;
