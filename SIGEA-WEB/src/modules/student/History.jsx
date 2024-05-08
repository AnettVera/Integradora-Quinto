import React, {useContext, useEffect, useState} from 'react';
import { useOutletContext } from 'react-router-dom';
import AxiosClient from '../../config/http-client/axios-client';
import AuthContext from '../../config/context/auth-context';
import InfoExam from './components/InfoExam';
import Empty from '../../assets/img/empty.png'
import { Label } from 'flowbite-react';


const History = ({user}) => {
  const [exams, setExams] = useState([]);

  const getExams = async () => {
    try {
      const response = await AxiosClient ({
        method: 'GET',
        url: `/exam/foundExamForStudent/${user.user.id_user}`,
      })
      if (!response.error) setExams(response.data);
    } catch (error) {
    }
  };

  useEffect(() => {

    getExams();
  }, []);

  return (
    <>
      <div className='w-full justify-center flex p-5 bg-white'>
        <div className='m-auto w-full  sm:w-full md:w-10/12 lg:w-full justify-center text-center px-6 py-4 rounded-md bg-gray-100'>
          <h5 className='font-bold mx-auto text-blue-900 text-3xl '>Historial</h5>
          <div className="mt-10">

          {exams.length > 0 ? (
          exams.map((exam, index) => (
            <InfoExam key={index} exam={exam} user={user.user.id_user}/>
          ))
        ) : (
          <div className='justify-center text-center'>
            <img src={Empty} alt="No Units" style={{ width: '40%', margin: 'auto' }} />
            <Label className='text-xl text-blue-900 font-bold'>Aún no hay exámenes en tu historial</Label>

          </div>
        )}
          </div>
        </div>
      </div>
    </>
  );
};

export default History;
