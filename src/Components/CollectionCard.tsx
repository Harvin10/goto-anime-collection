/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';
import Skeleton from './common/Skeleton';

interface CollectionCardProps {
  data: CollectionData;
  isLoading: Boolean;
}

interface CollectionData {
  id: number;
  title: string;
  image: string
}

function CollectionCard({ data, isLoading }: CollectionCardProps) {
  const collectionCardCss = {
    wrapper: css`
      display: flex;
      border: 2px solid lightgray;
      border-radius: 16px;
      overflow: hidden;
      background-color: white;
    `,
    image: css`
      height: 130px;
      min-width: 90px;
      max-width: 90px;
      object-fit: cover;
      overflow: hidden;
    `,
    titleWrapper: css`
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px;

      p {
        font-size: 24px;
      }
    `,
    arrowRightWrapper: css`
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 8px;
      padding-left: 6px;
      border-left: .5px solid lightgray;
    `,
    arrowRight: css`
      height: 16px;
    `
  };

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton w="90px" h="130px" />
        <div css={collectionCardCss.titleWrapper}>
          <Skeleton w="120px" h="24px" rounded />
        </div>
      </>
    )
  }

  return (
    <div css={collectionCardCss.wrapper}>
      {isLoading ?
        renderSkeleton()
        : <>
          <div css={collectionCardCss.image}>
            <img
              src={data.image}
              alt=""
            />
          </div>
          <div css={collectionCardCss.titleWrapper}>
            <p>
              {data.title}
            </p>
          </div>
        </>
      }
      <div css={collectionCardCss.arrowRightWrapper}>
        <img
          css={collectionCardCss.arrowRight}
          src="https://s6.imgcdn.dev/xgJYi.png"
          alt="arrow right"
        />
      </div>
    </div>
  )
}

export default CollectionCard;