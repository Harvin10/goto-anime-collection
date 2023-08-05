/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { css } from '@emotion/react';
import Skeleton from './common/Skeleton';
import ModalRemoveAnime from './ModalRemoveAnime';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  data: AnimeData;
  isLoading: Boolean;
  option?: {
    collectionId?: string;
  }
  routes: string;
  refetchParent?: () => void;
}

interface AnimeData {
  id: number;
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

function AnimeCard({ data, isLoading, option, routes, refetchParent }: AnimeCardProps) {
  const animeCardCss = {
    wrapper: css`
      display: flex;
      border: 2px solid lightgray;
      border-radius: 16px;
      overflow: hidden;
      background-color: white;
      position: relative;
    `,
    image: css`
      height: 130px;
      min-width: 90px;
      max-width: 90px;
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
    `,
    arrowRight: css`
      height: 16px;
    `,
    optionWrapper: css`
      display: flex;
      justify-content: center;
      align-items: start;
      padding: 8px;
    `,
    option: css`
      height: 24px;
    `,
    optionModalShow: css`
      display: block;
    `,
    optionModalHide: css`
      display: none;
    `,
    optionModal: css`
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 4px;
      padding: 8px;
      border: 1px solid #888888;
      border-radius: 4px;
      position: absolute;
      top: 32px;
      right: 8px;

      p {
        padding: 2px;
      }
    `,
  };

  const [showOptionModal, setOptionModal] = useState(false)
  const [showRemoveModal, setRemoveModal] = useState(false)

  const onRemoveCollection = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    setRemoveModal(true)
  }

  const openOption = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setOptionModal(!showOptionModal)
  }

  const onCloseRemoveModal = () => {
    refetchParent?.()
    setRemoveModal(false)
    setOptionModal(false)
  }

  const formatDuration = (duration: number) => {
    const hour = Math.floor(duration / 60)
    const minute = duration % 60
    let time = ''
    if (hour) time = `${hour}hr`
    return time + `${minute}m`
  }

  const renderEpisodesOrDuration = () => {
    if (!data.episodes || data.episodes === 1) {
      return <p css={animeCardCss.episode}>{formatDuration(data.duration)}</p>
    } else {
      return <p css={animeCardCss.episode}>{data.episodes} eps</p>
    }
  }

  const renderGenres = () => {
    const genreList = data.genres.slice(0, 4).map((genre, idx) => {
      return <p
        key={idx}
        css={animeCardCss.genre}
      >
        {idx === 3 ? '...' : genre}
      </p>
    })

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
              <Skeleton w="175px" h="24px" rounded />
            </div>
            <Skeleton w="120px" h="12px" rounded />
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
    const genreSkeletonList = new Array(3).fill('').map((_, idx) => {
      return (
        <Skeleton
          key={idx}
          w="50px"
          h="14px"
          rounded="14px"
        />
      )
    })

    return (
      <div css={animeCardCss.genres}>
        {genreSkeletonList}
      </div>
    )
  }

  return (
    <>
      <Link to={routes} css={animeCardCss.wrapper}>
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
        {option
          ? <>
            <div
              css={animeCardCss.optionWrapper}
              onClick={openOption}
            >
              <img
                css={animeCardCss.option}
                src="https://s6.imgcdn.dev/xpbBn.png"
                alt="more option"
              />
            </div>
            <div
              css={[
                showOptionModal ? animeCardCss.optionModalShow : animeCardCss.optionModalHide
              ]}
              onClick={(e) => e.preventDefault()}
            >
              <div css={animeCardCss.optionModal}>
                <p onClick={onRemoveCollection}>remove</p>
              </div>
            </div>
          </>
          : <div css={animeCardCss.arrowRightWrapper}>
            <img
              css={animeCardCss.arrowRight}
              src="https://s6.imgcdn.dev/xgJYi.png"
              alt="arrow right"
            />
          </div>
        }
      </Link>
      {!option?.collectionId
        ? null
        : <ModalRemoveAnime
          isShowModal={showRemoveModal}
          animeId={JSON.stringify(data.id)}
          collectionId={option.collectionId}
          onCloseModal={onCloseRemoveModal}
        />

      }
    </>
  )
}

export default AnimeCard;