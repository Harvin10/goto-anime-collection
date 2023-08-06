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
    errorMessage: css`
      color: red;
      font-size: 12px;
      margin-top: 4px;

      li {
        list-style: disc;
        list-style-position: inside;
      }
    `,
  }

  const [lsCollectionsData, setLsCollectionsData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})
  const [lsAnimesData, setLsAnimesData]: [localStorageType, React.Dispatch<React.SetStateAction<{}>>] = useState({})

  const [newCollectionName, setNewCollectionName] = useState('')
  const [isValid, setValid] = useState(false)

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
    setNewCollectionName('')
    onCloseModal()
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCollectionName(e.target.value)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!lsCollectionsData?.[e.target.value] && !specialChars.test(e.target.value)) {
      setValid(true)
    } else {
      setValid(false)
    }
  }

  return (
    <ModalOverlay
      isShowModal={isShowModal}
      title="Edit Collection Name"
      onCloseModal={onCloseModal}
    >
      <div css={modalContentCss.wrapper}>
        <div>
          <input
            type="text"
            placeholder='New Collection'
            value={newCollectionName}
            onChange={onInputChange}
          />
          {isValid ? null :
            <div css={modalContentCss.errorMessage}>
              <p>Collection name can't: </p>
              <ul>
                <li>Use special character</li>
                <li>Have duplicate</li>
              </ul>
            </div>
          }
        </div>
        <button onClick={onEditCollection} disabled={!newCollectionName || !isValid}>edit</button>
      </div>
    </ModalOverlay>
  )
}

export default ModalEditCollection;