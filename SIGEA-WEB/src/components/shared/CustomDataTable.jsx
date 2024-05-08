import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Spinner } from 'flowbite-react';

const Loading = () => {
  return (
    <div className='flex flex-wrap gap-2'>
      <div className='text-center'>
        <Spinner />
      </div>
    </div>
  );
};

const CustomDataTable = ({ columns, data, isLoading }) => {
  const customStyles = {
    rows: {
      style: {
        margin:0,
        backgroundColor: '#f9f9f9', 
        '&:nth-child(odd)': {
          backgroundColor: '#ffffff', 
        },
      },
    },
    headRow: {
      style: {
        display: 'none', 
      },
    },
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; 
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const generatePaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <a
          key={i}
          href="#"
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </a>
      );
    }
    return buttons;
  };

  return (
    <div>
      <div className='rounded-lg shadow-md'>
      <DataTable
        stripedRows
        columns={columns}
        data={paginatedData}
        progressPending={isLoading}
        noDataComponent={<Spinner />}
        customStyles={customStyles}
        pagination
        paginationPerPage={itemsPerPage}
        paginationComponent={() => null} 
      />

      </div>
     
      <div className='w-full justify-center text-center my-7'>
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a
            href="#"
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handlePrevPage}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </a>
          {generatePaginationButtons()}
          <a
            href="#"
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handleNextPage}
          >
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default CustomDataTable;
