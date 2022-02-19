import React from 'react';
import { useStylesheets } from '../storage/styles';
import { Icon } from '../components/Icon';
import { ExternalLink } from '../components/ExternalLink';
import { fileName } from '../utils/fileName';

export const Styles: React.FC = () => {
  const [stylesheets, setStylesheets] = useStylesheets();

  return (
    <div className="tab-styles">
      <div className="list">
        {stylesheets.map((s) => (
          <div key={s.url}>
            <span className="info">
              <ExternalLink to={s.url}>{fileName(s.url)}</ExternalLink>
            </span>
            <span className="group">
              <button>
                <Icon icon="cloud-arrow-down" />
              </button>
              <button>
                <Icon icon="eye-slash" />
              </button>
              <button onClick={() => setStylesheets(stylesheets.filter((check) => check.url !== s.url))}>
                <Icon icon="trash" />
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
