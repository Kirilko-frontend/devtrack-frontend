import { AuthLayout, PasswordResetForm } from '@/widgets';

import styles from './styles.module.scss';

function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className={styles['forgot-password-page']}>
        <PasswordResetForm mode="request" />
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
