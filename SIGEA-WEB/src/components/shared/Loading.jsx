import React from 'react'
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

export default Loading
