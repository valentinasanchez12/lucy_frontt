import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  href: string;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, text }) => {
  return (
      <Link to={href} className="hover:bg-[#00632C] px-3 py-2 rounded-md text-sm font-medium">
        {text}
      </Link>
  );
};

export default NavItem;