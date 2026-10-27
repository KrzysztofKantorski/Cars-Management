import { NavLink } from 'react-router';

function Menu() {
  return (
    <>
        <nav className="menu">
            <NavLink to="/"> Main page</NavLink>
            <NavLink to="/cars">Cars</NavLink>
            <NavLink to="/cars/new">Add car</NavLink>
        </nav>
    </>
  ) 
}

export default Menu