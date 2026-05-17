import { useEffect } from 'react';
import { useNavigate, redirect } from 'react-router';

export function loader() {
  return redirect('/admin');
}

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin', { replace: true });
  }, [navigate]);

  return null;
}


