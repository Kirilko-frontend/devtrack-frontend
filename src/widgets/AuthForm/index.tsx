import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthProvider';
import { authService } from '@/services/auth.service';

import { Button, Input } from '@/shared/ui';
import styles from './styles.module.scss';

type AuthFormType = 'login' | 'register';

interface IProps {
  type: AuthFormType;
}

function AuthForm({ type }: IProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegister = type === 'register';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegister && password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      if (isRegister) {
        const response = await authService.register({
          email,
          password,
        });

        console.log('Register response:', response);

        resetForm();
        navigate('/login');

        return;
      }

      await login(email, password);

      resetForm();
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className={styles['auth-form']}>
      <h1 className={styles['auth-form__title']}>
        {isRegister ? 'Create your DevTrack account' : 'Hello, welcome back to DevTrack'}
      </h1>

      <form className={styles['auth-form__form']} onSubmit={handleSubmit}>
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister && (
          <Input
            label="Confirm password"
            placeholder="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <Button type="submit" size="lg" className={styles['auth-form__button']}>
          {isRegister ? 'Create account' : 'Log in'}
        </Button>
      </form>
      <div className={styles['auth-form__switch']}>
        <p className={styles['auth-form__switch-text']}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
        </p>

        <Link className={styles['auth-form__switch-link']} to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Log in' : 'Sign up'}
        </Link>
      </div>
    </div>
  );
}

export default AuthForm;
