import React from 'react';
import { useStylesheets } from '../storage/styles';

export const Styles: React.FC = () => {
  const [stylesheets, setStylesheets] = useStylesheets();

  return (
    <div className="tab-styles">
      <div className="list">
        {stylesheets.map((s) => (
          <div key={s.url}>
            <span>{s.url}</span>
            <span className="group">
              <button>Update</button>
              <button>Disable</button>
              <button onClick={() => setStylesheets(stylesheets.filter((check) => check.url !== s.url))}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
