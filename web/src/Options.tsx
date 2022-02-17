import React from 'react';
import icon from './icon_48.png';
import { Tabs } from './components/Tabs';
import { About } from './tabs/About';
import { Styles } from './tabs/Styles';
import { Add } from './tabs/Add';
import { Scratchpad } from './tabs/Scratchpad';

export const Options: React.FC = () => {
  return (
    <main className="options">
      <div className="title">
        <img src={icon} alt="" />
        <h1>My Styles</h1>
      </div>
      <Tabs
        panes={[
          {
            name: 'Add',
            content: <Add />,
          },
          {
            name: 'Styles',
            content: <Styles />,
          },
          {
            name: 'Scratchpad',
            content: <Scratchpad />,
          },
          {
            name: 'About',
            content: <About />,
          },
        ]}
      />
    </main>
  );
};
