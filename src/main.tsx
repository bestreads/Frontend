import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";

import './style.css'
import Home from './pages/Home.tsx'
import Layout from './components/Layout.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import ResetPW from './pages/ResetPW.tsx';
import Library from './pages/Library.tsx';
import Error from './pages/Errorpage.tsx';
import UserProfile from './pages/UserProfile.tsx';

import { ThemeProvider } from './components/theme-provider.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [

      {
        index: true,
        element: <Home />,
      },
      {
        path: "library",
        element: <Library />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "reset-password",
        element: <ResetPW />
      },
      {
        path: "profile/:userId",
        element: <UserProfile />
      },
      {
        path: "*",
        element: <Error />,
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
