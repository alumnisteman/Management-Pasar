import { useEffect } from 'react';
import { useNavigate, redirect } from 'react-router';

export function loader() {
  return redirect('/login');
}

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}

