import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';
import { hydrateUserFromCookie } from './store/slices/AuthSlice';
import { getUserFromCookie } from './lib/getUserFromCookie';
import Loader from "./components/Loader";
import { useAuthBoot } from './hooks/useAuthBoot';



function App() {
  const isHydrated = useSelector((state) => state.Auth.isHydrated);
  const booted = useAuthBoot();


  if (!booted || !isHydrated) return <Loader />;




  return <RouterProvider router={router} />;
}

export default App;



