import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { customAlert } from '../../config/alerts/alert';
import welcome from '../../assets/img/student.png';
import AxiosClient from '../../config/http-client/axios-client';
import { useNavigate } from 'react-router-dom';

const CodeAccess = ({ user }) => {
  const navigate = useNavigate();
  const [respondedExams, setRespondedExams] = useState([]);

  useEffect(() => {
    const fetchRespondedExams = async () => {
      try {
        const response = await AxiosClient.get(`/exam/foundExamForStudent/${user.user.id_user}`);
        if (!response.error) {
          setRespondedExams(response.data);
        }
      } catch (error) {
        console.error('Error al obtener los exámenes respondidos:', error);
      }
    };

    fetchRespondedExams();
  }, [user.user.id_user]);

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: yup.object().shape({
      code: yup.string().required('Campo obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
          const response = await AxiosClient.get(`/exam/questionOptionCode/${values.code}`);
          if (response.data && response.data.length > 0) {
              const examIds = response.data.map(exam => exam.idExam);
              const examsAlreadyResponded = respondedExams.some((exam) => {
                  return examIds.includes(exam.idExam);
              });
              if (examsAlreadyResponded) {
                  customAlert('Error', 'Ya has respondido a este examen', 'error');
              } else {
                  customAlert('Success', `Suerte en tu examen `, 'success');
                  navigate(`/exam`, { state: response.data });
              }
          } else {
              customAlert('Error', 'Hubo un error al acceder al examen', 'error');
          }
      } catch (error) {
          customAlert('Error', 'Este código no está asociado a ningún examen', 'error');
      } finally {
          setSubmitting(false);
      }
  },
  
  
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '5rem' }}>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8" style={{ width: '550px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <h1 className="text-blue-900 text-3xl font-semibold mb-6"> {'Hola Bienvenid@ ' + user.user.person?.name + '! '}</h1>
          <img src={welcome} style={{ height: '200px', width: '200px', margin: 'auto' }} alt="Welcome" />
        </div>
        <form onSubmit={handleSubmit} className="mb-8 flex-auto">
          <div className="mb-4">
            <Label htmlFor="code" value="Código de acceso" style={{ color: "#6B82B8" }} />
            <TextInput
              className='text-base	tracking-wider'
              style={{ fontSize: '1.7rem', letterSpacing: '8px', textAlign: 'center' }}
              id="code"
              type="text"
              sizing="md"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.code && formik.touched.code && (
              <span className="text-red-600">{formik.errors.code}</span>
            )}
          </div>
          <div className="flex justify-center">
            <Button type="submit" style={{ background: '#4480FF', width: '70%' }} disabled={formik.isSubmitting || !formik.isValid}>
              {formik.isSubmitting ? (
                <Spinner />
              ) : (
                'Acceder'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CodeAccess;
