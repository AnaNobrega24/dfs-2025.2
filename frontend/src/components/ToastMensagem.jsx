import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

function ToastMensagem({ show, onClose, titulo, mensagem, tipo = 'success' }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast bg={tipo} show={show} onClose={onClose} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">{titulo}</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{mensagem}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastMensagem;
