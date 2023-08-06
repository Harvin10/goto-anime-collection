/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const navigationCss = {
    wrapper: css`
      margin-bottom: 44px;
    `,
    navigationWrapper: css`
      background-color: black;
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 10px;
      position: fixed;
      top: 0;
      z-index: 2000;
    `,
    link: css`
      padding: 4px 8px;
      color: white;
    `,
    current: css`
      color: lightblue;
    `,
  };

  const { pathname } = useLocation()

  return (
    <div css={navigationCss.wrapper}>
      <div css={navigationCss.navigationWrapper}>
        <Link
          to='/'
          css={[
            navigationCss.link,
            pathname === '/' ? navigationCss.current : ''
          ]}
        >Home
        </Link>
        <Link
          to='/collection'
          css={[
            navigationCss.link,
            pathname === '/collection' ? navigationCss.current : ''
          ]}
        >
          Collection
        </Link>
      </div>
    </div>
  )
}

export default Navigation;