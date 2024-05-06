import React, {useState} from 'react'
// import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';


import './navbar.css'

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false)
  
  return (
  <div className='synpro1__navbar-bigboy'>
    <div className='synpro1__navbar'>
        <div className='synpro1__navbar-links_logo'>
            {/* <img src={logo} alt="logo" /> */}
            <p>Prospecter</p>
        </div>

        <div className='synpro1__navbar-links'>
          <div className='synpro1__navbar-links_container'>
            <p className='text-shadow-pop-top'><a href="#home">Home</a></p>
            <p className='text-shadow-pop-top'><a href="#howitworks">How it Works</a></p>
            <p className='text-shadow-pop-top'><a href="#properties">Properties</a></p>
            <p className='text-shadow-pop-top'><a href="#aboutus">About Us</a></p>
            <p className='text-shadow-pop-top'><a href="#contactus">Contact Us</a></p>
          </div>
        </div>

        <div className='synpro1__navbar-sign'>
          <p className='text-shadow-pop-top'>Sign In</p>
          <button type='button' className='shadow-pop-tl'>Sign Up</button>
        </div>

        <div className='synpro1__navbar-menu'>
          {/* {toggleMenu
            ? <RiCloseLine color='black' size={27} onClick={() => setToggleMenu(false)} />
            : <RiMenu3Line color='black' size={27} onClick={() => setToggleMenu(true)} />} */}

          {toggleMenu && (
            <div className='synpro1__navbar-menu_container scale-up-center'>
              <div className='synpro1__navbar-menu_container-links'>
                <p className='text-shadow-pop-top'><a href="#home">Home</a></p>
                <p className='text-shadow-pop-top'><a href="#howitworks">How it Works</a></p>
                <p className='text-shadow-pop-top'><a href="#properties">Properties</a></p>
                <p className='text-shadow-pop-top'><a href="#aboutus">About Us</a></p>
                <p className='text-shadow-pop-top'><a href="#contactus">Contact Us</a></p>
              </div>

              <div className='synpro1__navbar-menu_container-links-sign'>
                <p className='text-shadow-pop-top'>Sign In</p>
                <button type='button'>Sign Up</button>
              </div>
            </div>
          )}
      </div>

    </div>
  </div>
)
}

export default Navbar