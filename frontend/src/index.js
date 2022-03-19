import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from "react-router-dom";
import ChatProvider from './Context/ChatProvider';

const theme = extendTheme({
  colors: {
    custom: {
    100: "#6749DC"
    }
  }
})


ReactDOM.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
          <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
