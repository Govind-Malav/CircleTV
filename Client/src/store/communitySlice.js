// In src/index.js
import { store } from './store';
import { Provider } from 'react-redux';

root.render(
  <Provider store={store}>  {/* Makes store available to all components */}
    <App />
  </Provider>
);