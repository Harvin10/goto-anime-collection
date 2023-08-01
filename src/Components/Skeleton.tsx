/** @jsxImportSource @emotion/react */

import React from 'react';
import { css, keyframes } from '@emotion/react';

interface SkeletonProps {
  h: string;
  w: string;
}

function Skeleton(props: SkeletonProps) {
  const shimmer = keyframes`
    100% {
      transform: translateX(100%);
    }
  `;

  const skeletonCss = css`
    display: inline-block;
    height: ${props.h};
    width: ${props.w};
    position: relative;
    overflow: hidden;
    background-color: #DDDBDD;
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background: 
        linear-gradient(90deg, 
          rgba(255, 255, 255, 0) 0%, 
          rgba(255, 255, 255, 0.3) 40%, 
          rgba(255, 255, 255, 0.5) 60%, 
          rgba(255, 255, 255, 0) 100%);
      animation: ${shimmer} 5s infinite;
      content: '';
    }
  `;

  return (
    <div css={skeletonCss} />
  )
}

export default Skeleton;