import React from 'react'
import { useLocation } from 'react-router-dom';
import BootStrapTable from '../bootstrapComponents/BootStrapTable';

const Blog = () => {

  const location = useLocation();
  const { datas } = location.state || {};

  console.log(datas);
  return (
    <>
     <BootStrapTable />
    </>
  )
}

export default Blog