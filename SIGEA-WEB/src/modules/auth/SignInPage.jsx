import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import AxiosClient from '../../config/http-client/axios-client';
import { customAlert } from '../../config/alerts/alert';
import AuthContext from '../../config/context/auth-context';
import '../../assets/styles.css';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import Logo from '../../assets/img/logo.png';

const SignInPage = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      username: yup.string().required('Campo obligatorio'),
      password: yup.string().required('Campo obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await AxiosClient({
          url: '/auth/signin',
          method: 'POST',
          data: values,
        });
        console.log(response);
        if (!response.error) {
          dispatch({ type: 'SIGNIN', payload: response.data });
          navigate('/', { replace: true });
        } else throw Error('Error');
      } catch (error) {
        customAlert(
          'Iniciar sesión',
          'Usuario y/o contraseña incorrectos',
          'info'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);
    // Aquí puedes realizar acciones adicionales al enviar el formulario si es necesario.
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '5rem' }}>
      <div className="animacion">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="mb-8 flex-auto">

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <img src={Logo} className="w-64 h-auto mx-auto mb-6" />
            <h1 className="text-blue-500 text-2xl font-semibold">¡Bienvenido a SIGEA!</h1>
          </div>

          <div className="mb-4">
            <Label htmlFor="username" value="Nombre de usuario" style={{ color: "#6B82B8" }}>Nombre de usuario</Label>
            <TextInput
              id="username"
              type="text"
              sizing="md"
              value={formik.values.username}
              onChange={(e) => { formik.handleChange(e); setUsername(e.target.value); }}
              onBlur={formik.handleBlur}
              placeholder="nombre de usuario"
            />
            {formik.errors.username && formik.touched.username && (
              <span className="text-red-600">{formik.errors.username}</span>
            )}
          </div>

          <div className="inputbox mb-4">
            <Label htmlFor="password" value="Contraseña" style={{ color: "#6B82B8" }}>Contraseña</Label>
            <TextInput
              id="password"
              type="password"
              sizing="md"
              value={formik.values.password}
              onChange={(e) => { formik.handleChange(e); setPassword(e.target.value); }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-600">{formik.errors.password}</span>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              style={{ background: '#4480FF', width: '70%' }}
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <Spinner />
              ) : (
                'Iniciar'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
