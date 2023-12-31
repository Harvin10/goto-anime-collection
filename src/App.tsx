import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { onError } from '@apollo/client/link/error';
import emotionReset from 'emotion-reset';
import { Global, css } from '@emotion/react';
import Home from './Pages/Home';
import Detail from './Pages/Detail';
import Collection from './Pages/Collection';
import CollectionDetail from './Pages/CollectionDetail';
import Navigation from './Components/common/Navigation';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      alert(`graphql error ${message}`)
    })
  }
});

const link = from([
  errorLink,
  new HttpLink({ uri: process.env.REACT_APP_ANILIST_API_URL })
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
});

function App() {
  return (
    <HashRouter>
      <Global styles={css`
        ${emotionReset}
        @font-face {
          font-family: 'Poppins';
          src: url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
        }
        html {
          font-family: 'Poppins', sans-serif;

          a {
            text-decoration: none;
            color: black;
          }
        }
      `} />
      <ApolloProvider client={client}>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />
          <Route path='/home' element={<Home />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/collection/detail/:id' element={<CollectionDetail />} />
        </Routes>
      </ApolloProvider>
    </HashRouter>
  );
}

export default App;
