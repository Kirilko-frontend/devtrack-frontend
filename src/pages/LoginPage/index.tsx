import AuthLayout from '@/widgets/AuthLayout';
import AuthForm from '@/widgets/AuthForm';

import styles from './styles.module.scss';

function LoginPage() {
  return (
    <AuthLayout>
      <div className={styles['login-page']}>
        <div className={styles['login-page__body']}>
          <AuthForm />
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
