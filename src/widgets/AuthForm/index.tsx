import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthProvider';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';
import { authService } from '@/services';

import { Button, Input } from '@/shared/ui';

import styles from './styles.module.scss';

type AuthFormType = 'login' | 'register';

type AuthFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthFormErrors = Partial<Record<keyof AuthFormData, string>>;

interface IProps {
  type: AuthFormType;
}

function AuthForm({ type }: IProps) {
  const [form, setForm] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<AuthFormErrors>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const isRegister = type === 'register';

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isRegister) {
      if (!form.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
      confirmPassword: '',
    });

    setErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isRegister) {
        await authService.register({
          email: form.email,
          password: form.password,
        });

        resetForm();
        navigate('/login');

        return;
      }

      await login(form.email, form.password);

      resetForm();
      navigate('/');
    } catch (error) {
      const message = getErrorMessage(error);

      console.error(message);
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
          value={form.email}
          error={errors.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />

        {isRegister && (
          <Input
            label="Confirm password"
            placeholder="Confirm your password"
            type="password"
            value={form.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
