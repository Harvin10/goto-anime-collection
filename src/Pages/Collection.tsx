/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { LOAD_ANIME_LIST_BANNER } from '../GraphQL/Queries';
import CollectionCard from '../Components/CollectionCard';

interface localStorageType {
  [key: string]: collectionType;
}

interface collectionType {
  [key: string]: boolean;
}

function Collection() {
  const CollectionCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
      padding: 16px;
    `,
    collectionListWrapper: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [isLsUpdated, setLsUpdated] = useState(false)

  const [animeList, setAnimeList] = useState([{ id: 0, coverImage: { medium: '' } }])
  const [paramSearch, setParamSearch]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState([0])

  const [getAnimeList, { loading, data }] = useLazyQuery(LOAD_ANIME_LIST_BANNER);

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsUpdated(false)
  }, [isLsUpdated])

  useEffect(() => {
    if (paramSearch.length > 0 && paramSearch[0] !== 0) {
      getAnimeList({ variables: { search: paramSearch } })
    }
  }, [paramSearch, getAnimeList])

  useEffect(() => {
    const newSearch = Object.keys(lsCollectionsData).map((collection) => {
      return parseInt(Object.keys(lsCollectionsData[collection])[0])
    })
    setParamSearch(newSearch)
  }, [lsCollectionsData])

  useEffect(() => {
    if (data) {
      const { media } = data.Page;
      setAnimeList(media)
    }
  }, [data])

  const renderCollectionList = () => {
    return Object.keys(lsCollectionsData).map((collection, idx) => {

      let id = 0
      let image = ''

      animeList.forEach((datum) => {
        if (datum.id === parseInt(Object.keys(lsCollectionsData[collection])[0])) {
          id = datum.id
          image = datum.coverImage.medium
          return;
        }
      })

      const routes = 'detail/' + collection

      return (
        <Link key={idx} to={routes}>
          <CollectionCard
            data={{
              id,
              image,
              title: collection,
            }}
            isLoading={loading}
          />
        </Link>
      )
    })
  }

  return (
    <div css={CollectionCss.wrapper}>
      <div css={CollectionCss.collectionListWrapper}>
        {renderCollectionList()}
      </div>
    </div>
  );
}

export default Collection;
