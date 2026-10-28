import { Outlet } from 'react-router';
import Menu from '../components/Menu';

function RootLayout() {
  return (
    <>
    <Menu/>
    <main>
        <Outlet />
    </main>
    </>
  ) 
}

export default RootLayout