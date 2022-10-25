import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import render from './render';
import resources from '../locales/resources';
import parser from './parser';

const validate = (url, links) => {
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(links);
  return schema.validate(url);
};

const getContents = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app';
  const link = new URL('/get', allOriginsLink);
  link.searchParams.set('disableCache', 'true');
  link.searchParams.set('url', url);
  return axios.get(link)
    .then((response) => response.data.contents)
    .catch(() => new Error('networkError'));
  // .catch(() => Promise.reject(new Error('networkError')))
  // .then((response) => Promise.resolve(response.data.contents));
};

let counter = 0;
const getId = () => {
  counter += 1;
  return counter;
};

export default () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      yup.setLocale({
        mixed: {
          default: 'default',
          notOneOf: 'alreadyExists',
        },
        string: {
          url: 'invalidUrl',
        },
      });
    });

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const state = {
    process: 'filling',
    errors: '',
    feeds: [],
    posts: [],
    links: [],
    readPosts: [],
  };

  const watchedState = onChange(state, render(elements, i18nextInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    watchedState.process = 'sending';
    validate(url, watchedState.links)
      .then((validUrl) => {
        watchedState.links.push(validUrl);
        return getContents(validUrl);
      })
      .then((content) => parser(content))
      .then((parsedContents) => {
        const { feed, posts } = parsedContents;
        watchedState.process = 'success';
        const id = getId();
        watchedState.feeds.push({ ...feed, id });
        posts.forEach((post) => watchedState.posts.push({ ...post, id }));
        console.log(watchedState.posts);
      })
      .catch((err) => {
        watchedState.process = 'failed';
        watchedState.errors = err.message;
        console.log(watchedState);
      })
      .finally(() => {
        watchedState.process = 'filling';
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    const readPostLink = target.href;
    if (!watchedState.readPosts.includes(readPostLink)) {
      watchedState.readPosts.push(readPostLink);
    }
  });
};
