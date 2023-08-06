/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModalOverlay from './common/ModalOverlay';

interface ModalCollectionListProps {
  isShowModal: boolean;
  animeId: string;
  onCloseModal: () => void;
}

interface localStorageType {
  [key: string]: collectionType
}

interface collectionType {
  [key: string]: boolean
}

function ModalCollectionList({ isShowModal, animeId, onCloseModal }: ModalCollectionListProps) {
  const modalContentCss = {
    wrapper: css`
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
    footer: css`
      width: 100%;

      button {
        float: right;
      }
    `
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [lsAnimesData, setLsAnimesData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [isLsUpdated, setLsUpdated] = useState(false)

  const [newCollection, setNewCollection] = useState('')
  const [isValid, setValid] = useState(false)
  const [isDirty, setDirty] = useState(false)
  const [selectedCollection, setSelectedCollection]: [collectionType, React.Dispatch<React.SetStateAction<{}>>] = useState({})

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsAnimesData(JSON.parse(localStorage.getItem('animes') || "{}"))
    setSelectedCollection(JSON.parse(localStorage.getItem('animes') || "{}")[animeId])
    setLsUpdated(false)
  }, [isLsUpdated, animeId])

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

  const updateCollections = () => {
    const combinedAnimeData = { ...selectedCollection, ...lsAnimesData[animeId] }
    const collectionDataNeedUpdate = { ...lsCollectionsData }
    const animeDataNeedUpdate = {
      ...lsAnimesData,
      [animeId]: selectedCollection
    }
    Object.keys(combinedAnimeData).forEach((collectionId) => {
      if (lsAnimesData?.[animeId]?.[collectionId] && !selectedCollection[collectionId])
        delete collectionDataNeedUpdate[collectionId][animeId]
      else if (!lsAnimesData?.[animeId]?.[collectionId] && selectedCollection[collectionId])
        collectionDataNeedUpdate[collectionId][animeId] = true
    })

    localStorage.setItem('collections', JSON.stringify(collectionDataNeedUpdate))
    localStorage.setItem('animes', JSON.stringify(animeDataNeedUpdate))

    setLsUpdated(true)
    setNewCollection('')
    onCloseModal()
  }

  const onToggleChecked = (name: string) => {
    const newSelected = { ...selectedCollection }
    newSelected[name] = !newSelected[name]
    if (!newSelected[name]) delete newSelected[name]

    setSelectedCollection(newSelected)
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
    return Object.keys(lsCollectionsData).map((name: string, idx) => {
      return (
        <div key={idx}>
          <input
            type="checkbox"
            name={name}
            value={name}
            checked={selectedCollection?.[name] || false}
            onChange={() => onToggleChecked(name)}
          />
          <label htmlFor={name}>
            {name}
          </label>
        </div>
      )
    })
  }

  return (
    <ModalOverlay
      isShowModal={isShowModal}
      title="Collection List"
      onCloseModal={onCloseModal}
    >
      <div css={modalContentCss.wrapper}>
        {renderCollectionList()}
        <div css={modalContentCss.addNewWrapper}>
          <div>
            <input
              type="text"
              placeholder='New Collection'
              value={newCollection}
              onChange={onInputChange}
            />
            {isValid || !isDirty ? null :
              <div css={modalContentCss.errorMessage}>
                <p>Collection name can't: </p>
                <ul>
                  <li>Use special character</li>
                  <li>Have duplicate</li>
                </ul>
              </div>
            }
          </div>
          {!newCollection || !isValid ? null :
            <div css={modalContentCss.iconWrapper} onClick={addNewCollection}>
              <img
                css={modalContentCss.icon}
                src="https://s6.imgcdn.dev/x85xC.png"
                alt="check icon"
              />
            </div>
          }
        </div>
        <div css={modalContentCss.footer}>
          <button onClick={updateCollections}>save</button>
        </div>
      </div>
    </ModalOverlay>
  )
}

export default ModalCollectionList;