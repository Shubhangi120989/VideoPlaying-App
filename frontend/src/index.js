import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import {Provider} from "react-redux"
// import { PersistGate } from 'redux-persist/lib/integration/react';
// import { persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
  
      <App />
   
    

    </Provider>
    
  </React.StrictMode>
);
