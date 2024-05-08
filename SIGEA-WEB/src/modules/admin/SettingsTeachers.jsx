import React, { useMemo, useState, useEffect } from 'react';
import { HiPlus, HiMagnifyingGlass } from "react-icons/hi2";
import { LiaUserEditSolid } from "react-icons/lia";
import { Button, Tooltip } from 'flowbite-react';
import { Switch } from '@mui/material';

import AxiosClient from '../../config/http-client/axios-client';
import CustomDataTable from '../../components/shared/CustomDataTable';
import { confirmAlert, customAlert, pconfirmAlert } from '../../config/alerts/alert';
import RegisterUserD from './components/RegisterUserD';
import UpdateD from './components/UpdateD';

const SettingsTeachers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const openUpdate = (id) => {
    setUserId(id);
    setUpdate(true);
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(user =>
      `${user.person.name} ${user.person.secondName ?? ''} 
      ${user.person.lastname} ${user.person.surname ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm]);


  const columns = useMemo(() => [

    {
      cell: (row) => (
        <div className='font-medium text-sm'>
          {
            `${row.person.name} 
          ${row.person.secondName ?? ''} 
          ${row.person.lastname} 
          ${row.person.surname ?? ''}`}
        </div>
      ),
      selector: (row) =>
        `${row.person.name} 
      ${row.person.secondName ?? ''} 
      ${row.person.lastname} 
      ${row.person.surname ?? ''}`,
    },
    {
      cell: (row) => (
        <div className='w-full flex direction-row justify-end text-end text-gray-500'>
          {row.username}
        </div>

      ),
      selector: (row) => row.username,

    },
    {
      cell: (row) => (

        <>
          <div className='flex direction-row w-full text-end justify-end'>
            <Switch
              checked={row.status}
              onChange={() => changeStatus(row.id_user, row.status)} />
            <Tooltip content='Editar'>
              <Button onClick={() => { openUpdate(row.id_user) }} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginLeft: 3 }}>
                <LiaUserEditSolid style={{ color: '4480FF', fontSize: '1.3rem', fontWeight: 'bold' }} />
              </Button>
            </Tooltip>
          </div>
        </>
      ),
    },
  ])

  const getUsers = async () => {
    try {
      const response = await AxiosClient({ url:  "/user/allTeachers", method: 'GET' });
      console.log(response);
      if (!response.error) setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const changeStatus = async (id, statusUser) => {
    console.log(id, statusUser);
    pconfirmAlert(async () => {
      try {
        const response = await AxiosClient({
          method: 'PATCH',
          url: `/user/${id}`,
          data: {
            status: !statusUser
          }
        });
        if (!response.error) {
          customAlert(
            'Actualización exitosa',
            'El estado del docente ha sido actualizado correctamente',
            'success'
          );
          getUsers();
        }
      } catch (error) {
        customAlert(
          'Error',
          'Ha ocurrido un error, por favor intente de nuevo',
          'error'
        );
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    getUsers();
  }, []);

  const openRegister = () => {
    setIsCreating(true);
  }



  return (
    <>
      <div className='w-full h-10 bg-blue-100 flex justify-between items-center p-4'>

        <label style={{ fontWeight: 'bold', color: '#052368', fontSize: '1.1rem', }}>Docentes</label>
        <div className='relative  flex-1' style={{ flex: '0.6' }}>
          <input
            type='text'
            placeholder='Buscar docente'
            className="w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder-gray-400 sm:text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button

            className='absolute right-0 top-0 h-full px-2 flex items-center'
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          >

            <HiMagnifyingGlass style={{ color: '4480FF', fontSize: '1.5rem', fontWeight: 'bold' }} />
          </button>
        </div>
        
        <Tooltip content='Agregar docente'>
          <Button onClick={openRegister} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <HiPlus style={{ color: '4480FF', fontSize: '2rem', fontWeight: 'bold' }} />
          </Button>
        </Tooltip>
      </div>



      <div className='justify-center p-3'>

        <div >

          <CustomDataTable
            columns={columns}
            data={filteredUsers}
            isLoading={loading}
          />
        </div>

        <RegisterUserD isCreating={isCreating} setIsCreating={setIsCreating} getAllTeachers={getUsers} />
        <UpdateD isUpdate={isUpdate} setUpdate={setUpdate} getAllTeachers={getUsers} id={userId} />
      </div>
    </>
  )
}

export default SettingsTeachers
