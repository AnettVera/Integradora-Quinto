import React, { useState, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { HiOutlineCog6Tooth, HiMiniCog6Tooth, HiOutlineUsers, HiMiniUsers, HiOutlineAcademicCap, HiAcademicCap, HiPower } from 'react-icons/hi2';
import AuthContext from '../../config/context/auth-context';

const AdminLayout = () => {
  const { dispatch } = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SIGNOUT' });
    <Link to={'/'}></Link>
  };
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const cogIcon = isSidebarExpanded ? (
    selectedSection === 'dashboard' ? (
      <HiMiniCog6Tooth style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineCog6Tooth style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'dashboard' ? (
      <HiMiniCog6Tooth style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineCog6Tooth style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );

  const usersIcon = isSidebarExpanded ? (
    selectedSection === 'teachers' ? (
      <HiMiniUsers style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineUsers style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'teachers' ? (
      <HiMiniUsers style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineUsers style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );

  const academicCapIcon = isSidebarExpanded ? (
    selectedSection === 'students' ? (
      <HiAcademicCap style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineAcademicCap style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'students' ? (
      <HiAcademicCap style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <HiOutlineAcademicCap style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );

  return (
    <>
      <Disclosure as="nav" style={{ backgroundColor: '#4480FF' }}>
        {({ open }) => (
          <>
            <div className="mx-0 max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-11 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button
                    className={`relative inline-flex items-center justify-center rounded-md p-1 ml-10 ${open ? 'text-gray-400' : 'text-white'
                      } hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                    onClick={toggleSidebar}
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
            style={{ height: '93vh', width: isSidebarExpanded ? '16rem' : '4rem'}}
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
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Ajustes</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={'teachers'}
                    onClick={() => handleSectionChange('teachers')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'teachers'
                        ? 'text-zinc-950 bg-white font-bold'
                        : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {usersIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Docentes</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={'students'}
                    onClick={() => handleSectionChange('students')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'students'
                        ? 'text-zinc-950 bg-white font-bold'
                        : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {academicCapIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Estudiantes</span>}
                  </Link>
                </li>

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
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default AdminLayout;
