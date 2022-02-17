import React, { useState } from 'react';
import { TextInput } from '../components/input/TextInput';
import { TextArea } from '../components/input/TextArea';
import { sendMessage } from '../utils/sendMessage';

export const Scratchpad: React.FC = () => {
  const [code, setCode] = useState('');
  const [host, setHost] = useState('');

  return (
    <div className="tab-scratchpad">
      <TextArea value={code} onChange={setCode} placeholder={'body {\n  background-color: red;\n}'} rows={10} />
      <TextInput value={host} onChange={setHost} placeholder="Host, or empty for current tab." />
      <div className="group">
        <button onClick={() => sendMessage({ type: 'apply-scratchpad' })}>Apply style</button>
        <button>Clear style</button>
      </div>
    </div>
  );
};
