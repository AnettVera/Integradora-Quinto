import React, { useContext } from 'react';
import { Button, Label, Modal, TextInput, } from 'flowbite-react';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup';
import { confirmAlert, customAlert } from '../../../config/alerts/alert';
import AxiosClient from '../../../config/http-client/axios-client';

const RegisterSubject = ({ isCreating, setIsCreating, userId}) => {

  const closeModal = () => {
    formik.resetForm();
    setIsCreating(false);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      degree: "",
      group: "",
    },

    validationSchema: yup.object({}).shape({
      name: yup.string()
        .required("Campo requerido")
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 50 caracteres"),
      degree: yup.number()
        .required("campo requerido")
        .typeError("Solo se permiten números")
        .min(1,"Solo números positivos"),
      group: yup.string()
        .required("Campo obligatorio")
        .min(1, "Minimo 1 caracter")
        .max(3, "Maximo 3 caracteres")
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          name: values.name.trim(),
          group: {
            group: values.group.trim().toUpperCase(),
            degree: {
              degree: values.degree
            }
          }
        };
    
        const confirmed = await confirmAlert("¿Estás seguro de agregar esta materia?");
    
        if (confirmed) {
          const response = await AxiosClient({
            method: 'POST',
            url: `/subject/${userId}`,
            data: payload
          });
    
          if (!response.error) {
            customAlert('Registro exitoso', 'Materia registrada', 'success');
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
      <Modal show={isCreating} size="md" onClose={closeModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Registro de materias</h3>

            <form
              noValidate
              onSubmit={formik.handleSubmit}
              id='subjectForm'
              name='subjectForm'
            >
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="name" value="Nombre de la materia" />
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
              </div>

              <div className='flex flex-row justify-between'>
                <div style={{ width: '45%' }}>
                  <div className="mb-0.5 block">
                    <Label htmlFor="degree" value="Grado" />
                  </div>
                  <TextInput
                    type='number'
                    id="degree"
                    name='degree'
                    value={formik.values.degree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.degree &&
                      formik.errors.degree && (
                        <span className="text-red-600">
                          {formik.errors.degree}
                        </span>
                      )
                    }

                  />
                </div>

                <div style={{ width: '45%' }}>
                  <div className="mb-0.5 block mx-2">
                    <Label htmlFor="group" value="Grupo" />
                  </div>
                  <TextInput
                    type='text'
                    id="group"
                    name='group'
                    value={formik.values.group}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={
                      formik.touched.group &&
                      formik.errors.group && (
                        <span className="text-red-600">
                          {formik.errors.group}
                        </span>
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300 mt-5">
                <Button
                  disabled={formik.isSubmitting || !formik.isValid}
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

export default RegisterSubject
