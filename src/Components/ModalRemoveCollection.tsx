/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModalOverlay from './common/ModalOverlay';

interface ModalRemoveCollectionProps {
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

function ModalRemoveCollection({ isShowModal, collectionId, onCloseModal }: ModalRemoveCollectionProps) {
  const modalContentCss = {
    wrapper: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
    `,
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [lsAnimesData, setLsAnimesData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})

  useEffect(() => {
    setLsCollectionsData(JSON.parse(localStorage.getItem('collections') || "{}"))
    setLsAnimesData(JSON.parse(localStorage.getItem('animes') || "{}"))
  }, [collectionId])

  const onRemoveCollection = () => {
    const collectionList = { ...lsCollectionsData }
    const animeList = { ...lsAnimesData }
    Object.keys(collectionList[collectionId]).forEach((animeId) => {
      delete animeList[animeId][collectionId]
      if (!Object.keys(animeList[animeId]).length) delete animeList[animeId]
    })
    delete collectionList[collectionId]

    localStorage.setItem('collections', JSON.stringify(collectionList))
    localStorage.setItem('animes', JSON.stringify(animeList))
    onCloseModal()
  }

  return (
    <ModalOverlay
      isShowModal={isShowModal}
      title="Remove Collection"
      onCloseModal={onCloseModal}
    >
      <div css={modalContentCss.wrapper}>
        <button onClick={onRemoveCollection}>remove</button>
        <button onClick={onCloseModal}>cancel</button>
      </div>
    </ModalOverlay>
  )
}

export default ModalRemoveCollection;