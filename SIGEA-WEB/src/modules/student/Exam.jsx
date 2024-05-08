import React, { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiAnswer from './components/MultiAnswer';
import OpenAnswer from './components/OpenAnswer';
import { confirmAlert, customAlert, pconfirmAlert } from '../../config/alerts/alert';
import AxiosClient from '../../config/http-client/axios-client';
import * as Yup from 'yup'; // Importa Yup

const Exam = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const exam = location.state || [];

  const [openAnswers, setOpenAnswers] = useState({});
  const [multiAnswers, setMultiAnswers] = useState({});
  const [responsesSent, setResponsesSent] = useState(0);
  const [newExam, setNewExam] = useState({});
  const totalResponses = Object.keys(openAnswers).length + Object.keys(multiAnswers).length;

  const handleMultiAnswerChange = (questionId, optionId) => {
    setMultiAnswers(prevState => ({
      ...prevState,
      [questionId]: optionId,
    }));
  };
  const handleOpenAnswerChange = (questionId, answer) => {
    setOpenAnswers(prevState => ({
      ...prevState,
      [questionId]: answer,
    }));
  };


  const validationSchema = Yup.object().shape({
    openAnswers: Yup.object().test('notEmpty', 'Todas las respuestas abiertas son requeridas', obj => {
      return Object.keys(obj).length === exam.filter(question => question.questionType === 'OPEN_ANSWER').length; // Verifica que se haya respondido a todas las preguntas abiertas
    }),
    multiAnswers: Yup.object().test('notEmpty', 'Todas las respuestas múltiples son requeridas', obj => {
      return Object.keys(obj).length === exam.filter(question => question.questionType === 'MULTIPLE_ANSWER').length; // Verifica que se haya respondido a todas las preguntas de opción múltiple
    }),
  });

  const handleFinishExam = async () => {
    if (!newExam.status){
      customAlert('No disponible', 'Se te ha pasado el tiempo, comunicate con el docente', 'error');
      navigate('/', { replace: true });
    } else {
      try {
        const allQuestionsAnswered = await validationSchema.isValid({ openAnswers, multiAnswers });
        if (!allQuestionsAnswered) {
          customAlert('Error', 'Debes responder todas las preguntas antes de finalizar el examen', 'error');
          return;
        }
        
        const confirmed = await confirmAlert('¿Estás seguro de finalizar el examen?');
        if (confirmed) {
          for (const [questionId, optionId] of Object.entries(multiAnswers)) {
            await sendMultiAnswer(questionId, optionId);
          }
          for (const [questionId, answer] of Object.entries(openAnswers)) {
            await sendOpenAnswer(questionId, answer);
          }
          customAlert('', 'Se guardaron todas las respuestas correctamente', 'success');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error en handleFinishExam:', error);
      }
    }
  };
  

  const sendMultiAnswer = async (questionId, optionId) => {
    try {
      await AxiosClient.post(`/exam/insertMultiAnswer/${user.user.id_user},${optionId}`);
      setResponsesSent(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const sendOpenAnswer = async (questionId, answer) => {
    try {
      await AxiosClient.post('/exam/openAnswer', {
        question: { id_question: questionId },
        user: { id_user: user.user.id_user },
        answer
      });
      setResponsesSent(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const getExamById = async () => {
    try {
      const response = await AxiosClient({
        method: 'GET',
        url: `/exam/oneExam/${exam[0].idExam}`,
      });
      if (!response.error) {
        
        setNewExam(response.data);
      }
    } catch (error) {
      console.error('Error al obtener el examen:', error);
    }
  };

  useEffect(() => {
    // Llama a getExamById inmediatamente cuando el componente se monta
    getExamById();

    // Luego inicia el intervalo
    const intervalId = setInterval(() => {
      getExamById();
    }, 30000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='w-full justify-center flex p-5 bg-white'>
      <div className='overflow-y-auto m-auto sm:w-full md:w-full lg:w-full justify-center text-center px-6 py-4 rounded-md bg-gray-100' style={{ maxHeight: '90vh', overflowX: 'hidden' }}>
        <h5 className='font-bold mx-auto text-blue-900 text-3xl'>{exam[0].examName}</h5>
  
        {exam.map(question => {
          if (question.questionType === 'OPEN_ANSWER') {
            return (
              <OpenAnswer
                key={question.idQuestion}
                question={question}
                onChange={(answer) => handleOpenAnswerChange(question.idQuestion, answer)}
              />
            );
          } else if (question.questionType === 'MULTIPLE_ANSWER') {
            return (
              <MultiAnswer
                key={question.idQuestion}
                question={question}
                onChange={(optionId) => handleMultiAnswerChange(question.idQuestion, optionId)}
              />
            );
          }
          return null;
        })}
        <div className="flex justify-center">
          <Button type="button" onClick={handleFinishExam} style={{ background: '#4480FF', width: '70%' }}>Finalizar examen</Button>
        </div>
      </div>
    </div>
  );
  
  
};

export default Exam;
