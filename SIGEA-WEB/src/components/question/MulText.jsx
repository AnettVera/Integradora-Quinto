import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Tooltip, FloatingLabel } from 'flowbite-react';
import { HiPlus, HiOutlineCheckCircle } from 'react-icons/hi2';
import AxiosClient from '../../config/http-client/axios-client';
import zIndex from '@mui/material/styles/zIndex';


const MulText = ({ idExam, idTypeQuestion, idQuestion, question, onCorrectAnswersMarked, questionType }) => {
    const [options, setOptions] = useState([]);
    const [option, setOption] = useState('');
    const [quest, setQuestion] = useState(question || '');
    const [score, setScore] = useState(0);


    const handleOptionChange = (id, value) => {
        setOptions(currentOptions =>
            currentOptions.map(option =>
                option.id_option === id ? { ...option, option: value } : option
            )
        );
    };


    const handleScoreChange = (e) => {
        setScore(e.target.value);
    };

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleBlur = async () => {
        const payload = {
            question: quest,
            typeQuestion: {
                id_type_question: idTypeQuestion
            },
            exam: {
                id_exam: idExam
            }
        };

        try {
            const response = await AxiosClient({
                method: 'PUT',
                url: `question/saveQuestion/${idQuestion}`,
                data: payload
            });
            if (response.data) {
                console.log('Pregunta guardada');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlurScore = async () => {
        try {
            const response = await AxiosClient({
                method: 'PATCH',
                url: `question/setScore/${idQuestion}`,
                data: { score: score }
            });
            if (response.data) {
                console.log('Puntuacion guardada');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOptions = async () => {
        try {
            const response = await AxiosClient({
                method: 'GET',
                url: `question/options/${idQuestion}`
            });
            if (!response.error) {
                console.log(response.data);
                setOptions(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addNewOption = async () => {
        // Objeto de opción inicial para enviar al backend
        const newOption = { option: '' };

        try {
            const response = await AxiosClient.post(`question/saveQuestionOption/${idQuestion}`, newOption);

            if (response.status === "OK") {

                // Suponiendo que la respuesta del servidor es el objeto con la opción guardada
                const savedOption = response.data.option; // Accede directamente al objeto de opción

                // Actualiza el estado con la opción recién guardada para que se muestre en la interfaz de usuario
                setOptions(prevOptions => {
                    const newOptions = [...prevOptions, savedOption];
                    console.log(newOptions); // Verifica que las nuevas opciones incluyan la recién añadida
                    return newOptions;
                });

            }
        } catch (error) {
            console.error('Error al guardar la opción', error);
        }
    };

    const handleOptionBlur = async (id) => {
        const optionToUpdate = options.find(opt => opt.id_option === id);
        if (optionToUpdate) {
            try {

                const idQuestionsAndOption = id + ',' + optionToUpdate.option;
                // Assume 'AxiosClient.put' for update operation, modify accordingly
                const response = await AxiosClient.put(`/question/updateQuestion/${idQuestionsAndOption}`);
                console.log('Option updated:', response.data); // Handle your response here
            } catch (error) {
                console.error('Error updating the option', error);
            }
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
        fetchOptions();
    }, [])





    return (
        <div>
            <div className="w-full my-0">
                <div className="sm:col-span-3 mb-0">
                    <div className="mt-0.5 ">
                        <input
                            type="text"
                            value={quest ?? ''}
                            onChange={handleQuestionChange}
                            onBlur={handleBlur}
                            placeholder="Pregunta..."
                            className="bg-indigo-100 block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="flex w-full justify-between">
                            <div style={{ width: '92%' }}>
                                <div className="space-y-2">
                                    {options.map((optionObj, index) => (
                                        <input
                                            key={optionObj.id_option}
                                            type="text"
                                            placeholder={`Opción ${index + 1}`}
                                            value={optionObj.option}
                                            onChange={e => handleOptionChange(optionObj.id_option, e.target.value)}
                                            onBlur={() => handleOptionBlur(optionObj.id_option)} // Attach onBlur event
                                            className="block w-full p-2 rounded bg-gray-100 text-gray-700 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className=' justify-center items-center flex'>
                                <Tooltip content="Agregar opcion">
                                    <Button
                                        style={{ backgroundColor: '#4480FF', borderRadius: '50%', width: '2rem', height: '2rem', border: 'none', cursor: 'pointer' }}
                                        onClick={addNewOption}
                                    >
                                        <HiPlus style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <hr className="my-0 border-t bg-indigo-200" />
                        <div className="w-full flex justify-between mt-2">
                            <Button
                                style={{ backgroundColor: '#fff', border: 'none', cursor: 'pointer', color: '#000' }}
                                onClick={onCorrectAnswersMarked} // Llamar a onCorrectAnswersMarked cuando se hace clic
                            >
                                <HiOutlineCheckCircle style={{ color: '#4480FF', fontSize: '1.5rem', marginRight: 5 }} />
                                Marcar respuestas correctas
                            </Button>
                            <FloatingLabel
                                value={score}
                                variant="standard"
                                label="Puntuacion"
                                onBlur={handleBlurScore}
                                onChange={handleScoreChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MulText;
