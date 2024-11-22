import React from 'react'
import NavItem from './NavItem'
import DropdownMenu from './DropdownMenu'

const NavLinks: React.FC = () => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <NavItem href="/" text="Inicio" />
        <DropdownMenu />
      </div>
    </div>
  )
}

export default NavLinks