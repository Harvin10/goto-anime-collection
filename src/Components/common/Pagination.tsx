/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onChangePage: (page: number) => void;
}

function Pagination({ currentPage, lastPage, onChangePage }: PaginationProps) {
  const PaginationCss = {
    wrapper: css`
      display: flex;
      gap: 2px;
    `,
    box: css`
      text-align: center;
      min-width: 16px;
      background-color: lightgray;
      padding: 4px;
      border-radius: 4px;
    `,
    ellipsis: css`
      display: flex;
      align-items: end;
    `,
    currBox: css`
      text-align: center;
      min-width: 16px;
      background-color: gray;
      padding: 4px;
      border-radius: 4px;
    `,
  }

  return (
    <div css={PaginationCss.wrapper}>
      {currentPage - 1 > 1 ?
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(currentPage - 1)}
        >
          prev
        </div> : null
      }
      {currentPage === 1 ? null :
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(1)}
        >
          1
        </div>
      }
      {currentPage - 2 <= 1 ? null :
        <div css={PaginationCss.ellipsis}>...</div>
      }
      {currentPage - 1 <= 1 ? null :
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(currentPage - 1)}
        >
          {currentPage - 1}
        </div>
      }
      <div css={PaginationCss.currBox}>{currentPage}</div>
      {currentPage + 1 >= lastPage ? null :
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(currentPage + 1)}
        >
          {currentPage + 1}
        </div>
      }
      {currentPage + 2 >= lastPage ? null :
        <div css={PaginationCss.ellipsis}>...</div>
      }
      {currentPage === lastPage ? null :
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(lastPage)}
        >
          {lastPage}
        </div>
      }
      {currentPage + 1 >= lastPage ? null :
        <div
          css={PaginationCss.box}
          onClick={() => onChangePage(currentPage + 1)}
        >
          next
        </div>
      }
    </div>
  )
}

export default Pagination;