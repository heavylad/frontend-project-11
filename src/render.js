const renderErrors = (elements, value, i18nextInstance) => {
  const { input, feedback } = elements;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = i18nextInstance.t(`errors.${value}`);
};

const renderProcess = (elements, value, i18nextInstance) => {
  switch (value) {
    case 'success':
      // eslint-disable-next-line no-case-declarations
      const { button, input, feedback } = elements;
      button.disabled = false;
      input.classList.remove('is-invalid');
      input.value = '';
      input.focus();
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nextInstance.t(`${value}`);
      break;

    case 'filling':
      elements.button.disabled = false;
      break;

    case 'sending':
      elements.button.disabled = true;
      break;

    default:
      break;
  }
};

const makeContainer = () => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.append(cardBody);
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  cardBody.append(cardTitle, listGroup);
  return card;
};

const renderFeeds = (elements, value, i18nextInstance) => {
  const { feeds } = elements;
  feeds.innerHTML = '';
  const card = makeContainer();
  feeds.append(card);
  const cardTitle = card.querySelector('h2');
  cardTitle.textContent = i18nextInstance.t('feeds');
  const listGroup = card.querySelector('ul');
  value.forEach(({ title, description }) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    listGroup.prepend(listGroupItem);
    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    listGroupItem.append(titleEl, descriptionEl);
    titleEl.textContent = title;
    descriptionEl.textContent = description;
  });
};

const renderPosts = (elements, value, i18nextInstance) => {
  const { posts } = elements;
  posts.innerHTML = '';
  const card = makeContainer();
  posts.append(card);
  const cardTitle = card.querySelector('h2');
  cardTitle.textContent = i18nextInstance.t('posts');
  const listGroup = card.querySelector('ul');
  value.forEach(({ title, link, id }) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    listGroup.append(listGroupItem);
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', link);
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener noreferrer');
    linkEl.setAttribute('data-id', id);
    linkEl.classList.add('fw-bold');
    linkEl.textContent = title;
    listGroupItem.append(linkEl);
  });
};

const renderReadPosts = (elements, value) => {
  elements.posts.querySelectorAll('a').forEach((item) => {
    if (value.includes(item.href)) {
      item.classList.replace('fw-bold', 'fw-normal');
    }
  });
};

export default (elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'errors':
      renderErrors(elements, value, i18nextInstance);
      break;

    case 'process':
      renderProcess(elements, value, i18nextInstance);
      break;

    case 'feeds':
      renderFeeds(elements, value, i18nextInstance);
      break;

    case 'posts':
      renderPosts(elements, value, i18nextInstance);
      break;

    case 'readPosts':
      renderReadPosts(elements, value);
      break;

    default:
      break;
  }
};
