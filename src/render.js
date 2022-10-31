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

const setAttributes = (el, options) => {
  Object.keys(options).forEach((attr) => {
    el.setAttribute(attr, options[attr]);
  });
};

const renderPosts = (elements, value, i18nextInstance, state) => {
  const { posts } = elements;
  posts.innerHTML = '';
  const card = makeContainer();
  posts.append(card);
  const cardTitle = card.querySelector('h2');
  cardTitle.textContent = i18nextInstance.t('posts');
  const listGroup = card.querySelector('ul');
  value.forEach(({ title, link, feedId }) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    listGroup.append(listGroupItem);
    const linkEl = document.createElement('a');
    setAttributes(linkEl, {
      href: link, target: '_blank', rel: 'noopener noreferrer', 'data-id': feedId,
    });
    const fontWeightClass = state.readPostsLinks.includes(link) ? 'fw-normal' : 'fw-bold';
    linkEl.classList.add(fontWeightClass);
    linkEl.textContent = title;
    const buttonEl = document.createElement('button');
    setAttributes(buttonEl, {
      type: 'button', 'data-id': '2', 'data-bs-toggle': 'modal', 'data-bs-target': '#modal',
    });
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.textContent = i18nextInstance.t('preview');
    listGroupItem.append(linkEl, buttonEl);
  });
};

const renderReadPosts = (elements, value) => {
  elements.posts.querySelectorAll('a').forEach((item) => {
    if (value.includes(item.href)) {
      item.classList.replace('fw-bold', 'fw-normal');
    }
  });
};

const renderModalWindow = (elements, value) => {
  const { title, body, button } = elements.modal;
  title.textContent = value.title;
  body.textContent = value.description;
  button.href = value.link;
};

export default (elements, i18nextInstance, state) => (path, value) => {
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
      renderPosts(elements, value, i18nextInstance, state);
      break;

    case 'readPostsLinks':
      renderReadPosts(elements, value);
      break;

    case 'modal':
      renderModalWindow(elements, value);
      break;

    default:
      break;
  }
};
