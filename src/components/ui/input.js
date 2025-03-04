// src/components/ui/inputs.js
import React from 'react';

const Input = ({ value, onChange, ...props }) => (
  <input value={value} onChange={onChange} {...props} />
);

export default Input;