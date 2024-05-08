import React, { useContext } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import SignInPage from '../modules/auth/SignInPage';
import AuthContext from '../config/context/auth-context';
import AdminLayout from '../components/layout/AdminLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import DashboardPage from '../modules/admin/DashboardPage';
import SettingsStudents from '../modules/admin/SettingsStudents';
import SettingsTeachers from '../modules/admin/SettingsTeachers';
import UnitPage from '../modules/teacher/UnitPage';
import ProfilePage from '../modules/teacher/ProfilePage'
import ExamPage from '../modules/teacher/ExamPage';
import DashTeacher from '../modules/teacher/DashboardPage'
import CodeAccess from '../modules/student/CodeAccess';
import Exam from '../modules/student/Exam';
import History from '../modules/student/History';
import StudentLayout from '../components/layout/StudentLayout';
import SubjectPage from '../modules/teacher/SubjectPage';
import ResultsPage from '../modules/student/ResultsPage';
import NotFound from '../modules/errors/NotFound';
import ResultsPageT from '../modules/teacher/ResultsPage';


const AppRouter = () => {
  const { user } = useContext(AuthContext);

  const routesFromRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <>
            <Route path="/" element={<AdminLayout user={user} />}>
              <Route path='/' element={<DashboardPage user={user} />} /> 
              <Route path="teachers" element={<SettingsTeachers/>} />
              <Route path="students" element={<SettingsStudents/>} />
            </Route>
          </>
        );
      case 'TEACHER':
        return (
          <>
            <Route path="/" element={<TeacherLayout user={user} />}>
              <Route path="/" element={<DashTeacher user={user} />} />
              <Route path="profile" element={<ProfilePage user={user}/>} />
              <Route path='exam/:examId' element={<ExamPage/>}/>
              <Route path='results/:examId' element={<ResultsPageT/>}/>
              <Route path='unit' element={<UnitPage/>} />
              <Route path='subject' element={<SubjectPage user={user}/>} />
              <Route path='subject/:idSubject' element={<SubjectPage user={user}/>} />

            </Route>
          </>
        );
      case 'STUDENT':
        return (
          <>
            <Route path="/" element={<StudentLayout user={user} />}>
              <Route path="/" element={<CodeAccess user={user}/>} />
              <Route path="exam" element={<Exam user={user}/>} />
              <Route path='history' element={<History user={user}/>}/> 
              <Route path='results' element={<ResultsPage/>}/> 
            </Route>
          </>
        );
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {user.signed ? (
          <>
            {routesFromRole(user?.roles[0]?.type)}
          </>
        ) : (
          <Route path="/" element={<SignInPage />} />
        )}
        <Route path="/*" element={<NotFound/>} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
