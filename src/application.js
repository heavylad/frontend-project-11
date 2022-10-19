import onChange from 'on-change';
import * as yup from 'yup';
// import axios from 'axios';
import render from './render';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
  };

  const state = {
    process: 'filling',
    errors: '',
    feeds: [],
  };

  const watchedState = onChange(state, render(elements));

  const validate = (url) => {
    const schema = yup.string().required().url().notOneOf(watchedState.feeds);
    return schema.validate(url);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.process = 'sending';
    const formData = new FormData(e.target);
    const url = formData.get('url');

    validate(url)
      .then((validUrl) => {
        watchedState.process = 'validated';
        watchedState.feeds.push(validUrl);
        watchedState.errors = '';
        console.log(watchedState);
      })
      .catch((err) => {
        watchedState.process = 'failed';
        watchedState.errors = err.message;
        console.log(err.message);
        console.log(watchedState);
      });
  });
};
