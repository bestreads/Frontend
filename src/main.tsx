import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";

import './style.css'
import Home from './pages/Feed.tsx'
import Layout from './components/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Library from './pages/Library.tsx';
import Error from './pages/Errorpage.tsx';
import UserProfile from './pages/UserProfile.tsx';

import { ThemeProvider } from './components/theme-provider.tsx';
import { AuthProvider } from './contexts/Authcontext.tsx';
import { LibraryProvider } from './contexts/LibraryContext.tsx';
import { FollowProvider } from './contexts/FollowContext.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
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
            path: "profile/:userId",
            element: <UserProfile />
          },
          {
            path: "*",
            element: <Error />,
          },
        ]
      }
    ]
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "signup",
    element: <Signup />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FollowProvider>
        <LibraryProvider>
          <ThemeProvider storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </LibraryProvider>
      </FollowProvider>
    </AuthProvider>
  </StrictMode>,
)
