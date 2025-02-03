import React from 'react'


const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <a href="/" className="">
      <img 
          src="/static/logo_grande.png"
          alt="Logo" 
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '200px',
            maxHeight: '50px',
          }}
        />
      </a>
      
    </div>
  )
}

export default Logo