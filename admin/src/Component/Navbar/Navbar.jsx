import React from 'react'
import logo from '../../assets/nav-logo.svg'
import profile from '../../assets/nav-profile.svg'
const Navbar = () => {
  return (
    <div className=' p-3 flex justify-between border border-2-gray'>
      <img className='h-10' src={logo} alt='logo'/>
      <img className='h-10' src={profile} alt='logo'/>
    </div>
  )
}
export default Navbar
