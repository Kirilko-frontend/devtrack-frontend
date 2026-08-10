import { AuthForm, AuthLayout } from '@/widgets';

import styles from './styles.module.scss';
import { Button } from '@/shared/ui';

function RegisterPage() {
  return (
    <AuthLayout>
      <div className={styles['register-page']}>
        <div className={styles['register-page__body']}>
          <AuthForm type="register" />
        </div>
        <Button size="sm" className={styles['register-page__button']}>
          Submit
        </Button>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
