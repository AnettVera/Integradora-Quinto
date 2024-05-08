import React, { useState, memo, useEffect } from 'react'
import { Card, Select, FloatingLabel } from 'flowbite-react'
import AxiosClient from '../../config/http-client/axios-client'

const TextQuestion = ({idExam, idType, idQuestion, question, onCorrectAnswersMarked}) => {
  const [quest, setQuestion] = useState(question || '');
  const [score, setScore] = useState(0);


  const handleQuestionChange = (e) => {
    setQuestion(e.target.value)
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value)
  };

  const handleBlur = async () => {
    const payload = {
      question: quest,
      typeQuestion: {
        id_type_question: idType
      },
      exam: {
        id_exam: idExam // Agrega el id del examen aquí
      }
    };

    try {
      console.log(payload);
      const response = await AxiosClient({
        method: 'PUT',
        url: `question/saveQuestion/${idQuestion}`,
        data: payload,
      });
      if (response.data) {
        console.log('Pregunta guardada');
      }
      onCorrectAnswersMarked();

    } catch (error) {
      console.log(error);
    }

  }

  const handleBlurScore = async () => {
    try {
      const response = await AxiosClient({
        method: 'PATCH',
        url: `question/setScore/${idQuestion}`,
        data: { score: score }
      })
      if (response.data) {
        console.log('Puntuacion guardada')
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await AxiosClient({
        method: 'GET',
        url: `/question/${idQuestion}`
      });
      setScore(response.data.score);
    };
    fetchQuestion();
  }, [])

  useEffect(() => {
    if (question !== undefined || score !== undefined) {
      setScore(score);
      setQuestion(question);
    }
  }, [question]);

  return (

    <div
      className="w-full my-0"
    >
      <div className='sm:col-span-3 mb-0' >
        <div className='mt-0.5'>

          <input
            type='text'
            value={quest??''}
            onChange={handleQuestionChange}
            onBlur={handleBlur}
            placeholder='Pregunta...'
            className='bg-indigo-100 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          />
          <hr className="my-4 border-t bg-indigo-200" />
          <div className='w-full flex text-end justify-end'>


            <FloatingLabel
            value={score??''}
            variant="standard"
            label="Puntuacion"
            onBlur={handleBlurScore}
            onChange={handleScoreChange}
             />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TextQuestion)
