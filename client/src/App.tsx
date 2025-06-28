import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import RequireAuth from './helpers/RequireAuth';
import CreatePrompt from './pages/prompt/CreatePrompt';

// Lazy imports
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const GoogleAuthSuccess = lazy(() => import('./pages/auth/GoogleAuthSuccess'));
const CraftorProfile = lazy(() => import('./pages/profile/CraftorProfile'));
const Billing = lazy(() => import('./components/craftor/Billing'));
const MysticalLoader = lazy(() => import('./utils/MysticalLoader'));
const Denied = lazy(() => import("./pages/Denied"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Explore = lazy(() => import("./pages/prompt/Explore"));
const Favourites = lazy(() => import("./pages/user/Favourites"));

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Suspense fallback={<MysticalLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />

          <Route path='/explore' element={<Explore/>}></Route>


          <Route element={<RequireAuth allowedRoles={["user", "craftor"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path='/favourites' element={<Favourites/>}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["craftor"]} />}>
            <Route path="/craftor-profile/:slug" element={<CraftorProfile />} />
            <Route path="/craftor/billing" element={<Billing />} />
            <Route path='/prompts/create' element={<CreatePrompt/>}></Route>
          </Route>

          
          <Route path='/denied' element={<Denied/>}></Route>
          <Route path='*' element={<NotFoundPage/>}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
