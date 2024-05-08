import React from 'react';
import { Button, Label, Modal, TextInput, } from 'flowbite-react';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../config/http-client/axios-client';
import { confirmAlert, customAlert } from '../../../config/alerts/alert';

const RegisterExam = ({ isCreating, setIsCreating, idUnit, idUser, getAllExams }) => {

  const closeModal = () => {
    formik.resetForm();
    setIsCreating(false);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      quantity: 0,
    },

    validationSchema: yup.object({}).shape({
      name: yup.string().required('Campo requerido')
        .min(3, 'Mínimo 3 caracteres')
        .max(50, 'Máximo 100 caracteres'),
      quantity: yup.number().required('Campo requerido')
        .min(5, 'Mínimo 5 preguntas')
        .max(60, 'Máximo 60 preguntas'),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          name: values.name.trim(),
          quantity: values.quantity,
          unit: {
            id_unit: idUnit
          },
          user: {
            id_user: idUser
          }
        };
    
        const confirmed = await confirmAlert("¿Estás seguro de agregar este examen?");
    
        if (confirmed) {
          const response = await AxiosClient({
            method: 'POST',
            url: '/exam/',
            data: payload
          });
    
          if (!response.error) {
            customAlert('Registro exitoso', 'Examen registrado correctamente', 'success');
            getAllExams();
            closeModal();
          }
        }
      } catch (error) {
        console.error(error);
        customAlert('Error', 'Ha ocurrido un error, por favor inténtelo de nuevo', 'error');
      } finally {
        setSubmitting(false);
      }
    }
    
  });

  return (
    <div>
      <Modal show={isCreating} size="md" onClose={closeModal} popup><Modal.Header />
        <Modal.Body>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Registro de examen</h3>

            <form
              noValidate
              onSubmit={formik.handleSubmit}
              id='examForm'
              name='examForm'
            >
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="name" value="Nombre del examen" />
                </div>
                <TextInput
                  type='text'
                  id="name"
                  name='name'
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

                <div className='flex flex-row items-center justify-center align-middle mt-5'>
                  <div className="mt-0.5 block mx-1">
                    <Label htmlFor="quantity" value="Cantidad de preguntas:" />
                  </div>
                  <div>
                    <TextInput
                      type='number'
                      id="quantity"
                      name='quantity'
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.quantity &&
                        formik.errors.quantity && (
                          <span className="text-red-600">
                            {formik.errors.quantity}
                          </span>
                        )
                      }

                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300 mt-5">
                <Button
                  disabled={formik.isSubmitting || !formik.isValid}
                  form='examForm'
                  type='submit'
                  className='bg-blue-600 text-medium px-6 py-2 rounded-md text-white'>
                  Agregar
                </Button>
              </div>

            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default RegisterExam
