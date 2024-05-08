import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { Disclosure } from '@headlessui/react';
import { ArrowDownRightIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { RiUserFill, RiUserLine } from 'react-icons/ri';
import { HiHome, HiOutlineHome, HiPower } from "react-icons/hi2";
import { BiBookBookmark, BiSolidBookBookmark } from "react-icons/bi";
import AuthContext from '../../config/context/auth-context';
import SubjectLayout from '../../modules/teacher/components/SubjectLayout';
import AxiosClient from '../../config/http-client/axios-client';



const TeacherLayout = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [showSubjects, setShowSubjects] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState('');

  console.log(user);

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
  }, [showSubjects]);



  const handleToggleSubjects = () => {
    setShowSubjects(!showSubjects);
  };

  const handleSubjectSelected = (section, subject) => {
    setSelectedSubject(subject);
    handleSectionChange(section);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SIGNOUT' });
    <Link to={'/'}></Link>
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const cogIcon = isSidebarExpanded ? (
    selectedSection === 'dashboard' ? (
      <HiHome style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineHome style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'dashboard' ? (
      <HiHome style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineHome style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );
  const proIcon = isSidebarExpanded ? (
    selectedSection === 'profile' ? (
      <RiUserFill style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <RiUserLine style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'profile' ? (
      <RiUserFill style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <RiUserLine style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );
  const subIcon = isSidebarExpanded ? (
    selectedSection === 'subject' ? (
      <BiSolidBookBookmark style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <BiBookBookmark style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'subject' ? (
      <BiSolidBookBookmark style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <BiBookBookmark style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );

  return (
    <>
      <Disclosure as="nav" style={{ backgroundColor: '#4480FF' }}>
        {({ open }) => (
          <>
            <div className="mx-0 max-w-7xl px-2 sm:px-6 lg:px-8 max-w-screen-sm w-screen">
              <div className="relative flex h-11 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button
                    className={`relative inline-flex items-center justify-center rounded-md p-1 ${open ? 'text-gray-400' : 'text-white'
                      } hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                    onClick={toggleSidebar}
                    style={{ position: 'absolute', left: '10px' }}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Toggle sidebar</span>
                    <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <main className="flex">
        <aside>
          <Sidebar
            aria-label="Default sidebar example"
            style={{ height: '93vh',
             width: isSidebarExpanded ? '16rem' : '4rem' }}
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <li>
                  <Link
                    to={'/'}
                    onClick={() => handleSectionChange('dashboard')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'dashboard'
                      ? 'text-zinc-950 bg-white font-bold'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {cogIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Inicio</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={'profile'}
                    onClick={() => handleSectionChange('profile')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'profile'
                      ? 'text-zinc-950 bg-white font-bold'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {proIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Perfil</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={'#'}
                    onClick={handleToggleSubjects }
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'subject'
                      ? 'text-zinc-950 bg-white font-bold'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {subIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Materias</span>}
                  </Link>
                </li>
                {isSidebarExpanded &&
                <li>

                  {showSubjects && subjects &&(
                    <>
                      {subjects.map((subject, index) => (
                        <Link
                        key={index}
                        to={'subject'}
                        onClick={() => handleSubjectSelected('subject', subject)}>
                          <SubjectLayout subject={subject.name} />
                        </Link>
                      ))}
                    </>
                  )}

                </li>
}

<li className={`fixed bottom-3 left-0 ${isSidebarExpanded ? 'right-0' : 'transform translate-x-0'}`}>
                <Link
                onClick={handleLogout}
                className={`flex items-center justify-center rounded-lg p-2 text-base font-normal`}
                style={{ color: '#6B82B8', fontSize: '1.4rem' }}
                >
                <HiPower />
                {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Cerrar sesión</span>}
                </Link>
                </li>

              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </aside>
        <section className="w-full">

          <Outlet context={selectedSubject}/>
        </section>
      </main>
    </>
  );
};

export default TeacherLayout;
