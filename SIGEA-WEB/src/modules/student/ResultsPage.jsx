import React from 'react';
import AnswerOpen from './components/AnswerOpen';
import AnswerMulti from './components/AnswerMulti';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const exam = location.state || [];

  return (
    <div className='overflow-y-auto' style={{height:'93vh'}}>
    <div className='w-full justify-center flex p-5 bg-white' >
      <div className='mx-auto my-6 sm:w-full md:w-full lg:w-full justify-center text-center px-6 py-4 rounded-md bg-gray-100'>
        <>
          <h5 className='font-bold mx-auto text-blue-900 text-3xl'>{exam[0]?.exam}</h5>
          <div style={{ marginTop: '10px' }}>
            {exam.map((question, index) => (
              <div key={index}>
                {question.respuestaEstudiante !== null && (
                  <>
                    {question.textoOpciones === null ? 
                      <AnswerOpen question={question} /> : 
                      <AnswerMulti question={question} />}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
    </div>
  );
}

export default ResultsPage;
