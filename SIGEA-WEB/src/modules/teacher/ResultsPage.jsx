import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AxiosClient from '../../config/http-client/axios-client';
import AnswerMulti from '../student/components/AnswerMulti';
import AnswerOpen from './components/AnswerOpen';
import { Button } from 'flowbite-react';
import Swal from 'sweetalert2';


const ResultsPage = () => {
  const { examId } = useParams();
  const [usersWithAnswers, setUsersWithAnswers] = useState([]);
  const [exam, setExam] = useState([]);
  const [user, setUser] = useState(0);
  const [scores, setScores] = useState({});


  const updateScore = (preguntaId, score) => {
    console.log('Pregunta:', preguntaId, 'Score:', score);
    setScores(currentScores => ({ ...currentScores, [preguntaId]: score }));
  };


  const handleUserClick = async (clickedUser) => {
    setUser(clickedUser.id_user); // Actualiza el usuario seleccionado
    setExam([]); // Limpia los detalles del examen
  
    try {
      const response = await AxiosClient.get(`/exam/ExamDetailsResponseStudent/${examId},${clickedUser.id_user}`);
      if (!response.error) {
        console.log('Detalles del examen:', response.data);
        setExam(response.data); // Establece los detalles del examen del usuario seleccionado
      } else {
        console.error('Error al obtener detalles del examen:', response.error);
      }
    } catch (error) {
      console.error('Error al obtener detalles del examen:', error);
    }
  
    // Actualiza el color del texto del usuario anteriormente seleccionado a negro
    const updatedUsers = usersWithAnswers.map(user => ({
      ...user,
      textColor: user.id_user === clickedUser.id_user ? 'blue-600' : 'black'
    }));
    setUsersWithAnswers(updatedUsers);
  };
  


  const handleGradeStudent = async () => {
    try {
      // Solicita los detalles actualizados del examen.
      const response = await AxiosClient.get(`/exam/ExamDetailsResponseStudent/${examId},${user}`);
      if (!response.error) {
        const updatedExam = response.data;
        // Actualiza el estado `exam` con los datos más recientes.
        setExam(updatedExam);

        // Debugging: Verificar los scores registrados
        console.log('Scores actuales:', scores);

        const totalPossibleScore = updatedExam.reduce((acc, question) => acc + (scores[question.preguntaId] || 0), 0);
        const totalCorrectScore = updatedExam.reduce((acc, question) => {
          return question.estadoRespuesta === "Correcta" ? acc + (scores[question.preguntaId] || 0) : acc;
        }, 0);

        const percentageObtained = ((totalCorrectScore / totalPossibleScore) * 100).toFixed(1);
        console.log('Porcentaje total obtenido:', percentageObtained);

        Swal.fire({
          title: 'Resultado del examen',
          text: `El porcentaje total obtenido en el examen es: ${percentageObtained}%`,
          icon: 'info',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            const enviarResponseAverage = async () => {
              try {
                const response = await AxiosClient.post(`/exam/student-average?average=${percentageObtained}&examId=${examId}&userId=${user}`);
                if (!response.error) {
                  Swal.fire('¡Calificación enviada!', 'El promedio del estudiante ha sido actualizado correctamente.', 'success');
                  await AxiosClient({
                    method: 'POST',
                    url: `/token/send-notification/${user}`,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                } else {
                  console.error('Error al insertar el promedio del estudiante:', response.error);
                }
              } catch (error) {
                console.error('Error al insertar el promedio del estudiante:', error);
              }
            };
            enviarResponseAverage();
          } else if (result.isDismissed) {
            console.log("El usuario canceló la operación");
          }
        });
      } else {
        console.error('Error al obtener detalles del examen:', response.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsersWithAnswers = async () => {
    try {
      const response = await AxiosClient.get(`/user/answers/exam/${examId}`);
      if (!response.error) {
        setUsersWithAnswers(response.data);

      }
    } catch (error) {
      console.error('Error al obtener los exámenes respondidos:', error);
    }
  };

  useEffect(() => {
    fetchUsersWithAnswers();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="bg-gray-100 shadow-lg p-4 md:w-1/4 overflow-y-auto">
          {usersWithAnswers.map((user, index) => (
            <div
              onClick={() => handleUserClick(user)}
              key={index}
              className={`w-full md:w-auto bg-white hover:bg-gray-200 rounded-md p-2 mb-2 cursor-pointer text-${user.textColor}`}
            >
              {`${user.person.name} ${user.person.secondName ?? ''} ${user.person.lastname} ${user.person.surname ?? ''}`}
            </div>
          ))}

        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="w-full justify-center flex p-5 bg-white">
            <div className="mx-auto my-6 sm:w-full md:w-full lg:w-full justify-center text-center px-6 py-4 rounded-md bg-gray-100">
              <h5 className="font-bold mx-auto text-blue-900 text-3xl">{exam[0]?.exam}</h5>


              <div style={{ marginTop: '10px' }}>


                {exam.map((question, index) => (
                  <div key={index}>
                    {question.respuestaEstudiante !== null && (
                      <>
                        {question.textoOpciones === null ? (
                          <AnswerOpen
                            question={question}
                            userid={user}
                            feedbackr={question.retroalimentacion}
                            correctIncorrect={question.estadoRespuesta}
                            updateScore={updateScore}
                          />
                        ) : (
                          <AnswerMulti question={question} updateScore={updateScore} />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4">
                {user !== 0 && (
                  <Button style={{ backgroundColor: '#3666c9' }} onClick={handleGradeStudent}>Enviar Calificación</Button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ResultsPage;
