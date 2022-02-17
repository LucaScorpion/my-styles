import React from 'react';

export interface Props {
  to: string;
  className?: string;
}

export const ExternalLink: React.FC<Props> = ({ to, className, children }) => (
  <a href={to} className={className} rel="nofollow noopener noreferrer external" target="_blank">
    {children}
  </a>
);
