import { Outlet } from 'react-router';
import Menu from '../components/menu';

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