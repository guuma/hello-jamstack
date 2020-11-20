import React from 'react'
import '../layout.css'
import {Header} from '../Header/index'
import {Footer} from '../Footer/index'
const Layout = ({children}) => {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default Layout