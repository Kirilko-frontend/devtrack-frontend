import AuthLayout from '@/widgets/AuthLayout';

import { AuthForm } from '@/widgets';

import styles from './styles.module.scss';

function LoginPage() {
  return (
    <AuthLayout>
      <div className={styles['login-page']}>
        <div className={styles['login-page__body']}>
          <AuthForm type="login" />
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
