import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../features/user/userSlice';
import type { AppDispatch } from '../../store';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    if (token) {
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      dispatch(fetchCurrentUser()).then((res: any) => {
        if (res.meta && res.meta.requestStatus === 'fulfilled') {
          navigate('/');
        } else {
          // If fetchCurrentUser fails, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      });
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return null;
};

export default GoogleAuthSuccess;