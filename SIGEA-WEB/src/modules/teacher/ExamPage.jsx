import React, { useEffect, useState } from 'react';
import { Card, Select } from 'flowbite-react';
import { HiMagnifyingGlass, HiPlus, HiOutlineCheckCircle } from 'react-icons/hi2';
import MulText from '../../components/question/MulText';
import MulRadio from '../../components/question/MulRadio';
import { useParams } from 'react-router-dom';
import AxiosClient from '../../config/http-client/axios-client';
import TextQuestion from '../../components/question/TextQuestion';
import QuestionCard from '../../components/question/QuestionCard';

const ExamPage = () => {
  const { examId } = useParams();

  const [exam, setExam] = useState({});
  const [examList, setExamList] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      const response = await AxiosClient({
        method: 'GET',
        url: `/exam/oneExam/${examId}`
      });
      setExam(response.data);
    }

    const foundQuestions = async () => {
      const response = await AxiosClient({
        method: 'GET',
        url: `/exam/questionsOptions/${examId}`
      });
      console.log(response.data);
      setExamList(response.data);
    }

    foundQuestions();
    fetchExam();
  }, []);

  return (
    <>
      <div className="w-full h-10 bg-blue-100 flex justify-between items-center p-4">
        <label style={{ fontWeight: 'bold', color: '#052368', fontSize: '1.1rem' }}>
          {exam && exam?.unit && exam?.unit?.subject ? exam?.unit?.subject?.name : ''}
        </label>
      </div>
      <div className="w-full overflow-y-auto" style={{ height: '90vh' }}>
        <div className="w-full p-5 justify-around text-center">
          <label style={{ fontWeight: 'bold', color: '#052368', fontSize: '1.5rem' }}>{exam?.name}</label>
          <div className="w-lg p-5 bg-gray-50">
            {examList.map((exam, index) => (
              <div key={index}>
                <QuestionCard idQuestion={exam.idQuestion} exam={exam} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExamPage;
