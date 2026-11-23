import { Toaster } from 'sonner';

import AppRouter from './router/AppRouter';

function App() {
  return (
    <>
      <AppRouter />
      {/* Toasts are rendered by shared/ui/Toast via notify(); each one runs its own timer. */}
      <Toaster position="top-right" theme="dark" expand visibleToasts={4} gap={10} />
    </>
  );
}

export default App;
