import React from 'react';
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
    <>
      <Global styles={css`${emotionReset}`} />
      <ApolloProvider client={client}>
        <Home />
      </ApolloProvider>
    </>
  );
}

export default App;
