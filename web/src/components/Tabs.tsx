import React, { ReactChild, useState } from 'react';
import { classNames } from '../utils/classNames';

export interface Props {
  panes: TabPane[];
}

export interface TabPane {
  name: ReactChild;
  content: ReactChild;
}

export const Tabs: React.FC<Props> = ({ panes }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="tabs">
      <div className="menu">
        {panes.map((p, i) => (
          <div key={i} className={classNames(i === active && 'active')} onClick={() => setActive(i)}>
            {p.name}
          </div>
        ))}
      </div>
      <div className="content">
        {panes.map((p, i) => (
          <div key={i} className={classNames(i === active && 'active')}>
            {p.content}
          </div>
        ))}
      </div>
    </div>
  );
};
