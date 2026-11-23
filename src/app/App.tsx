import { Toaster } from 'sonner';

import AppRouter from './router/AppRouter';

import styles from './styles.module.scss';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        theme="dark"
        // Keep in sync with $toast-duration in app/styles.module.scss (timer bar).
        duration={4000}
        closeButton
        className={styles['toaster']}
        toastOptions={{
          className: styles['toast'],
        }}
      />
    </>
  );
}

export default App;
