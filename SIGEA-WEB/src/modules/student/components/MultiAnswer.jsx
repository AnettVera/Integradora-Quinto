import React from 'react';
import { Card, Radio, Label } from 'flowbite-react';

const MultiAnswer = ({ question, onChange }) => {
  const handleOptionChange = (optionId) => {
    onChange(optionId);
  };

  let optionsArray = [];
  try {
    const formattedOptionsString = question.options
      .split(', ')
      .map(option => {
        const [key, value] = option.split(': ');
        return `"${key.trim()}": "${value.trim()}"`;
      })
      .join(', ');

    const optionsObject = JSON.parse(`{${formattedOptionsString}}`);
    optionsArray = Object.entries(optionsObject).map(([key, value]) => ({
      id_question_option: key,
      option: { option: value }
    }));
  } catch (e) {
    console.error("Error parsing question options:", e);
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <Card>
        <div className='font-medium' style={{ textAlign: 'left', padding: '10px 0', maxWidth: '100%', wordWrap: 'break-word' }}>
          {question.question}
        </div>
        <div className='w-full justify-between'>
          {optionsArray.map((option, index) => (
            <div key={index} className="flex items-center gap-2 my-4">
              <Radio
                name={question.idQuestion.toString()}
                value={option.id_question_option}
                onChange={() => handleOptionChange(option.id_question_option)}
                style={{ color: '#4480FF' }}
              />
              <Label htmlFor={option.id_question_option} className='font-normal'>{option.option.option}</Label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MultiAnswer;
