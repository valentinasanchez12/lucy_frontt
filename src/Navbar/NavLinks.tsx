import React from 'react';
import NavItem from './NavItem.tsx';
import DropdownMenu from './DropdownMenu.tsx';

const NavLinks: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row md:ml-10 md:space-x-4">
            <NavItem href="/" text="Inicio" />
            <NavItem href="/dashboard" text="Dashboard" />
            <DropdownMenu />
        </div>
    );
};

export default NavLinks;