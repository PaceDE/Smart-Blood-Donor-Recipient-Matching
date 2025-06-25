import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'

const HeaderLayout= () => {
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default HeaderLayout;
