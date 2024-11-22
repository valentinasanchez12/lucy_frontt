import React from 'react'
import Logo from './Logo'
import NavLinks from './NavLinks'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#00873D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <NavLinks />
        </div>
      </div>
    </nav>
  )
}

export default Navbar