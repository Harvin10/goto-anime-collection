/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_DETAIL } from '../GraphQL/Queries';
import { css } from '@emotion/react';
import { Link, useParams } from 'react-router-dom';

function Detail() {
  const [animeData, setAnimeData] = useState({
    id: '',
    title: {
      romaji: '',
      native: ''
    },
    episodes: 0,
    duration: 0,
    genres: [],
    format: '',
    coverImage: {
      color: '',
      medium: ''
    },
    bannerImage: ''
  })

  const detailCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
    `,
    headerWrapper: css`
      position: relative;
    `,
    bannerImage: css`
      width: 100%;
      height: 100px;
      object-fit: cover;
    `,
    bannerColor: (color: string) => css`
      width: 100%;
      height: 100px;
      background-color: ${color};
    `,
    actionWrapper: css`
      display: flex;
      justify-content: end;
      padding: 12px;
    `,
    cover: css`
      position: absolute;
      top: 50px;
      left: 16px;
      z-index: 1;
    `,
    coverBorder: css`
      width: 112px;
      height: 112px;
      border-radius: 50%;
      border: 2px solid lightgray;
      overflow: hidden;
      object-fit: cover;
    `,
    coverImage: css` 
      width: 100%;
      height: 100%;
    `,
    bodyWrapper: css`
      margin: 36px 12px 0;
      padding: 12px;
      background-color: #fff;
      border-radius: 8px;
    `,
    titleRomaji: css`
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 2px;
    `,
    titleNative: css`
      font-size: 12px;
      font-weight: 400;
    `,
    infoWrapper: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 24px;
    `,
    typesWrapper: css`
      display: flex;
    `,
    format: css`
      padding-right: 6px;
      border-right: 1px solid black;
      font-size: 12px;
    `,
    episode: css`
      padding-left: 6px;
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
    `
  }

  const { id: paramId } = useParams()

  const { loading, data } = useQuery(LOAD_ANIME_DETAIL, {
    variables: {
      id: paramId
    }
  });

  useEffect(() => {
    if (data) {
      setAnimeData(data.Media)
    }
  }, [data])



  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60)
    const minute = duration % 60
    let time = ''
    if (hour) time = `${hour}hr`
    return time + `${minute}m`
  }

  const renderEpisodesOrDuration = () => {
    if (!animeData.episodes || animeData.episodes === 1) {
      return <p css={detailCss.episode}>{formatDuration(animeData.duration)}</p>
    } else {
      return <p css={detailCss.episode}>{animeData.episodes} eps</p>
    }
  }

  const renderGenres = () => {
    const genreList = animeData.genres.map((genre, idx) =>
      <p
        key={idx}
        css={detailCss.genre}
      >
        {genre}
      </p>
    )

    return (
      <div css={detailCss.genres}>
        {genreList}
      </div>
    )
  }

  return (
    <div css={detailCss.wrapper}>
      <div css={detailCss.headerWrapper}>
        {animeData.bannerImage
          ? <img
            css={detailCss.bannerImage}
            src={animeData.bannerImage}
            alt={animeData.title.romaji + 'banner'}
          />
          : <div
            css={detailCss.bannerColor(animeData.coverImage.color)}
          />
        }
        <div css={detailCss.actionWrapper}>
          <button>Add to Collection</button>
        </div>
        <div css={detailCss.cover}>
          <div css={detailCss.coverBorder}>
            <img
              css={detailCss.coverImage}
              src={animeData.coverImage.medium}
              alt={animeData.title.romaji + 'cover'}
            />
          </div>
        </div>
      </div>
      <div css={detailCss.bodyWrapper}>
        <div>
          <div>
            <p css={detailCss.titleRomaji}>
              {animeData.title.romaji}
            </p>
            <p css={detailCss.titleNative}>
              {animeData.title.native}
            </p>
          </div>
          <div css={detailCss.infoWrapper}>
            <div css={detailCss.typesWrapper}>
              <p css={detailCss.format}>
                {animeData.format}
              </p>
              {renderEpisodesOrDuration()}
            </div>
            {renderGenres()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
