import React from 'react'

function Container({children}) {
  return  <div className='md:w-full md:max-w-7xl md:mx-auto px-4 w-full'>{children}</div>;
}

export default Container
