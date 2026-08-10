import AuthLayout from '@/widgets/AuthLayout';

import { AuthForm } from '@/widgets';
import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

function LoginPage() {
  return (
    <AuthLayout>
      <div className={styles['login-page']}>
        <div className={styles['login-page__body']}>
          <AuthForm type="login" />
        </div>
        <Button size="sm" className={styles['login-page__button']}>
          Submit
        </Button>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
