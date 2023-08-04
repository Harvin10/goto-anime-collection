/** @jsxImportSource @emotion/react */

import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { LOAD_ANIME_DETAIL } from '../GraphQL/Queries';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import ModalCollectionList from '../Components/ModalCollectionList';
import Skeleton from '../Components/common/Skeleton';
import { Link } from 'react-router-dom';

interface localStorageType {
  [key: string]: collectionType;
}

interface collectionType {
  [key: string]: boolean;
}

function Detail() {
  const [animeData, setAnimeData] = useState({
    id: '',
    bannerImage: '',
    coverImage: {
      color: '',
      medium: ''
    },
    description: '',
    duration: 0,
    episodes: 0,
    format: '',
    genres: [],
    title: {
      romaji: '',
      native: ''
    },
  })
  const [isShowCollectionModal, setShowCollectionModal] = useState(false)
  const [lsAnimesData, setLsAnimesData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [isLsUpdated, setLsUpdated] = useState(false)

  const detailCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
      padding-bottom: 12px;
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
    bodyInfoWrapper: css`
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
    `,
    bodyDescWrapper: css`
      min-height: 100px;
      margin: 12px;
      padding: 12px;
      background-color: #fff;
      border-radius: 8px;
    `,
    description: css`
      font-weight: 600;
      margin-bottom: 16px;
    `,
    bodyDescSkeleton: css`
      > *:not(:last-child) {
        margin-bottom: 6px;
      }
    `,
    firstParagraphSkeleton: css`
      margin-bottom: 20px;
    `,
    bodyCollectionWrapper: css`
      margin: 12px 12px 0;
      padding: 12px;
      background-color: #fff;
      border-radius: 8px;
    `,
    collections: css`
      
    `,
    collection: css`
      
    `
  }

  const descriptionRef = useRef<HTMLDivElement>(null)
  const { id: paramId } = useParams()

  const { loading, data } = useQuery(LOAD_ANIME_DETAIL, {
    variables: {
      id: paramId
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [paramId])

  useEffect(() => {
    if (data) {
      setAnimeData(data.Media)
    }
  }, [data])

  useEffect(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = animeData.description;
  }, [descriptionRef, animeData.description])

  useEffect(() => {
    setLsAnimesData(JSON.parse(localStorage.getItem('animes') || "{}"))
    setLsUpdated(false)
  }, [isLsUpdated])

  useEffect(() => {
    if (!isShowCollectionModal) setLsUpdated(true)
  }, [isShowCollectionModal])

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

  const renderCollections = () => {
    if (paramId && Object.keys(lsAnimesData).length) {
      if (lsAnimesData[paramId]) {
        const collectionList = Object.keys(lsAnimesData[paramId]).map((collection, idx) => {
          const routes = '/collection/detail/' + collection
          return (
            <Link
              to={routes}
              key={idx}
            >
              <p css={detailCss.collection}>
                {collection}
              </p>
            </Link>
          )
        })

        return (
          <div css={detailCss.collections}>
            {collectionList}
          </div>
        )
      }
      return <p>No collection yet...</p>
    }
  }

  const renderHeaderSkeleton = () => {
    return (
      <>
        <Skeleton w="100%" h="100px" />
        <div css={detailCss.actionWrapper}>
          <button onClick={() => setShowCollectionModal(true)}>
            Add to Collection
          </button>
        </div>
        <div css={detailCss.cover}>
          <div css={detailCss.coverBorder}>
            <Skeleton w="100%" h="100%" rounded="50%" />
          </div>
        </div>
      </>
    )
  }

  const renderBodyInfoSkeleton = () => {
    return (
      <>
        <div>
          <div css={detailCss.titleRomaji}>
            <Skeleton w="175px" h="24px" rounded />
          </div>
          <Skeleton w="120px" h="12px" rounded />
        </div>
        <div css={detailCss.infoWrapper}>
          <div css={detailCss.typesWrapper}>
            <div css={detailCss.format}>
              <Skeleton w="50px" h="12px" rounded />
            </div>
            <div css={detailCss.episode}>
              <Skeleton w="50px" h="12px" rounded />
            </div>
          </div>
          {renderGenresSkeleton()}
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
      <div css={detailCss.genres}>
        {genreSkeletonList}
      </div>
    )
  }

  const renderBodyDescSkeleton = () => {
    return <>
      <div css={[detailCss.bodyDescSkeleton, detailCss.firstParagraphSkeleton]}>
        <Skeleton w="65%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
      </div>
      <div css={detailCss.bodyDescSkeleton}>
        <Skeleton w="65%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
      </div>
    </>
  }

  const renderBodyCollectionSkeleton = () => {
    return <>
      <div css={[detailCss.bodyDescSkeleton, detailCss.firstParagraphSkeleton]}>
        <Skeleton w="65%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
      </div>
      <div css={detailCss.bodyDescSkeleton}>
        <Skeleton w="65%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
        <Skeleton w="95%" h="16px" rounded />
      </div>
    </>
  }

  return (
    <>
      <div css={detailCss.wrapper}>
        <div css={detailCss.headerWrapper}>
          {
            loading
              ? renderHeaderSkeleton()
              : <>
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
                  <button onClick={() => setShowCollectionModal(true)}>
                    Add to Collection
                  </button>
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
              </>
          }
        </div>
        <div css={detailCss.bodyInfoWrapper}>
          {
            loading
              ? renderBodyInfoSkeleton()
              : <>
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
              </>
          }
        </div>
        <div
          css={detailCss.bodyDescWrapper}
        >
          <p css={detailCss.description}>Description</p>
          {
            loading
              ? renderBodyDescSkeleton()
              : <div ref={descriptionRef}>
                {animeData.description}
              </div>
          }
        </div>
        <div css={detailCss.bodyCollectionWrapper}>
          <p css={detailCss.description}>Collections</p>
          {
            loading
              ? renderBodyCollectionSkeleton()
              : renderCollections()
          }
        </div>
      </div>
      <ModalCollectionList
        isShowModal={isShowCollectionModal}
        animeId={paramId || ''}
        onCloseModal={() => setShowCollectionModal(false)}
      />
    </>
  );
}

export default Detail;
