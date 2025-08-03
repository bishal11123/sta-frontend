// components/Modal.jsx
import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={closeBtnStyle}>×</button>
        {children}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontSize: '24px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};
