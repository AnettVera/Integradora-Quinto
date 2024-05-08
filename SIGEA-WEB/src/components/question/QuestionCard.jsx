import React, { useState, useEffect } from 'react';
import { Card, Select } from 'flowbite-react';
import MulText from './MulText';
import MulRadio from './MulRadio';
import TextQuestion from './TextQuestion';
import AxiosClient from '../../config/http-client/axios-client';

const QuestionCard = ({ idQuestion, exam }) => {
  const [selectedQuestionType, setSelectedQuestionType] = useState(exam.questionType);
  const [question, setQuestion] = useState(exam.question);
  const [showTextQuestion, setShowTextQuestion] = useState(selectedQuestionType === 'OPEN_ANSWER' || selectedQuestionType === 'MULTIPLE_ANSWER');


  const handleQuestionTypeChange = async (event) => {
    setSelectedQuestionType(event.target.value);
    setShowTextQuestion(
      event.target.value === 'OPEN_ANSWER' ||
      event.target.value === 'MULTIPLE_ANSWER'
      );

    if (event.target.value === 'MULTIPLE_ANSWER') {

      console.log('Estás cambiando a MULTIPLE_ANSWER');



    } else {
      console.log('Estás cambiando a OPEN_ANSWER');
      setQuestion('');
    }
  };


  const handleCorrectAnswersMarked = () => {
    setShowTextQuestion(false);
  };

  const handleDone = () => {
    setShowTextQuestion(true);
  };

  useEffect(() => {
    console.log('Tipo de pregunta cambiada a:', selectedQuestionType);
    // ... Aquí iría la lógica si necesitas hacer algo cada vez que cambia el tipo de pregunta
  }, [selectedQuestionType]);


  return (
    <Card className="w-full my-7 p-0">
      {selectedQuestionType === 'OPEN_ANSWER' ? (
        <TextQuestion
          idExam={exam.idExam}
          idType={1}
          idQuestion={idQuestion}
          question={question}
        />
      ) : (
        showTextQuestion ? (
          <MulText
            idExam={exam.idExam}
            idTypeQuestion={2}
            idQuestion={idQuestion}
            question={question}
            options={exam.options}
            questionType={selectedQuestionType}
            onCorrectAnswersMarked={handleCorrectAnswersMarked}
          />
        ) : (
          <MulRadio
            idExam={exam.idExam}
            idTypeQuestion={2}
            idQuestion={idQuestion}
            question={question}
            options={exam.options}
            onDone={handleDone}
          />
        )
      )}
      <div className="p-1">
        <Select
          id="questionType"
          value={selectedQuestionType}
          onChange={handleQuestionTypeChange}
          className="mt-1"
        >
          <option value="OPEN_ANSWER">Respuesta abierta</option>
          <option value="MULTIPLE_ANSWER">Respuesta múltiple</option>
          {/* Añade más opciones aquí según sea necesario */}
        </Select>
      </div>
    </Card>
  );
};

export default QuestionCard;
