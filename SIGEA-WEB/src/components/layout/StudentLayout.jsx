import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, PowerIcon } from '@heroicons/react/24/outline';
import { GrHistory } from "react-icons/gr";
import { PiNotebookDuotone, PiNotebookFill } from "react-icons/pi";
import { HiPower } from "react-icons/hi2";
import AuthContext from '../../config/context/auth-context';


const StudentLayout = () => {
  const { dispatch } = useContext(AuthContext);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState('access');

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'SIGNOUT' });
    <Link to={'/'}></Link>
  };

  const cogIcon = isSidebarExpanded ? (
    selectedSection === 'access' ? (
      <PiNotebookFill style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <PiNotebookDuotone style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'access' ? (
      <PiNotebookDuotone style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <PiNotebookFill style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  );

  const usersIcon = isSidebarExpanded ? (
    selectedSection === 'access' ? (
      <GrHistory style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <GrHistory style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    )
  ) : (
    selectedSection === 'access' ? (
      <GrHistory style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
    ) : (
      <GrHistory style={{ color: '#6B82B8', fontSize: '1.4rem' }} />
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
        <aside >
          <Sidebar
            className='relative'
            style={{ height: '93vh', width: isSidebarExpanded ? '16rem' : '0px', display: isSidebarExpanded ? 'block' : 'none' }}
          >
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <li>
                  <Link
                    to={'/'}
                    onClick={() => handleSectionChange('access')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'access'
                      ? 'text-zinc-950 bg-white font-bold'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {cogIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Examen</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to={'history'}
                    onClick={() => handleSectionChange('history')}
                    className={`flex items-center justify-center rounded-lg p-2 text-base font-normal ${selectedSection === 'history'
                      ? 'text-zinc-950 bg-white font-bold'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700'
                      }`}
                  >
                    {usersIcon}
                    {isSidebarExpanded && <span className="px-3 flex-1 whitespace-nowrap">Historial</span>}
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
          <Outlet className='bg-slate-200' />
        </section>
      </main>
    </>
  );
}

export default StudentLayout
