import React, { HTMLProps } from 'react';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<Props> = ({ value, onChange, ...props }) => (
  <input {...props} value={value} onChange={(e) => onChange(e.currentTarget.value)} />
);
