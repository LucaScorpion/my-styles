import React from 'react';

export const Styles: React.FC = () => {
  // TODO
  const stylesheets: any[] = [];

  return (
    <div className="tab-styles">
      <div className="list">
        {stylesheets.map((s) => (
          <div key={s.url}>
            <span>{s.url}</span>
            <span className="group">
              <button>Update</button>
              <button>Disable</button>
              <button onClick={() => undefined}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
