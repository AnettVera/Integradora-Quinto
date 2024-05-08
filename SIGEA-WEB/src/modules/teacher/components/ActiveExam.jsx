import React, { useState } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import AxiosClient from '../../../config/http-client/axios-client';
import { customAlert } from '../../../config/alerts/alert';



const ActiveExam = ({ isCreating, setIsCreating, exam }) => {
  const today = new Date();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();
  today.setHours(0, 0, 0, 0);

  const formik = useFormik({
    initialValues: {
      limitDate: "",
      limitTime: "00:00"
    },
    validationSchema: yup.object().shape({
      limitDate: yup.date()
        .min(today, "La fecha límite no puede ser anterior a la fecha actual")
        .required("Campo obligatorio"),
      limitTime: yup.string()
        .required('Campo obligatorio')
        .test('is-valid-time', 'Ingrese una hora válida', function (value) {
          if (formik.values.limitDate === today.toISOString().split('T')[0]) {
            const [hour, minute] = value.split(':');
            return parseInt(hour) > currentHour || (parseInt(hour) === currentHour && parseInt(minute) > currentMinute);
          }
          return true;
        })
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const newLimitDate = values.limitDate;
        const newLimitTime = values.limitTime;
        const combinedDateTime = `${newLimitDate} ${newLimitTime.padStart(5, '0')}:00`;




        await changeLimitDate(exam.id_exam, combinedDateTime);
        customAlert('Actualización exitosa', 'Fecha límite del examen actualizada', 'success');
        setIsCreating(false);
      } catch (error) {
        console.error(error);
        customAlert('Error', 'Ha ocurrido un error, por favor intente de nuevo', 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const closeModal = () => {
    formik.resetForm();
    setIsCreating(false);
  };



  const changeLimitDate = async (id, combinedDateTime) => {
    try {
      const response = await AxiosClient({
        method: 'PATCH',
        url: `/exam/limitDay/${id}`,
        data: {
          id: id,
          combinedDateTime: combinedDateTime
        }
      });

      return response;
    } catch (error) {
      console.error(error);
      customAlert('Error', 'Ha ocurrido un error, por favor elija el formato de fecha de nuevo', 'error');
    }
  };

  return (
    <div>
      <Modal show={isCreating} size="md" popup>

        <Modal.Body>
          <div className="space-y-3 my-4">
            <h3 className="text-xl font-medium text-blue-600 dark:text-white text-center">Establecer fecha límite</h3>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              id='examForm'
              name='examForm'
            >
              <div>
                <div className='flex flex-row items-center justify-center align-middle mt-5'>
                  <div className="mt-0.5 block mx-1">
                    <Label htmlFor="limitDate" value="Fecha límite de entrega:" />
                  </div>
                  <div>
                    <TextInput
                      type='date'
                      id="limitDate"
                      name='limitDate'
                      value={formik.values.limitDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={
                        formik.touched.limitDate &&
                        formik.errors.limitDate && (
                          <span className="text-red-600">
                            {formik.errors.limitDate}
                          </span>
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center align-middle mt-5">
                  <div className="mt-0.5 block mx-1">
                    <Label htmlFor="limitTime" value="Hora límite de entrega:" />
                  </div>
                  <input 
                  style={{width:'40%'}}
                  type="time" 
                  id="limitTime"
                  name="limitTime"
                  value={formik.values.limitTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  class="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  required />
                   
                   

                </div>
                {formik.touched.limitTime && formik.errors.limitTime && (
                  <div className="text-center text-red-600 mt-1">
                    {formik.errors.limitTime}
                  </div>
                )}
              </div>
              <div className="flex justify-center text-sm font-medium text-gray-500 dark:text-gray-300 mt-5">
                <Button
                  disabled={formik.isSubmitting || !formik.isValid}
                  form='examForm'
                  type='submit'
                  className='bg-blue-600 text-medium px-6 py-1 rounded-md text-white h-8'>
                  Establecer
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ActiveExam;
