/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
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
  const collectionCss = {
    wrapper: css`
      min-height: 100vh;
      background-color: whitesmoke;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
    addNewWrapper: css`
      width: 100%;
      display: flex;
    `,
    errorMessage: css`
      color: red;
      font-size: 12px;
      margin-top: 4px;

      li {
        list-style: disc;
        list-style-position: inside;
      }
    `,
    iconWrapper: css`
      margin-left: 4px;
      padding: 4px;
      border: 1px solid lightgray;
      border-radius: 4px;
    `,
    icon: css`
      width: 12px;
      height: 12px;
    `,
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [isLsUpdated, setLsUpdated] = useState(false)

  const [animeList, setAnimeList] = useState([{ id: 0, coverImage: { medium: '' } }])
  const [paramSearch, setParamSearch]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState([0])

  const [newCollection, setNewCollection] = useState('')
  const [isValid, setValid] = useState(false)
  const [isDirty, setDirty] = useState(false)

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

  const addNewCollection = () => {
    localStorage.setItem('collections', JSON.stringify(
      {
        ...lsCollectionsData,
        [newCollection]: {},
      }
    ))
    setLsUpdated(true)
    setNewCollection('')
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true)
    setNewCollection(e.target.value)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!lsCollectionsData?.[e.target.value] && !specialChars.test(e.target.value)) {
      setValid(true)
    } else {
      setValid(false)
    }
  }

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

      return (
        <CollectionCard
          key={idx}
          data={{
            id,
            image,
            title: collection,
          }}
          isLoading={loading}
          refetchParent={() => setLsUpdated(true)}
        />
      )
    })
  }

  return (
    <div css={collectionCss.wrapper}>
      <div css={collectionCss.addNewWrapper}>
        <div>
          <input
            type="text"
            placeholder='New Collection'
            value={newCollection}
            onChange={onInputChange}
          />
          {isValid || !isDirty ? null :
            <div css={collectionCss.errorMessage}>
              <p>Collection name can't: </p>
              <ul>
                <li>Use special character</li>
                <li>Have duplicate</li>
              </ul>
            </div>
          }
        </div>
        {!newCollection || !isValid ? null :
          <div css={collectionCss.iconWrapper} onClick={addNewCollection}>
            <img
              css={collectionCss.icon}
              src="https://s6.imgcdn.dev/x85xC.png"
              alt="check icon"
            />
          </div>
        }
      </div>
      {renderCollectionList()}
    </div>
  );
}

export default Collection;
