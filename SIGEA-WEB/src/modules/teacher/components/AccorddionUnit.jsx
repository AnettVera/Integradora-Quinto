import React, { memo, useEffect, useState } from 'react';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import { Button, Checkbox, Label, Modal, TextInput, Tooltip, Accordion } from 'flowbite-react';
import RegisterExam from './RegisterExam';
import ExamAcordion from './ExamAcordion';
import AxiosClient from '../../../config/http-client/axios-client';

const AccorddionUnit = ({ unit, user }) => {
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [exams, setExams] = useState([]);

  const openRegisterExam = () => {
    setIsCreatingExam(true);
  };

const getExams = async () => {
    try {
      const response = await AxiosClient({
        method: 'GET',
        url: `/exam/allExams/${unit.id_unit}`,
      });
      if (response.error) {
        console.log('Error al obtener los exámenes:', response.error);
        setExams([]); // Establecer exams a un array vacío en caso de error
      } else {
        setExams(response.data);
      }
    } catch (error) {
      console.log('No se pudo obtener los exámenes');
      setExams([]); // Establecer exams a un array vacío en caso de error
    }
  };

  useEffect(() => {
    getExams();
  }, [unit]);

  return (
    <>
      <div className="mt-10">
        <Accordion>
          <Accordion.Panel>
            <Accordion.Title className="text-blue-950 font-bold">{unit.name}</Accordion.Title>
            <Accordion.Content>
              <div className="relative">
                <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {exams?.length > 0 ? (
                    exams.map((exam, index) => (
                      <div key={index} className="col-span-1">
                        <ExamAcordion exam={exam} />
                      </div>
                    ))
                  ) : (
                    <div className="justify-center text-center col-span-full">
                      <Label className="text-xl text-blue-900 font-bold m-auto text-center">
                        Aún no hay exámenes registrados
                      </Label>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-2">
                  <Tooltip content="Agregar examen">
                    <Button
                      onClick={openRegisterExam}
                      className="rounded-full"
                      style={{
                        backgroundColor: '#4480FF',
                        border: 'none',
                        cursor: 'pointer',
                        height: '2.2rem',
                        width: '2.2rem',
                      }}
                    >
                      <HiPlus style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 'bold' }} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
      <RegisterExam
        isCreating={isCreatingExam}
        setIsCreating={setIsCreatingExam}
        idUnit={unit.id_unit}
        idUser={user.user.id_user}
        getAllExams={getExams}
      />
    </>
  );
};

export default AccorddionUnit;