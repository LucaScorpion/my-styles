import React from 'react';
import { ExternalLink } from '../components/ExternalLink';

export const About: React.FC = () => (
  <div className="tab-about">
    <label>Created By</label>
    <div>
      <ExternalLink to="https://github.com/LucaScorpion">Luca Scalzotto</ExternalLink>
    </div>
    <label>Source Code</label>
    <div>
      <ExternalLink to="https://github.com/LucaScorpion/my-styles">GitHub</ExternalLink>
    </div>
  </div>
);
