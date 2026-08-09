import { AuthForm, AuthLayout } from '@/widgets';

import styles from './styles.module.scss';

function RegisterPage() {
  return (
    <AuthLayout>
      <div className={styles['register-page']}>
        <div className={styles['register-page__body']}>
          <AuthForm type="register" />
        </div>
      </div>
    </AuthLayout>
  );
}

export default RegisterPage;
