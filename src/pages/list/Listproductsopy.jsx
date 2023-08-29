import React from 'react'
import "./list.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import EasyPisaTabel from "../../components/easypisa/EasyPisaTabel";
import Products from '../../components/products/Products';
const Listproducts = () => {
  return (
<div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Products />
      </div>
    </div>  )
}

export default Listproducts