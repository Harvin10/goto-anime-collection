/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';
import Skeleton from './Skeleton';

interface AnimeCardProps {
  data: AnimeData;
  isLoading: Boolean;
}

interface AnimeData {
  episodes: number;
  duration: number;
  format: string;
  genres: string[];
  image: string;
  title: AnimeTitle;
}

interface AnimeTitle {
  romaji: string;
  native: string;
}

function AnimeCard({ data, isLoading }: AnimeCardProps) {
  const animeCardCss = {
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
      object-fit: cover;
      overflow: hidden;
    `,
    infoWrapper: css`
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8px 12px;
      overflow: hidden;
    `,
    titleRomaji: css`
      font-size: 24px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    `,
    titleNative: css`
      font-size: 12px;
      font-weight: 400;
    `,
    typesWrapper: css`
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    `,
    format: css`
      font-size: 12px;
    `,
    episode: css`
      font-size: 12px;
    `,
    genres: css`
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    `,
    genre: css`
      padding: 2px 8px;
      background-color: lightgray;
      font-size: 12px;
      border-radius: 12px;
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

  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60)
    const minute = duration % 60
    let time = ''
    if (hour) time = `${hour}hr`
    return time + `${minute}m`
  }

  const renderEpisodesOrDuration = () => {
    if (data.episodes === 1) {
      return <p css={animeCardCss.episode}>{formatDuration(data.duration)}</p>
    } else {
      return <p css={animeCardCss.episode}>{data.episodes} eps</p>
    }
  }

  const renderGenres = () => {
    const genreList = data.genres.map((genre, idx) =>
      <p
        key={idx}
        css={animeCardCss.genre}
      >
        {genre}
      </p>
    )

    return (
      <div css={animeCardCss.genres}>
        {genreList}
      </div>
    )
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton w="90px" h="130px" />
        <div css={animeCardCss.infoWrapper}>
          <div>
            <div css={animeCardCss.titleRomaji}>
              <Skeleton w="200px" h="24px" rounded />
            </div>
            <Skeleton w="150px" h="12px" rounded />
          </div>
          <div>
            <div css={animeCardCss.typesWrapper}>
              <Skeleton w="50px" h="12px" rounded />
              <Skeleton w="50px" h="12px" rounded />
            </div>
            {renderGenresSkeleton()}
          </div>
        </div>
      </>
    )
  }

  const renderGenresSkeleton = () => {
    const genreSkeletonList = new Array(5).fill('').map((_, idx) => {
      return (
        <Skeleton key={idx} w="50px" h="14px" rounded="14px" />
      )
    })

    return (
      <div css={animeCardCss.genres}>
        {genreSkeletonList}
      </div>
    )
  }

  return (
    <div css={animeCardCss.wrapper}>
      {isLoading ?
        renderSkeleton()
        : <>
          <div css={animeCardCss.image}>
            <img
              src={data.image}
              alt={`${data.title?.romaji} cover`}
            />
          </div>
          <div css={animeCardCss.infoWrapper}>
            <div>
              <p css={animeCardCss.titleRomaji}>
                {data.title?.romaji}
              </p>
              <p css={animeCardCss.titleNative}>
                {data.title?.native}
              </p>
            </div>
            <div>
              <div css={animeCardCss.typesWrapper}>
                <p css={animeCardCss.format}>
                  {data.format}
                </p>
                {renderEpisodesOrDuration()}
              </div>
              {renderGenres()}
            </div>
          </div>
        </>
      }
      <div css={animeCardCss.arrowRightWrapper}>
        <img
          css={animeCardCss.arrowRight}
          src="https://s6.imgcdn.dev/xgJYi.png"
          alt="arrow right"
        />
      </div>
    </div>
  )
}

export default AnimeCard;