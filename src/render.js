export default (elements) => (path, currentValue) => {
  switch (path) {
    case 'process':
      if (currentValue === 'validated') {
        elements.feedback.textContent = currentValue;
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.form.reset();
        elements.input.focus();
      }
      break;

    case 'errors':
      if (currentValue.includes('this must be a valid URL')) {
        elements.feedback.textContent = currentValue;
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      }
      if (currentValue.includes('this must not be one of the following values')) {
        elements.feedback.textContent = currentValue;
        elements.input.classList.add('is-invalid');
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
      }
      break;

    default:
      break;
  }
};
