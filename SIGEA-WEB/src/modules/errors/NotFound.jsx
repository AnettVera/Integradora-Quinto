import React from 'react'
import './../../assets/styles.css' 
import Error from './../../assets/img/404.png'

const NotFound = () => {
  return (
    <>
     <div className="min-h-screen flex items-center justify-center" style={{ marginTop: '5rem' }}>
      <div className="animacion">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
      </div>
<img src={Error} style={{width:'40%'}}>

</img>

      </div>
    </>
  )
}

export default NotFound