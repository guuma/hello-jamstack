import React from 'react'
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