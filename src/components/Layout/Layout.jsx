import React from 'react'
import Header from '../Header/Header'
import { Outlet } from "react-router-dom";
import Footer from '../Footer/Footer';


const Layout = () => {
  return (
    <>
    <div style={{ background: "var(--black)", overflow: "hidden" }}>
    <Header />
    <Outlet />
  </div>
  <Footer />
</>
  )
}

export default Layout
