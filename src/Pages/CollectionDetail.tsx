/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useLazyQuery } from '@apollo/client';
import { LOAD_ANIME_LIST } from '../GraphQL/Queries';
import { useParams } from 'react-router-dom';
import AnimeCard from '../Components/AnimeCard';

interface localStorageType {
  [key: string]: collectionType;
}

interface collectionType {
  [key: string]: boolean;
}

function CollectionDetail() {
  const collectionDetailCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  }

  const { id: paramId } = useParams<{ id: string }>()

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [isLsUpdated, setLsUpdated] = useState(false)

  const [animeList, setAnimeList] = useState(new Array(5).fill(''))
  const [paramSearch, setParamSearch]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState([0])

  const [isEmptyState, setEmptyState] = useState(false)

  const [getAnimeList, { loading, data }] = useLazyQuery(LOAD_ANIME_LIST);

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsUpdated(false)
  }, [isLsUpdated])

  useEffect(() => {
    if (paramSearch.length > 0 && paramSearch[0] !== 0) {
      getAnimeList({ variables: { search: paramSearch } })
      setEmptyState(false)
    } else if (paramSearch[0] !== 0) {
      setEmptyState(true)
    }
  }, [lsCollectionsData, paramSearch, getAnimeList])

  useEffect(() => {
    if (paramId && Object.keys(lsCollectionsData).length) {
      setParamSearch(Object.keys(lsCollectionsData[paramId]).map((val) => parseInt(val)))
    }
  }, [lsCollectionsData, paramId])

  useEffect(() => {
    if (data) {
      const { media } = data.Page;
      setAnimeList(media)
    }
  }, [data])

  const renderAnimeList = () => {
    return animeList.map((anime, idx) => {
      const {
        id,
        coverImage,
        episodes,
        duration,
        format,
        genres,
        title
      } = anime;

      const routes = '/detail/' + id

      return (
        <AnimeCard
          key={idx}
          data={{
            id,
            episodes,
            duration,
            format,
            genres: genres || [],
            image: coverImage?.medium,
            title: title,
          }}
          isLoading={loading || !animeList[0]}
          option={{
            collectionId: paramId
          }}
          routes={routes}
          refetchParent={() => setLsUpdated(true)}
        />
      )
    })
  }

  return (
    <div css={collectionDetailCss.wrapper}>
      {!isEmptyState
        ? renderAnimeList()
        : <p>
          No anime in this collection yet...
        </p>
      }
    </div>
  );
}

export default CollectionDetail;
