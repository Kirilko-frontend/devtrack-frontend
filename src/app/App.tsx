import { useEffect } from 'react';

import { authService } from '@/services/auth.service';

function App() {
  useEffect(() => {
    authService
      .me()
      .then((user) => {
        console.log('Authenticated user:', user);
      })
      .catch((error) => {
        if (error.status === 401) {
          console.log('User is not authenticated');
          return;
        }

        console.error('Auth error:', error);
      });
  }, []);

  return <div>DevTrack</div>;
}

export default App;
