import React, { useState } from 'react';
import { TextInput } from '../components/input/TextInput';
import { useStylesheets } from '../storage/styles';
import { addUrlScheme } from '../utils/addUrlScheme';

export const Add: React.FC = () => {
  const [url, setUrl] = useState('');
  const [stylesheets, setStylesheets] = useStylesheets();

  return (
    <div className="tab-add">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStylesheets([
            ...stylesheets,
            {
              url: addUrlScheme(url),
              host: '',
            },
          ]);
          setUrl('');
        }}
      >
        <div className="group">
          <TextInput value={url} onChange={setUrl} placeholder="https://raw.githubusercontent.com/..." required />
          <button disabled={!url}>Add</button>
        </div>
      </form>
    </div>
  );
};
