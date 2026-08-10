import { Input } from '@/shared/ui';

import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

type AuthFormType = 'login' | 'register';

interface IProps {
  type: AuthFormType;
}

function AuthForm({ type }: IProps) {
  const isRegister = type === 'register';

  return (
    <div className={styles['auth-form']}>
      <h1 className={styles['auth-form__title']}>
        {isRegister ? 'Create your DevTrack account' : 'Hello, welcome back to DevTrack'}
      </h1>

      <form className={styles['auth-form__form']}>
        <Input label="Email" placeholder="Enter your email" type="email" />

        <Input label="Password" placeholder="Enter your password" type="password" />

        {isRegister && (
          <Input label="Confirm password" placeholder="Confirm your password" type="password" />
        )}
      </form>
      <div>
        <p>{isRegister && 'Have account?'}</p>
        <Link to={'/login'}>{isRegister && 'Sign up'}</Link>
      </div>
    </div>
  );
}

export default AuthForm;
