import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';
// import axios from 'axios';

import render from './render';
import resources from '../locales/resources';

export default () => {
  yup.setLocale({
    mixed: {
      notOneOf: 'alreadyExists',
    },
    string: {
      url: 'invalidUrl',
    },
  });

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
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

      const watchedState = onChange(state, render(elements, i18nextInstance));

      const validate = (url) => {
        const schema = yup
          .string()
          .required()
          .url()
          .notOneOf(watchedState.feeds);
        return schema.validate(url);
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.process = 'sending';
        const formData = new FormData(e.target);
        const url = formData.get('url');

        validate(url)
          .then((validUrl) => {
            // watchedState.process = 'validated';
            watchedState.errors = '';
            watchedState.feeds.push(validUrl);
            console.log(watchedState);
          })
          .catch((err) => {
            // watchedState.process = 'failed';
            watchedState.errors = err.message;
            console.log(watchedState);
          });
      });
    });
};
