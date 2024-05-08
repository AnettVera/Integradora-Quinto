import React, { memo, useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import AxiosClient from '../../../config/http-client/axios-client';
import { customAlert, confirmAlert } from '../../../config/alerts/alert';
import ActiveExam from './ActiveExam';

const ExamAccordion = ({ exam }) => {
    const [switchState, setSwitchState] = useState(exam.status);
    const [showActiveExamModal, setShowActiveExamModal] = useState(false);
    const [hasAnswers, setHasAnswers] = useState(false);
    const validateExam = (exam) => {
        for (let question of exam.questions) {
            if (!question.question) {
                return "Completa todas las preguntas antes de activar el examen.";
            }

            if (question.score === null) {
                return "Asigne puntaje a todas las preguntas antes de activar el examen.";
            }

            if (question.typeQuestion.type === "MULTIPLE_ANSWER") {
                if (question.questionOptions.length < 2) {
                    return "Las preguntas de opción múltiple deben tener al menos dos opciones.";
                }

                for (let option of question.questionOptions) {
                    if (!option.option) {
                        return "Complete todas las opciones de las preguntas de opción múltiple.";
                    }
                }
            }
        }
        return null;
    }

    useEffect(() => {
        setSwitchState(exam.status);
    }, [exam.status]);


    useEffect(() => {
        const checkAnswers = async () => {
            try {
                const response = await AxiosClient.get(`/user/answers/exam/${exam.id_exam}`);
                if (!response.error && response.data.length > 0) {
                    setHasAnswers(true);
                }
            } catch (error) {
                console.error('Error al verificar las respuestas del examen:', error);
            }
        };

        checkAnswers();
    }, [exam.id_exam]);

    const handleSwitchChange = async () => {
        try {
            const validationMessage = validateExam(exam);
            if (validationMessage) {
                customAlert(validationMessage);
                return;
            }

            const confirmed = await confirmAlert("¿Está seguro de activar este examen?");
            if (!confirmed) return;

            const newSwitchState = !switchState;
            setSwitchState(newSwitchState);
            await changeStatus(exam.id_exam, newSwitchState);
            if (newSwitchState) {
                setShowActiveExamModal(true);
            }
        } catch (error) {
            console.error('Error al cambiar el estado del examen:', error);
        }
    };



    const changeStatus = async (id, status) => {
        try {
            const response = await AxiosClient({
                method: 'PATCH',
                url: `/exam/${id}`,
                data: {
                    status: status
                }
            });
            if (!response.error) {
                customAlert(
                    'Actualización exitosa',
                    'Examen actualizado',
                    'success'
                );
            }
        } catch (error) {
            customAlert(
                'Error',
                'Ha ocurrido un error, por favor intente de nuevo',
                'error'
            );
        }
    };

    const cardImage = switchState
        ? 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQeFMMlxTaWx1WFl6Fb6PcLDaI7UxoZQPfT9Sj3Ti-VVkUppVPl'
        : 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT4JyBPKMBZh4_T_8Bv1r6VqEDMCZVUFRfe0cpRPA830alFQD9q';

    return (
        <div className=''>
            <Card className="w-60 justify-center text-center h-80">
                <div className='mx-auto justify-center text-center'>
                    <Switch onChange={handleSwitchChange} checked={switchState} />
                </div>
                <Link to={hasAnswers ? `/results/${exam.id_exam}` : `/exam/${exam.id_exam}`} >
                    <div className='mx-auto justify-center text-center'>
                        <img src={cardImage} alt="Estudiantes" className='w-52 h-52 p-0 m-0' />
                    </div>
                    <h6 className="text-lg font-bold tracking-tight text-blue-950 dark:text-white">
                        {exam.code}
                    </h6>
                    <p className="font-normal text-gray-700 dark:text-gray-600">
                        {exam.name}
                    </p>
                </Link>
            </Card>
            {
                showActiveExamModal && (
                    <ActiveExam
                        isCreating={showActiveExamModal}
                        setIsCreating={setShowActiveExamModal}
                        exam={exam}
                    />
                )
            }
        </div >
    );
}

export default ExamAccordion;
