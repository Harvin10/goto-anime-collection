/** @jsxImportSource @emotion/react */

import React, { ReactNode } from 'react';
import { css } from '@emotion/react';

interface ModalOverlayProps {
  children: ReactNode;
  isShowModal: boolean;
  title: string;
  onCloseModal: () => void;
}

function ModalOverlay({ children, isShowModal, title, onCloseModal }: ModalOverlayProps) {
  const modalOverlayCss = {
    overlay: css`
      height: 100vh;
      width: 100vw;
      background-color: #00000050;
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    `,
    modal: css`
      min-width: 250px;
      background-color: #ffffff;
      border-radius: 8px;
      position: relative;
    `,
    modalHeader: css`
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 12px;
      box-sizing: border-box;

      p {
        font-size: 16px;
        font-weight: 600;
      }
    `,
    iconWrapper: css`
      margin: 12px;
      position: absolute;
      top: 0;
      right: 0;
    `,
    icon: css`
      width: 16px;
      height: 16px;
    `,
    hr: css`
      border-top: 2px solid lightgray;
      margin: 0;
    `,
    contentWrapper: css`
      padding: 12px;
    `
  };

  if (!isShowModal) {
    return;
  }

  return (
    <div css={modalOverlayCss.overlay}>
      <div css={modalOverlayCss.modal}>
        <div css={modalOverlayCss.modalHeader}>
          <p>{title}</p>
        </div>
        <div css={modalOverlayCss.iconWrapper} onClick={onCloseModal}>
          <img
            css={modalOverlayCss.icon}
            src="https://s6.imgcdn.dev/x8ynS.png"
            alt="close icon"
          />
        </div>
        <hr css={modalOverlayCss.hr} />
        <div css={modalOverlayCss.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalOverlay;