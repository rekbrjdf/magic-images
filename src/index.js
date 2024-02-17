import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-vkminiapps';
import structure from './routing/structure.ts';
import App from './App';
import store from './redux/store';

// Init VK Mini App
bridge.send('VKWebAppInit');

ReactDOM.render(
  <Provider store={store}>
    <RouterProvider structure={structure}>
      <App />
    </RouterProvider>
  </Provider>,
  document.getElementById('root'),
);
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-unused-vars
  import('./eruda').then(({ default: eruda }) => {}); // runtime download
}
