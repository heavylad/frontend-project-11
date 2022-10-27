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
    .catch(() => Promise.reject(new Error('networkError')))
    .then((response) => Promise.resolve(response.data.contents));
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

  const autoUpdatePosts = (id, delay = 5000) => {
    const inner = () => {
      watchedState.feeds.forEach(({ link }) => {
        getContents(link)
          .then(parser)
          .then(({ posts }) => {
            const postsTitles = watchedState.posts.map((post) => post.title);
            const newPosts = posts.filter(({ title }) => !postsTitles.includes(title));
            newPosts.forEach((newPost) => watchedState.posts.unshift({ ...newPost, id }));
          })
          .catch(console.log)
          .finally(setTimeout(inner, delay));
      });
    };
    setTimeout(inner, delay);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    watchedState.process = 'sending';
    validate(url, watchedState.links)
      .then(getContents)
      .then(parser)
      .then((parsedContents) => {
        const { feed, posts } = parsedContents;
        watchedState.links.push(url);
        watchedState.process = 'success';
        const id = getId();
        watchedState.feeds.push({ ...feed, id, link: url });
        const postsWithId = posts.map((post) => ({ ...post, id }));
        watchedState.posts = postsWithId.concat(watchedState.posts);
        autoUpdatePosts(id);
        console.log(watchedState);
      })
      .catch((err) => {
        watchedState.process = 'failed';
        watchedState.errors = err.message ?? 'default';
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
