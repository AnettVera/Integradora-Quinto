import React, { useEffect, useState } from 'react';
import { Card, Radio, Label } from 'flowbite-react';
import AxiosClient from '../../../config/http-client/axios-client';

const AnswerMulti = ({ question, updateScore }) => {
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


  const opcionesArray = question.textoOpciones.split(', ').map((opcion, index) => {
    return {
      id: index,
      texto: `${opcion}`,
      valor: opcion,
    };
  });

  const getBackgroundColor = (opcion) => {
    if (opcion.valor === question.respuestaEstudiante) {
      return question.estadoRespuesta === "Correcta" ? "#B5DFBC" : "#FFD7D7";
    }
    return "transparent";
  };

  const radioColor = question.estadoRespuesta === "Correcta" ? "#5B9264" : "#CF1C1C";





  return (
    <div style={{ marginTop: '15px', marginBottom: '10px' }}>
      <Card>
        <div className='font-medium  flex flex-row' style={{ textAlign: 'left', justifyContent: 'space-between' }}>
          <div style={{ width: '80%' }}>  {question.pregunta}</div>



        </div>
        <div className='w-full justify-between'>

          {opcionesArray.map((opcion) => (
            <div key={opcion.id} className={`flex items-center gap-2 my-4 rounded-md`}
              style={{ backgroundColor: getBackgroundColor(opcion) }}>
              <Radio
                name='pregunta'
                value={opcion.valor}

                disabled={true}
                style={{ color: opcion.valor === question.respuestaEstudiante ? radioColor : "#4480FF" }}
              />
              <Label className='font-normal'>{opcion.texto}</Label>
            </div>
          ))}
        </div>
        <div>

        </div>
      </Card>
    </div>
  );
};

export default AnswerMulti;
