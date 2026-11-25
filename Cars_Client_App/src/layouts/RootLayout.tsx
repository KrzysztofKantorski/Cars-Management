import { Outlet } from 'react-router';
import Menu from '../components/Menu';

function RootLayout() {
  return (
    <>
    <Menu/>
    <main className="bg-background text-foreground h-screen">
        <Outlet />
    </main>
    </>
  ) 
}

export default RootLayout