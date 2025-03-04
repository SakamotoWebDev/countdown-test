// src/components/ui/button.js
import React from 'react';

const Button = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
);

export default Button;