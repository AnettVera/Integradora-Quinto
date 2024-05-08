import React, { useContext, useEffect, useState } from 'react';
import { HiPencil } from 'react-icons/hi2';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Label, Modal, TextInput, } from 'flowbite-react';

import { customAlert } from '../../config/alerts/alert';
import AuthContext from '../../config/context/auth-context';
import AxiosClient from '../../config/http-client/axios-client';

const ProfilePage = ({ user }) => {
  const authContext = useContext(AuthContext);

  const { token } = user.token;
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authContext.getUser) {
      const fetchUserId = async () => {
        try {
          const userData = await authContext.getUser();
          setUserId(userData.id);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      };
      fetchUserId();
    }
  }, [authContext]);

  useEffect(() => {
    if (authContext.getUser) {
      const fetchUserId = async () => {
        try {
          const userData = await authContext.getUser();
          setUserId(userData.id);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      };
      fetchUserId();
    }
  }, [authContext]);

  const formik = useFormik({
    initialValues: {
      nameU: user?.user?.person?.name || '',
      lastnameU: user?.user?.person?.lastname || '',
      surnameU: user?.user?.person?.surname || '',
      curpU: user?.user?.person?.curp || '',
      emailU: user?.user?.person?.email || '',
      usernameU: user?.user?.username || '',
      passwordU: '',
    },

    validationSchema: yup.object({}).shape({
      nameU: yup.string()
        .min(3, "Minimo 3 caracteres")
        .max(45, "Maximo 45 caracteres"),
      secondNameU: yup.string(),
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
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          id: user.user.person.id_person,
          name: values.nameU?.trim() || '',
          secondName: values.secondNameU?.trim() || '',
          lastname: values.lastnameU?.trim() || '',
          surname: values.surnameU?.trim() || '',
          curp: values.curpU?.trim() || '',
          email: values.emailU?.trim() || '',
          user: {
            username: values.usernameU?.trim() || '',
            password: values.passwordU?.trim() || '',
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
            'Los datos han sido actualizados correctamente',
            'success'
          );
          setIsEditing(false);
        } else {
          customAlert(
            'Error',
            'Ha ocurrido un error, por favor intente de nuevo',
            'error'
          );
        }

      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        customAlert(
          'Error',
          'Ha ocurrido un error, por favor intente de nuevo',
          'error'
        );
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleEditClick = () => {
    setIsEditing(true);
    console.log(userId);
    console.log(token);
    console.log(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await formik.handleSubmit();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };
  return (
    <>
      <div className='p-12 flex justify-center'>
        <div className='w-1/2 my-10 justify-center p-3 bg-gray-100 rounded-lg'>
          <div className='text-center justify-center '>
            <div className='mt-4 relative inline-flex items-center justify-center w-14 h-14 overflow-hidden rounded-full' style={{ backgroundColor: '#052368', color: '#fff', border: '4px solid#4480FF' }}>
              <span className='font-bold text-3xl text-white dark:text-gray-300'> {formik.values.usernameU.charAt(0).toUpperCase()}</span>
            </div>
            <div className='mt-6 flex justify-center flex-row font-medium text-2xl'>
              <Label className='mx-1'>Docente</Label>
              <button className='bg-white rounded-full w-5 h-5 hover:bg-gray-100' onClick={handleEditClick}>
                <HiPencil style={{ color: '#4480FF' }} className='mx-1 cursor-pointer' />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} id='teacherForm'>
            <div className='space-y-12'>
              <div className='border-b border-gray-900/10 pb-12'>
                <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                  <div className='sm:col-span-3 mb-4'>
                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='usernameU'
                        name='usernameU'
                        value={formik.values.usernameU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.usernameU && formik.errors.usernameU && (
                        <span className="text-red-600">{formik.errors.usernameU}</span>
                      )}
                    </div>
                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='nameU'
                        name='nameU'
                        value={formik.values.nameU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.nameU && formik.errors.nameU && (
                        <span className="text-red-600">{formik.errors.nameU}</span>
                      )}
                    </div>
                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='lastnameU'
                        name='lastnameU'
                        value={formik.values.lastnameU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.lastnameU && formik.errors.lastnameU && (
                        <span className="text-red-600">{formik.errors.lastnameU}</span>
                      )}

                    </div>

                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='surnameU'
                        name='surnameU'
                        value={formik.values.surnameU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.surnameU && formik.errors.surnameU && (
                        <span className="text-red-600">{formik.errors.surnameU}</span>
                      )}

                    </div>

                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='curpU'
                        name='curpU'
                        value={formik.values.curpU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.curpU && formik.errors.curpU && (
                        <span className="text-red-600">{formik.errors.curpU}</span>
                      )}

                    </div>

                    <div className='mt-1'>
                      <input
                        type='text'
                        disabled={!isEditing}
                        id='emailU'
                        name='emailU'
                        value={formik.values.emailU}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                      {formik.touched.emailU && formik.errors.emailU && (
                        <span className="text-red-600">{formik.errors.emailU}</span>
                      )}

                    </div>




                    {isEditing && (

                      <div className='sm:col-span-3 mb-4'>
                        <div className='mt-2'>
                          <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Contraseña'
                            className='text-center block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='mt-6 flex flex-col md:flex-row items-center justify-between gap-4'>
                {isEditing && (
                  <>
                    <button
                      type='button'
                      className='w-full md:w-auto bg-red-700 px-4 py-2 text-white rounded-sm text-sm'
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={formik.isSubmitting || !formik.isValid}
                      type='submit'
                      form='teacherForm'
                      className='w-full md:w-auto bg-green-600 px-4 md:px-6 py-2 rounded-md text-white text-sm md:text-medium'
                    >
                      Guardar cambios
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div >
      </div >
    </>
  )
}

export default ProfilePage;
<style jsx>{`
@media (max-width: 768px) {
  .p-12 {
    padding: 2rem;
  }
  .w-1/2 {
    width: 100%;
  }
}
`}</style>