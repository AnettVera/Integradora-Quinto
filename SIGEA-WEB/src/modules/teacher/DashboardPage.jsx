import React, { useState, useContext, useEffect, useMemo } from "react";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { Button, Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

import RegisterSubject from "./components/RegisterSubject";
import AuthContext from "../../config/context/auth-context";
import AxiosClient from "../../config/http-client/axios-client";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState([]);

  const openRegister = () => {
    setIsCreating(true);
  };

  const getSubjects = async () => {
    try {
      const subjectsResponse = await AxiosClient({
        method: 'GET',
        url: `/subject/allSubjects/${user.user.id_user}`,
      });
      if (!subjectsResponse.error) {
        setSubjects(subjectsResponse.data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubjects();
  }, [isCreating]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubjects = useMemo(() => {
    if (!searchTerm) return [];

    return subjects.filter(subject =>
      subject.name.toUpperCase().includes(searchTerm.toUpperCase())
    );
  }, [subjects, searchTerm]);


  return (
    <div className="w-full bg-blue-100 px-2 py-1">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        <label style={{ fontWeight: 'bold', color: '#052368', fontSize: '1.1rem', marginRight: '1rem', }}>Materias</label>
        <div className="relative " style={{ width: '60%' }}>
          <input
            type='text'
            placeholder='Buscar por nombre de materia'
            className='text-center block w-full h-8 rounded-md border-0 py-0.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="absolute right-0 top-0 h-full px-2 flex items-center"
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', zIndex: '1' }}
          >
            <HiMagnifyingGlass style={{ color: '#4480FF', fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '1rem' }} />
          </button>
        </div>
        <Tooltip content="Agregar materia">
          <Button onClick={openRegister} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
            <HiPlus style={{ color: '#4480FF', fontSize: '2rem', fontWeight: 'bold' }} />
          </Button>
        </Tooltip>
      </div>
      <RegisterSubject
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        userId={user.user.id_user}
      />

<div className="fixed top-full left-auto right-auto w-1/2 bg-white shadow-md rounded-lg overflow-hidden z-10">
    {filteredSubjects.map(subject => (
      <Link to={`/subject/${subject.id_subject}`} key={subject.id_subject}>
        <div className='card bg-white shadow-md rounded-lg overflow-hidden text-center'>
          {subject.name}
        </div>
      </Link>
    ))}
  </div>

    </div>
  );
};

export default DashboardPage;

<style jsx>{`
@media only screen and (max-width: 768px) {
  /* Estilos para pantallas pequeñas */
  .relative {
    width: 100%; 
  }
  button {
    margin-right: 1rem; 
  }
}
`}</style>