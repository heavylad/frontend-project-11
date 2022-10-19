const renderErrors = (elements, currentValue, i18nextInstance) => {
  const { input, feedback } = elements;
  if (!currentValue) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    // форма не очищается при первой отправке (потом при загрузке?!)
    input.value = '';
    input.focus();
    return;
  }
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  feedback.textContent = i18nextInstance.t(`errors.${currentValue}`);
};

export default (elements, i18nextInstance) => (path, currentValue) => {
  switch (path) {
    case 'errors':
      renderErrors(elements, currentValue, i18nextInstance);
      break;

    default:
      break;
  }
};
