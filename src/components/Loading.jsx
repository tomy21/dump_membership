import React from 'react';
import { ScaleLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-transparent w-full">
      <ScaleLoader size={150} color={'#CD5C08'} loading={true} />
    </div>
  );
};

export default Loading;
