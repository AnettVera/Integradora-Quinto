import React, { memo } from 'react';
import { Card, Label } from 'flowbite-react';

const SubjectLayout = ({ subject }) => {
  const getInitials = (subject) => {
    const firstLetter = subject.charAt(0).toUpperCase();
    return firstLetter;
  }

  const getRandomColor = () => {
    const colors = ['#ff7f0e', '#6B82B8', '#006400', '#4480FF', '#052368']; 
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const divStyle = {
    backgroundColor: getRandomColor(),
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const subjectStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: 'calc(100% - 60px)', 
  };

  return (
    <div className='m-3'>
      <Card className='p-0 h-12 my-2'>
        <div className='flex row space-x-2 items-center'>
          <div style={divStyle}>
            <Label style={{ color: '#fff', fontSize: '1rem' }}>{getInitials(subject)}</Label>
          </div>
          <p style={subjectStyle}>{subject}</p>
        </div>
      </Card>
    </div>
  );
}

export default memo(SubjectLayout);
