/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ModalOverlay from '../Components/ModalOverlay';

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
        {JSON.stringify(selectedCollection)}
        {renderCollectionList()}
        <div css={modalContentCss.addNewWrapper}>
          <input
            type="text"
            placeholder='New Collection'
            value={newCollection}
            onChange={(e) => setNewCollection(e.target.value)}
          />
          {!newCollection ? null :
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

export default ModalCollectionList



// const [collectionData, setCollectionData]: [collectionTypes, React.Dispatch<React.SetStateAction<{}>>] = useState({})
// const [isCollectionsUpdated, setCollectionsUpdated] = useState(false)
// const [newCollection, setNewCollection] = useState('')
// const [selectedCollection, setSelectedCollection] = useState([''])

// const [animeData, setAnimeData] = useState([])

// useEffect(() => {
//   setCollectionData(getCollectionData())
//   setAnimeData(getAnimeData())

//   setSelectedCollection([])
//   setCollectionsUpdated(false)
// }, [isCollectionsUpdated])

// const getCollectionData = () => {
//   return JSON.parse(localStorage.getItem('collections') || "{}")
// }

// const getAnimeData = () => {
//   return JSON.parse(localStorage.getItem('animes') || "{}")[paramId]
// }

// const addNewCollection = () => {
//   localStorage.setItem('collections', JSON.stringify(
//     {
//       ...collectionData,
//       [newCollection]: [],
//     }
//   ))
//   setCollectionsUpdated(true)
//   setNewCollection('')
// }

// const updateCollections = () => {
//   const needUpdate: collectionTypes = {}
//   // selectedCollection.forEach((c) => {
//   //   const collectionDatum = collectionData?.[c]?.length > 0 ? collectionData[c] : []
//   //   needUpdate[c] = [...new Set([...collectionDatum, paramId])]
//   // })

//   animeData.forEach((c) => {
//     const collectionDatum = collectionData?.[c]?.length > 0 ? collectionData[c] : []
//     needUpdate[c] = [...new Set([...collectionDatum, paramId])]
//   })
//   localStorage.setItem('collections', JSON.stringify({
//     ...collectionData,
//     ...needUpdate
//   }))
//   localStorage.setItem('animes', JSON.stringify({
//     [paramId]: [...new Set(selectedCollection)]
//   }))
//   setNewCollection('')
//   onCloseModal()
// }

// const onToggleChecked = (name: string) => {
//   const newSelected = [...selectedCollection]
//   let isChecked = true
//   selectedCollection.forEach((c, idx) => {
//     if (c === name) {
//       newSelected.splice(idx, 1)
//       isChecked = false
//       return;
//     }
//   })
//   if (isChecked) newSelected.push(name)
//   setSelectedCollection(newSelected)
// }