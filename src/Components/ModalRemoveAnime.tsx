/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModalOverlay from './common/ModalOverlay';

interface ModalRemoveAnimeProps {
  isShowModal: boolean;
  animeId: string;
  collectionId: string;
  onCloseModal: () => void;
}

interface localStorageType {
  [key: string]: collectionType
}

interface collectionType {
  [key: string]: boolean
}

function ModalRemoveAnime({ isShowModal, animeId, collectionId, onCloseModal }: ModalRemoveAnimeProps) {
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

  const onRemoveAnime = () => {
    const collectionList = { ...lsCollectionsData }
    const animeList = { ...lsAnimesData }
    delete animeList[animeId][collectionId]
    delete collectionList[collectionId][animeId]

    localStorage.setItem('collections', JSON.stringify(collectionList))
    localStorage.setItem('animes', JSON.stringify(animeList))
    onCloseModal()
  }

  return (
    <ModalOverlay
      isShowModal={isShowModal}
      title="Remove Anime"
      onCloseModal={onCloseModal}
    >
      <div css={modalContentCss.wrapper}>
        <button onClick={onRemoveAnime}>remove</button>
        <button onClick={onCloseModal}>cancel</button>
      </div>
    </ModalOverlay>
  )
}

export default ModalRemoveAnime;