import React, { useEffect, useState } from 'react';
import { Card } from 'flowbite-react';
import AxiosClient from '../../../config/http-client/axios-client';

const AnswerOpen = ({ question, userid, feedbackr, correctIncorrect, updateScore }) => {
  const [isCorrectChecked, setIsCorrectChecked] = useState(false);
  const [isIncorrectChecked, setIsIncorrectChecked] = useState(false);
  const [feedback, setFeedback] = useState(feedbackr);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const obtenrScoreQuestions = async () => {
      try {
        const response = await AxiosClient.get(`/question/${question.preguntaId}`);
        if (!response.error) {
          setScore(response.data.score);
          updateScore(question.preguntaId, response.data.score);
        }
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }

    }
    obtenrScoreQuestions();

    if (correctIncorrect === 'Correcta') {
      setIsCorrectChecked(true);
    } else if (correctIncorrect === 'Incorrecta') {
      setIsIncorrectChecked(true);
    }
  }, []);

  const handleCorrectChange = () => {
    setIsCorrectChecked(!isCorrectChecked);
    setIsIncorrectChecked(false);
    const idUserAndQuestion = `${userid},${question.preguntaId}`;

    AxiosClient.patch(`/exam/openAnswer/${idUserAndQuestion}?correct=true&feedback=${feedback}`)
      .then(response => {
        console.log('Solicitud exitosa');
      })
      .catch(error => {
        console.error('Ocurrió un error:', error);
      });
  };



  const handleIncorrectChange = () => {
    setIsIncorrectChecked(!isIncorrectChecked);
    setIsCorrectChecked(false);
    const idUserAndQuestion = `${userid},${question.preguntaId}`; console.log(idUserAndQuestion);
    AxiosClient.patch(`/exam/openAnswer/${idUserAndQuestion}?correct=false&feedback=${feedback}`)
      .then(response => {
        console.log('Solicitud exitosa');
      })
      .catch(error => {
        console.error('Ocurrió un error:', error);
      });
  };

  return (
    <div style={{ marginTop: '15px', marginBottom: '10px' }}>
      <Card>
        <div className='flex flex-row justify-between'>
          <div style={{ textAlign: 'left', width: '80%' }}>
            {question.pregunta}
          </div>
          <div className='flex flex-row'>
            <div className="flex items-center me-4">
              <input
                id={`red-checkbox-${question.id}`}
                type="checkbox"
                checked={isIncorrectChecked}
                onChange={handleIncorrectChange}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={`red-checkbox-${question.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Incorrecta</label>
            </div>
            <div className="flex items-center me-4">
              <input
                id={`green-checkbox-${question.id}`}
                type="checkbox"
                checked={isCorrectChecked}
                onChange={handleCorrectChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor={`green-checkbox-${question.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Correcta</label>
            </div>
          </div>
        </div>

        <div
          className='w-full my-2 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 text-start'
          style={{ textAlign: 'left', backgroundColor: '#fff' }}
        >
          <p className='font-medium'>{question.respuestaEstudiante}</p>

          <div className='w-full my-3 justify-between'>
            <input
              type='text'
              placeholder='Retroalimentación (Opcional)'
              className='bg-indigo-100 block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              value={feedback ? feedback.toString() : ""}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>
        <div className='w-full justify-between'>
        </div>
      </Card>
    </div>
  );
};

export default AnswerOpen;
