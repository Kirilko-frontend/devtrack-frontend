import Input from '@/shared/ui/Input';

import styles from './styles.module.scss';

function AuthForm() {
  return (
    <div className={styles['auth-form']}>
      <h1 className={styles['auth-form__title']}>Hello welcome back to DevTrack</h1>
      <form className={styles['auth-form__form']}>
        <Input label="Name" placeholder="Enter your name" />
        <Input label="Password" placeholder="Enter yout password" />
      </form>
    </div>
  );
}

export default AuthForm;
