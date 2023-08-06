/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { css } from '@emotion/react';
import Skeleton from './common/Skeleton';
import ModalRemoveCollection from './ModalRemoveCollection';
import { Link } from 'react-router-dom';
import ModalEditCollection from './ModalEditCollection';

interface CollectionCardProps {
  data: CollectionData;
  isLoading: Boolean;
  refetchParent?: () => void;
}

interface CollectionData {
  id: number;
  title: string;
  image: string
}

function CollectionCard({ data, isLoading, refetchParent }: CollectionCardProps) {
  const collectionCardCss = {
    wrapper: css`
      display: flex;
      border: 2px solid lightgray;
      border-radius: 16px;
      overflow: hidden;
      background-color: white;
      position: relative;
    `,
    imageWrapper: css`
      height: 130px;
      min-width: 90px;
      max-width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      object-fit: cover;
      overflow: hidden;
    `,
    image: css`
      width: 100%;
    `,
    titleWrapper: css`
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px;

      p {
        font-size: 24px;
      }
    `,
    optionWrapper: css`
      display: flex;
      justify-content: center;
      align-items: start;
      padding: 8px;
    `,
    option: css`
      height: 24px;
    `,
    optionModalShow: css`
      display: block;
    `,
    optionModalHide: css`
      display: none;
    `,
    optionModal: css`
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: 4px;
      padding: 8px;
      border: 1px solid #888888;
      border-radius: 4px;
      position: absolute;
      top: 32px;
      right: 8px;

      p {
        padding: 2px;
      }
    `,
  };

  const [showOptionModal, setOptionModal] = useState(false)
  const [showEditModal, setEditModal] = useState(false)
  const [showRemoveModal, setRemoveModal] = useState(false)

  const onEditCollection = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    setEditModal(true)
  }

  const onRemoveCollection = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    setRemoveModal(true)
  }

  const openOption = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setOptionModal(!showOptionModal)
  }

  const onCloseRemoveModal = () => {
    refetchParent?.()
    setRemoveModal(false)
    setOptionModal(false)
  }

  const onCloseEditModal = () => {
    refetchParent?.()
    setEditModal(false)
    setOptionModal(false)
  }

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton w="90px" h="130px" />
        <div css={collectionCardCss.titleWrapper}>
          <Skeleton w="120px" h="24px" rounded />
        </div>
      </>
    )
  }

  const routes = '/detail/' + data.title

  return (
    <>
      <Link to={routes} css={collectionCardCss.wrapper}>
        {isLoading ?
          renderSkeleton()
          : <>
            <div css={collectionCardCss.imageWrapper}>
              <img
                css={data.image ? '' : collectionCardCss.image}
                src={data.image || 'https://s6.imgcdn.dev/xpLIO.png'}
                alt="collection cover"
              />
            </div>
            <div css={collectionCardCss.titleWrapper}>
              <p>
                {data.title}
              </p>
            </div>
          </>
        }
        <div
          css={collectionCardCss.optionWrapper}
          onClick={openOption}
        >
          <img
            css={collectionCardCss.option}
            src="https://s6.imgcdn.dev/xpbBn.png"
            alt="more option"
          />
        </div>
        <div
          css={[
            showOptionModal ? collectionCardCss.optionModalShow : collectionCardCss.optionModalHide
          ]}
          onClick={(e) => e.preventDefault()}
        >
          <div css={collectionCardCss.optionModal}>
            <p onClick={onEditCollection}>edit</p>
            <p onClick={onRemoveCollection}>remove</p>
          </div>
        </div>
      </Link>
      <ModalEditCollection
        isShowModal={showEditModal}
        collectionId={data.title}
        onCloseModal={onCloseEditModal}
      />
      <ModalRemoveCollection
        isShowModal={showRemoveModal}
        collectionId={data.title}
        onCloseModal={onCloseRemoveModal}
      />
    </>
  )
}

export default CollectionCard;