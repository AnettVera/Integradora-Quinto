import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Label, FloatingLabel } from 'flowbite-react';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import AxiosClient from '../../config/http-client/axios-client'; // Asegúrate de importar AxiosClient

const MulRadio = ({ idQuestion, onDone }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [question, setQuestion] = useState('');



    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };


    const handleDoneClick = async () => {

        if (selectedOption !== null) {

            try {
                // Asegúrate de que el valor enviado corresponda al id de la opción seleccionada
                const response = await AxiosClient.patch(`/question/correctOption/${selectedOption}`);
                console.log('Respuesta correcta guardada:', response.data);
            } catch (error) {
                console.error('Error al guardar la respuesta correcta', error);
            }
        }
        onDone('MULTI_TEXT');
    };

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await AxiosClient.get(`/question/${idQuestion}`);
                // Actualizar el estado con las opciones correctas de la pregunta
                setOptions(response.data.questionOptions);
                setQuestion(response.data.question);
            } catch (error) {
                console.error('Error al obtener las opciones de la pregunta', error);
            }
        };
        fetchQuestion();
    }, [idQuestion]);

    return (
        <div>
            <div
                className="w-full my-0"
            >
                <div className='sm:col-span-3 mb-0.5' >
                    <div className='mt-0'>
                        <input
                            type='text'
                            placeholder='Pregunta...'
                            value={question}
                            readOnly
                            className='bg-indigo-100 block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />

                        <div className=' w-full justify-between'>
                            {options.map((option) => (

                                <div className="flex items-center gap-2 my-4" key={option.id_question_option}>
                                    <Radio
                                        id={`option-${option.option.id_option}`}
                                        name="options"
                                        value={option.option.id_option}
                                        checked={selectedOption === option.option.id_option.toString()}
                                        onChange={handleRadioChange}
                                        style={{ color: '#4480FF' }}
                                    />
                                    <Label htmlFor={`option-${option.option.id_option}`} className='font-normal'>
                                    <div className='flex items-center'>
                                        {option.option.option}
                                        {option.correct && <HiOutlineCheckCircle className='text-green-500 ' />}
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <hr className="my-0.5 border-t bg-indigo-200" />
                        <div className='w-full flex justify-end'>
                            <div className=" mx-1 text-end justify-end" style={{ width: '10%' }}>
                                <Button
                                    onClick={handleDoneClick}
                                    style={{ backgroundColor: '#fff', border: '1px solid#000', cursor: 'pointer', color: '#000' }}
                                >
                                    Hecho
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MulRadio;
