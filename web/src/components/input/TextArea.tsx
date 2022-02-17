import React, { HTMLProps } from 'react';

export interface Props extends Omit<HTMLProps<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const TextArea: React.FC<Props> = ({ value, onChange, ...props }) => (
  <textarea {...props} value={value} onChange={(e) => onChange(e.currentTarget.value)} />
);
