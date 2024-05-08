import React, { useState, useEffect } from 'react';

import { Card } from 'flowbite-react';

const AnswerOpen = ({ question }) => {
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
  }, [])


  const backgroundColor = question.estadoRespuesta === 'Correcta' ? '#B5DFBC' : '#FFD7D7';

  return (
    <div style={{ marginTop: '15px', marginBottom: '10px' }}>
      <Card>
        <div className='font-medium  flex flex-row' style={{ textAlign: 'left', justifyContent: 'space-between' }}>
          <div style={{ width: '80%' }}>  {question.pregunta}</div>



        </div>
        <div
          className='block w-full my-2 rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 text-start'
          style={{ textAlign: 'left', backgroundColor }}
        >
          <p>{question.respuestaEstudiante}</p>
        </div>

        {question.retroalimentacion !== " " && (
          <>
            <div style={{ width: '100%', padding: '5px', textAlign: 'left', fontWeight: 600 }}>
              <p style={{ color: '#6B82B8' }}>Retroalimentacion:</p>
              <p>{question.retroalimentacion}</p>
            </div>
          </>
        )}
        {/*Este div no se debe ver si la retroalimentacion es null*/}

      </Card>
    </div>
  );
};

export default AnswerOpen;
