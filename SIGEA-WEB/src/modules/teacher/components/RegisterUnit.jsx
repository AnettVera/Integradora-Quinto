import React from 'react'
import { useFormik } from 'formik'
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import * as yup from 'yup';
import AxiosClient from '../../../config/http-client/axios-client';
import { confirmAlert, customAlert } from '../../../config/alerts/alert';

const RegisterUnit = ({ isCreatingUnit, setIsCreatingUnit, idSubject, getAllUnits }) => {
    const closeModal = () => {
        formik.resetForm();
        setIsCreatingUnit(false);
    }

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema: yup.object({
            name: yup.string().required('Campo requerido')
                .min(3, 'El nombre de la unidad debe tener al menos 3 caracteres')
                .max(50, 'El nombre de la unidad debe tener como máximo 100 caracteres'),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    ...values,
                    name: values.name.trim(),
                }

                // Muestra la alerta de confirmación y espera a que el usuario confirme
                const confirmed = await confirmAlert("¿Estás seguro de agregar esta unidad?");

                if (confirmed) {
                    // Si el usuario confirma, realiza la solicitud de agregar la unidad
                    const response = await AxiosClient({
                        method: 'POST',
                        url: `/unit/${idSubject}`,
                        data: payload
                    });

                    if (!response.error) {
                        // Si la solicitud fue exitosa, muestra una alerta de éxito
                        customAlert('Registro exitoso', 'Unidad registrada correctamente', 'success');
                        // Actualiza la lista de unidades
                        getAllUnits();
                        // Cierra el modal
                        closeModal();
                    }
                }
            } catch (error) {
                console.error(error);
                // Si ocurre un error, muestra una alerta de error
                customAlert('Error', 'Ha ocurrido un error, por favor intente de nuevo', 'error');
            } finally {
                // Establece isSubmitting a falso para indicar que el formulario ya no está siendo enviado
                setSubmitting(false);
            }
        }
    })

    return (
        <div>
            <Modal show={isCreatingUnit} size="md" onClose={closeModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-3">
                        <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Registro unidad</h3>

                        <form
                            noValidate
                            onSubmit={formik.handleSubmit}
                            id='unitForm'
                            name='unitForm'
                        >
                            <div>
                                <div className="mb-0.5 block">
                                    <Label htmlFor="name" value="Nombre" className='font-bold' />
                                </div>
                                <TextInput
                                    type="text"
                                    id="name"
                                    name='name'
                                    placeholder="Unidad"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    helperText={
                                        formik.touched.name &&
                                        formik.errors.name && (
                                            <span className="text-red-600">
                                                {formik.errors.name}
                                            </span>
                                        )
                                    }
                                />
                            </div>

                            <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300 mt-5">
                                <Button
                                    disabled={formik.isSubmitting || !formik.isValid}
                                    type='submit'
                                    form='unitForm'
                                    className='bg-blue-600 text-medium px-6 py-2 rounded-md text-white'
                                >
                                    Registrar
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default RegisterUnit
