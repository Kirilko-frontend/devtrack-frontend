import { useSearchParams } from 'react-router-dom';

import { AuthLayout, PasswordResetForm } from '@/widgets';

import styles from './styles.module.scss';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  return (
    <AuthLayout>
      <div className={styles['reset-password-page']}>
        <PasswordResetForm mode="reset" token={searchParams.get('token')} />
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
