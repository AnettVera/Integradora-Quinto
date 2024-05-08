import React, { useEffect } from 'react';
import { Button, Label, Modal, TextInput, } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { confirmAlert, customAlert , pconfirmAlert} from '../../../config/alerts/alert';
import AxiosClient from '../../../config/http-client/axios-client';


const UpdateD = ({ isUpdate, setUpdate, getAllTeachers, id }) => {
  const token = localStorage.getItem('token');

  const closeModal = () => {
    setUpdate(false);
  }

  const formik = useFormik({
    initialValues: {
      nameU: "",
      lastnameU: "",
      surnameU: "",
      curpU: "",
      emailU: "",
      usernameU: "",
      passwordU: "",
      confirmPasswordU: "",
    },

    validationSchema: yup.object({}).shape({
      nameU: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      lastnameU: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      surnameU: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      curpU: yup.string()
        .min(18, "Minimo 18 caracteres")
        .max(18, "Maximo 18 caracteres"),
      emailU: yup.string()
        .email("Correo invalido"),
      usernameU: yup.string()
        .min(8, "Minimo 8 caracteres")
        .max(45, "Maximo 45 caracteres"),
      passwordU: yup
        .string()
        .min(8, "Minimum 8 caracteres")
        .max(45, "Maximum 45 caracteres"),
      // .matches() valida formatos
      confirmPasswordU: yup
        .string()
        
    }),

    onSubmit: async (values, { setSubmitting }) => {
      pconfirmAlert(async () => {
        try {
          const payload = {
            ...values,
            id: id,
            name: values.nameU.trim(),
            secondName: values.secondNameU?.trim(),
            lastname: values.lastnameU.trim(),
            surname: values.surnameU.trim(),
            curp: values.curpU.trim(),
            email: values.emailU.trim(),
            user: {
              username: values.usernameU.trim(),
              password: values.passwordU.trim(),
            }
          };
          const response = await AxiosClient({
            method: 'PUT',
            url: `person/teacher/2`,
            data: payload,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.error) {
            customAlert(
              'Actualizacion exitosa',
              'El docente ha sido actualizado correctamente',
              'success'
            )
            getAllTeachers();
            closeModal();
          };

        } catch (error) {
          console.log(error);
          customAlert(
            'Error',
            'Ha ocurrido un error, por favor intente de nuevo',
            'error'
          )
        } finally {
          setSubmitting(false);
        }
      });
    }
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await AxiosClient({
          method: 'GET',
          url: `/user/${id}`,
        
        });

        if (response.data) {
          console.log(id);
          formik.setFieldValue('nameU', response.data.person.name)
          formik.setFieldValue('lastnameU', response.data.person.lastname)
          formik.setFieldValue('surnameU', response.data.person.surname ?? '')
          formik.setFieldValue('curpU', response.data.person.curp)
          formik.setFieldValue('emailU', response.data.person.email)
          formik.setFieldValue('usernameU', response.data.username)
        }

      } catch (error) {
        console.error("Error al obtener los datos del formulario")
      }
    };
    if (id) {
      fetchTeacherData();
    }
  }, [id])

  return (
    <div>
      <Modal show={isUpdate} size="md" onClose={closeModal} popup>
        <Modal.Header />
        <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Actualizar docente</h3>

        <Modal.Body>
          <div className="space-y-3">

            <form
              noValidate
              onSubmit={formik.handleSubmit}
              id='teacherForm'
              name='teacherForm'
            >

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="nameU" value="Nombre" className='font-bold' />
                </div>
                <TextInput
                  type='text'
                  id='nameU'
                  name='nameU'
                  value={formik.values.nameU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.nameU &&
                    formik.errors.nameU && (
                      <span className="text-red-600">
                        {formik.errors.nameU}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="secondNameU" value="Segundo Nombre" className='font-bold' />
                </div>
                <TextInput
                  type='text'
                  id='secondNameU'
                  name='secondNameU'
                  value={formik.values.secondNameU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.secondNameU &&
                    formik.errors.secondNameU && (
                      <span className="text-red-600">
                        {formik.errors.secondNameU}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="lastnameU" value="Apellido paterno" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="lastnameU"
                  name="lastnameU"
                  value={formik.values.lastnameU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="surnameU" value="Apellido materno" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="surnameU"
                  name="surnameU"
                  value={formik.values.surnameU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.surnameU &&
                    formik.errors.surnameU && (
                      <span className="text-red-600">
                        {formik.errors.surnameU}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="curpU" value="CURP" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="curpU"
                  name="curpU"
                  value={formik.values.curpU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.curpU &&
                    formik.errors.curpU && (
                      <span className="text-red-600">{formik.errors.curpU}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="emailU" value="Correo electronico" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="emailU"
                  name="emailU"
                  value={formik.values.emailU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.emailU &&
                    formik.errors.emailU && (
                      <span className="text-red-600">{formik.errors.emailU}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="usernameU" value="Usuario" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="usernameU"
                  name="usernameU"
                  value={formik.values.usernameU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.usernameU &&
                    formik.errors.usernameU && (
                      <span className="text-red-600">{formik.errors.usernameU}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="passwordU" value="Contraseña" className="font-bold" />
                </div>
                <TextInput
                  type="password"
                  id="passwordU"
                  name="passwordU"
                  value={formik.values.passwordU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.passwordU &&
                    formik.errors.passwordU && (
                      <span className="text-red-600">{formik.errors.passwordU}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="confirmPasswordU" value="Confirmar contraseña" className="font-bold" />
                </div>
                <TextInput
                  type="password"
                  id="confirmPasswordU"
                  name="confirmPasswordU"
                  value={formik.values.confirmPasswordU}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.confirmPasswordU &&
                    formik.errors.confirmPasswordU && (
                      <span className="text-red-600">{formik.errors.confirmPasswordU}</span>
                    )
                  }
                />
              </div>

            </form>
          </div>

          
          <div className='my-4 flex flex-row justify-between'>
            <button className='bg-transparent text-medium px-6 py-1 h-10 rounded-md text-red-700 hover:bg-red-700 outline hover:outline-dashed'
              onClick={() => closeModal()}>
              Cancelar
            </button>

            <Button
              disabled={formik.isSubmitting || !formik.isValid}
              type='submit'
              form='teacherForm'
              className='bg-blue-600 text-medium px-6 py-1 h-10 rounded-md text-white'
            >
              Actualizar
            </Button>
          </div>

        </Modal.Body>
       
      </Modal>
    </div>
  )
}

export default UpdateD
