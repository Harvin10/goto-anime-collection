/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { LOAD_ANIME_COLLECTION_LIST } from '../GraphQL/Queries';
import CollectionCard from '../Components/CollectionCard';

interface localStorageType {
  [key: string]: collectionType
}

interface collectionType {
  [key: string]: boolean
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

  const [imageData, setImageData] = useState([{ id: 0, coverImage: { medium: '' } }])
  const [searchImage, setSearchImage]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState([0])

  const [getAnimeImage, { loading, data }] = useLazyQuery(LOAD_ANIME_COLLECTION_LIST);

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsUpdated(false)
  }, [isLsUpdated])

  useEffect(() => {
    if (searchImage.length > 0 && searchImage[0] !== 0) {
      getAnimeImage({ variables: { search: searchImage } })
    }
  }, [searchImage, getAnimeImage])

  useEffect(() => {
    const newSearch = Object.keys(lsCollectionsData).map((collection) => {
      return parseInt(Object.keys(lsCollectionsData[collection])[0])
    })
    setSearchImage(newSearch)
  }, [lsCollectionsData])

  useEffect(() => {
    if (data) {
      const { media } = data.Page;
      setImageData(media)
    }
  }, [data])

  const renderCollectionList = () => {
    return Object.keys(lsCollectionsData).map((collection, idx) => {

      let id = 0
      let image = ''

      imageData.forEach((datum) => {
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
              title: collection,
              image,
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
