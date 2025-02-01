import React from 'react'

interface NavItemProps {
  href: string
  text: string
}

const NavItem: React.FC<NavItemProps> = ({ href, text }) => {
  return (
    <a href={href} className="hover:bg-[#00632C] px-3 py-2 rounded-md text-sm font-medium">
      {text}
    </a>
  )
}

export default NavItem