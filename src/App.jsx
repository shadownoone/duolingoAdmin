import { RouterProvider } from 'react-router-dom';

// project import
import router from '@/routes';
import ThemeCustomization from '@/themes';

import ScrollTop from '@/components/ScrollTop';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
