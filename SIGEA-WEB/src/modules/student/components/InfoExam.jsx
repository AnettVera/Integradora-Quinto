import React from 'react';
import { Card } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosClient from '../../../config/http-client/axios-client';
import { customAlert } from '../../../config/alerts/alert'; // Importar función para alertas

const InfoExam = ({ exam, user }) => {
  const navigate = useNavigate();

  console.log("*********************************");
  console.log(exam);
  console.log("*********************************");

  const send = async () => {
    try {
      console.log('Enviando solicitud al backend para obtener detalles del examen...');
      console.log('URL:', `/exam/ExamDetailsResponseStudent/${user},${exam.idExam}`);
      console.log(exam)
      const response = await AxiosClient({
        method: 'GET',
        url: `/exam/ExamDetailsResponseStudent/${exam.idExam},${user}`,
      });

      console.log('Respuesta del backend:', response);

      if (!response.error) {
        console.log('Detalles del examen:', response.data);
        navigate('/results', { state: response.data })
      } else {
        console.error('Error al obtener detalles del examen:', response.error);
      }
    } catch (error) {
      console.error('Error al obtener detalles del examen:', error);
    }
  };

  const handleClick = () => {
    if (exam.average === "null") {
      customAlert('Tu examen aún no ha sido calificado.', 'Aún no puedes ver tus resultados.', 'warning');
    } else {
      send();
    }
  };

  return (
    <>
      <div className="my-5 w-full">
        <Card className='w-full flex justify-between border-blue-600 cursor-pointer my-7' onClick={handleClick}>
          <div className='w-full font-medium flex justify-between' style={{ textAlign: 'left' }}>
            <div><p>{exam.examName}</p></div>
            <div><p>{exam.unitName}</p></div>
          </div>
          <div className='font-medium flex justify-between mt-4' style={{ textAlign: 'left' }}>
            <p>Asignatura: {exam.subjectName}</p>
            <p>Calificación: {exam.average !== "null" ? exam.average : 'SC'}</p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default InfoExam;
