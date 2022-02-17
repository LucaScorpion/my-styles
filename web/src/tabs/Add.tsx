import React, { useState } from 'react';
import { TextInput } from '../components/input/TextInput';

export const Add: React.FC = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="tab-add">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: Store stylesheet.
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
