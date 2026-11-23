import type { FormEvent } from 'react';
import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { authService } from '@/services';
import { Button, Input } from '@/shared/ui';
import { getErrorMessage, notify } from '@/shared/utils';

import authFormStyles from '../AuthForm/styles.module.scss';
import styles from './styles.module.scss';

type PasswordResetFormProps = { mode: 'request' } | { mode: 'reset'; token: string | null };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RequestLinkForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword(trimmedEmail);
      setSentTo(trimmedEmail);
    } catch (submitError) {
      notify.error('Could not send reset link', getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <>
        <p className={styles['password-reset__text']}>
          If an account with <strong>{sentTo}</strong> exists, we&apos;ve sent a link to reset your
          password. Check your inbox and spam folder.
        </p>

        <Button
          type="button"
          size="lg"
          className={authFormStyles['auth-form__button']}
          onClick={() => setSentTo('')}
        >
          Send again
        </Button>
      </>
    );
  }

  return (
    <form className={authFormStyles['auth-form__form']} onSubmit={handleSubmit} noValidate>
      <p className={styles['password-reset__text']}>
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      <Input
        placeholder="Enter your email"
        type="email"
        autoComplete="email"
        value={email}
        error={error}
        onChange={(event) => {
          setEmail(event.target.value);
          setError('');
        }}
      />

      <Button
        type="submit"
        size="lg"
        className={authFormStyles['auth-form__button']}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>
    </form>
  );
}

function SetNewPasswordForm({ token }: { token: string | null }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLinkInvalid, setIsLinkInvalid] = useState(!token);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !token) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword({ token, password });

      notify.updated('Password changed', 'Log in with your new password.');
      navigate('/login', { replace: true });
    } catch (submitError) {
      const isBadRequest =
        typeof submitError === 'object' &&
        submitError !== null &&
        'status' in submitError &&
        submitError.status === 400;

      if (isBadRequest) {
        setIsLinkInvalid(true);
      }

      notify.error('Could not change password', getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLinkInvalid) {
    return (
      <>
        <p className={styles['password-reset__text']}>
          This reset link is invalid or has expired. Request a new one to continue.
        </p>

        <Button
          type="button"
          size="lg"
          className={authFormStyles['auth-form__button']}
          onClick={() => navigate('/forgot-password')}
        >
          Request new link
        </Button>
      </>
    );
  }

  return (
    <form className={authFormStyles['auth-form__form']} onSubmit={handleSubmit} noValidate>
      <Input
        placeholder="New password"
        type="password"
        autoComplete="new-password"
        value={password}
        error={errors.password}
        onChange={(event) => {
          setPassword(event.target.value);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
      />

      <Input
        placeholder="Confirm new password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        error={errors.confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
      />

      <Button
        type="submit"
        size="lg"
        className={authFormStyles['auth-form__button']}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Set new password'}
      </Button>
    </form>
  );
}

function PasswordResetForm(props: PasswordResetFormProps) {
  return (
    <div className={authFormStyles['auth-form']}>
      <h1 className={authFormStyles['auth-form__title']}>
        {props.mode === 'request' ? 'Forgot your password?' : 'Set a new password'}
      </h1>

      {props.mode === 'request' ? <RequestLinkForm /> : <SetNewPasswordForm token={props.token} />}

      <div className={authFormStyles['auth-form__switch']}>
        <p className={authFormStyles['auth-form__switch-text']}>Remembered it?</p>

        <Link className={authFormStyles['auth-form__switch-link']} to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default PasswordResetForm;
