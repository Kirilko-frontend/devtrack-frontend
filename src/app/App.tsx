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
        richColors
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
