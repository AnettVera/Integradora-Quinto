import React from 'react';
import { Button, Label, Modal, TextInput, } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { confirmAlert, customAlert , pconfirmAlert} from '../../../config/alerts/alert';
import AxiosClient from '../../../config/http-client/axios-client';

const RegisterUserS = ({ isCreating, setIsCreating, getAllStudents }) => {

  const closeModal = () => {
    formik.resetForm();
    setIsCreating(false);
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      secondName: "",
      lastname: "",
      surname: "",
      curp: "",
      email: "",
      username: "",
    },

    validationSchema: yup.object({}).shape({
      name: yup.string()
        .required("Campo requerido")
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      secondName: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      lastname: yup.string()
        .required("Campo requerido")
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      surname: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      curp: yup.string()
        .required("Campo requerido")
        .min(18, "Minimo 18 caracteres")
        .max(18, "Maximo 18 caracteres"),
      email: yup.string()
        .required("Campo requerido")
        .email("Correo invalido"),
      username: yup.string()
        .required("Campo requerido")
        .min(10, "Minimo 10 caracteres")
        .max(10, "Maximo 10 caracteres"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      pconfirmAlert(async () => {
        try {
          const payload = {
            ...values,
            name: values.name.trim(),
            secondName: values.secondName.trim(),
            lastname: values.lastname.trim(),
            surname: values.surname.trim(),
            curp: values.curp.trim(),
            email: values.email.trim(),
            user: {
              username: values.username.trim(),
            }
          };
          const response = await AxiosClient({
            method: 'POST',
            url: 'person/saveStudent/3',
            data: payload,
          });

          if (!response.error) {
            customAlert(
              'Registro exitoso',
              'Estudiante registrado correctamente',
              'success'
            )
            getAllStudents();
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

  return (
    <div>
      <Modal show={isCreating} size="md" onClose={closeModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Registro de estudiantes</h3>

            <form
              noValidate
              onSubmit={formik.handleSubmit}
              id='studentForm'
              name='studentForm'
            >

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="name" value="Nombre" className='font-bold' />
                </div>
                <TextInput
                  type='text'
                  id='name'
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

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="secondName" value="Segundo Nombre" className='font-bold' />
                </div>
                <TextInput
                  type='text'
                  id='secondName'
                  name='secondName'
                  value={formik.values.secondName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.secondName &&
                    formik.errors.secondName && (
                      <span className="text-red-600">
                        {formik.errors.secondName}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="lastname" value="Apellido paterno" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.lastname &&
                    formik.errors.lastname && (
                      <span className="text-red-600">
                        {formik.errors.lastname}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="surname" value="Apellido materno" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="surname"
                  name="surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.surname &&
                    formik.errors.surname && (
                      <span className="text-red-600">
                        {formik.errors.surname}
                      </span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="curp" value="CURP" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="curp"
                  name="curp"
                  value={formik.values.curp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.curp &&
                    formik.errors.curp && (
                      <span className="text-red-600">{formik.errors.curp}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="email" value="Correo electronico" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.email &&
                    formik.errors.email && (
                      <span className="text-red-600">{formik.errors.email}</span>
                    )
                  }
                />
              </div>

              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="username" value="Matricula" className="font-bold" />
                </div>
                <TextInput
                  type="text"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={
                    formik.touched.username &&
                    formik.errors.username && (
                      <span className="text-red-600">{formik.errors.username}</span>
                    )
                  }
                />
              </div>
            </form>
          </div>

          <div className='my-4 flex flex-row justify-between'>
            <Button className='bg-transparent text-medium px-6 py-1 h-10 rounded-md text-red-700 hover:bg-red-700 outline hover:outline-dashed'
              onClick={() => closeModal()}>
              Cancelar
            </Button>
            <Button
              disabled={formik.isSubmitting || !formik.isValid}
              type='submit'
              form='studentForm'
              className='bg-blue-600 text-medium px-6 py-1 h-10 rounded-md text-white'
            >
              Registrar
            </Button>
          </div>

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default RegisterUserS
