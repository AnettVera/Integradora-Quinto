import React, { useContext, useEffect, useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { Button, Tooltip, Label } from 'flowbite-react';
import { useOutletContext } from 'react-router-dom';

import RegisterUnit from './components/RegisterUnit';
import AccorddionUnit from './components/AccorddionUnit';
import AxiosClient from '../../config/http-client/axios-client';
import AuthContext from '../../config/context/auth-context';
import Empty from '../../assets/img/empty.png';

const SubjectPage = () => {
  const { user } = useContext(AuthContext);
  const subject = useOutletContext();

  const [units, setUnits] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const openRegisterUnit = () => {
    setIsCreating(true);
  };

  const getUnits = async () => {
    try {
      const response = await AxiosClient({
        method: 'GET',
        url: `/unit/${subject.id_subject}`,
      });
      if (!response.error) setUnits(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUnits();
  }, [subject]);

  return (
    <div className="w-full overflow-y-auto" style={{height:'90vh'}}>
      <div className="w-full h-10 bg-blue-100 flex justify-between items-center p-4">
        <label style={{ fontWeight: 'bold', color: '#052368', fontSize: '1.1rem' }}>{subject.name}</label>
        <Tooltip content="Agregar unidad">
          <Button onClick={openRegisterUnit} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <HiPlus style={{ color: '4480FF', fontSize: '2rem', fontWeight: 'bold' }} />
          </Button>
        </Tooltip>
      </div>
      <div className="w-full justify-center p-5" >
        {units?.length > 0 ? (
          units.map((unit, index) => (
            <AccorddionUnit key={index} unit={unit} user={user} />
          ))
        ) : (
          <div className="justify-center text-center">
            <Label className="text-xl text-blue-900 font-bold">Aun no hay unidades registradas</Label>
            <img src={Empty} alt="No Units" style={{ width: '40%', margin: 'auto' }} />
          </div>
        )}
      </div>

      <RegisterUnit isCreatingUnit={isCreating} setIsCreatingUnit={setIsCreating} idSubject={subject.id_subject} getAllUnits={getUnits} />
    </div>
  );
};

export default SubjectPage;
