/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModalOverlay from './common/ModalOverlay';

interface ModalEditCollectionProps {
  isShowModal: boolean;
  collectionId: string;
  onCloseModal: () => void;
}

interface localStorageType {
  [key: string]: collectionType
}

interface collectionType {
  [key: string]: boolean
}

function ModalEditCollection({ isShowModal, collectionId, onCloseModal }: ModalEditCollectionProps) {
  const modalContentCss = {
    wrapper: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [lsAnimesData, setLsAnimesData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})

  const [newCollectionName, setNewCollectionName] = useState('')

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsAnimesData(JSON.parse(localStorage.getItem('animes') || "{}"))
  }, [collectionId])

  const onEditCollection = () => {
    const collectionList = { ...lsCollectionsData }
    const animeList = { ...lsAnimesData }
    Object.keys(collectionList[collectionId]).forEach((animeId) => {
      animeList[animeId][newCollectionName] = true
      delete animeList[animeId][collectionId]
    })
    collectionList[newCollectionName] = collectionList[collectionId]
    delete collectionList[collectionId]

    localStorage.setItem('collections', JSON.stringify(collectionList))
    localStorage.setItem('animes', JSON.stringify(animeList))
    onCloseModal()
  }

  return (
    <ModalOverlay
      isShowModal={isShowModal}
      title="Edit Collection Name"
      onCloseModal={onCloseModal}
    >
      <div css={modalContentCss.wrapper}>
        <input
          type="text"
          value={newCollectionName}
          onChange={e => setNewCollectionName(e.target.value)}
        />
        <button onClick={onEditCollection}>edit</button>
      </div>
    </ModalOverlay>
  )
}

export default ModalEditCollection;