import React, { useState } from 'react';
import { Card } from 'flowbite-react';

const OpenAnswer = ({ question, onChange }) => {
  const [answer, setAnswer] = useState('');

  const handleInputChange = (event) => {
    const { value } = event.target;
    setAnswer(value);
    onChange(value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Card>
        <div className='font-medium' style={{ textAlign: 'left', padding: '10px 0', maxWidth: '100%', wordWrap: 'break-word' }}>
          {question.question}
        </div>
        <div className='w-full justify-between'>
          <input
            type='text'
            placeholder='Escribe tu respuesta...'
            value={answer}
            onChange={handleInputChange}
            className='bg-indigo-100 block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
        </div>
      </Card>
    </div>
  );
};

export default OpenAnswer;
