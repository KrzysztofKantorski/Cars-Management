import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <>
    <nav>
        <button>Go to link</button>
    </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout