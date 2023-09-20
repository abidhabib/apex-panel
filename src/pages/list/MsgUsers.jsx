import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import MsgUser from '../../components/MsgToUsr/MsgUser'

const MsgUsers = () => {
  return (
<>

<div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <MsgUser/>
      </div>
    </div>
</>


    )
}

export default MsgUsers