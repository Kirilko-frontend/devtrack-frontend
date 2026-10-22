import Button from '../Button';

import styles from './styles.module.scss';

interface IProps {
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  onCancel: () => void;
  submitText?: string;
  submittingText?: string;
}

function ActionButtons({
  isSubmitting,
  isSubmitDisabled,
  onCancel,
  submitText = 'Save',
  submittingText = 'Saving...',
}: IProps) {
  return (
    <div className={styles['actions-buttons']}>
      <Button
        className={styles['actions-button__cancel']}
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>

      <Button
        className={styles['actions-button__submit']}
        type="submit"
        variant="accent"
        disabled={isSubmitDisabled || isSubmitting}
      >
        {isSubmitting ? submittingText : submitText}
      </Button>
    </div>
  );
}

export default ActionButtons;
