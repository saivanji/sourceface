import React from "react"
import * as styles from "./index.styles"

export default function Pagination({
  pageCount,
  selectedPage,
  onPageClick,
  pageMargin = 1,
  pageSurroundings = 2,
  ...props
  // makePage,
}) {
  const isPrevDisabled = selectedPage === 0
  const isNextDisabled = selectedPage === pageCount - 1

  return (
    <nav {...props}>
      <ul css={styles.list}>
        <Item
          onClick={() => !isPrevDisabled && onPageClick(selectedPage - 1)}
          isDisabled={isPrevDisabled}
        >
          Previous
        </Item>
        {Array(pageCount)
          .fill()
          .map((_, i) => {
            const shouldRender = shouldRenderPage(
              i,
              selectedPage,
              pageCount,
              pageMargin,
              pageSurroundings
            )
            const shouldRenderNext = shouldRenderPage(
              i + 1,
              selectedPage,
              pageCount,
              pageMargin,
              pageSurroundings
            )
            return (
              shouldRender && (
                <React.Fragment key={i}>
                  <Item
                    isSelected={i === selectedPage}
                    onClick={() => onPageClick(i)}
                  >
                    {i + 1}
                  </Item>
                  {!shouldRenderNext && <Item isDisabled>...</Item>}
                </React.Fragment>
              )
            )
          })}
        <Item
          onClick={() => !isNextDisabled && onPageClick(selectedPage + 1)}
          isDisabled={isNextDisabled}
        >
          Next
        </Item>
      </ul>
    </nav>
  )
}

function Item({ children, isSelected, isDisabled, onClick, ...props }) {
  return (
    <li {...props} css={styles.item}>
      <a
        href="#"
        css={[
          styles.link,
          isSelected && styles.selected,
          isDisabled && styles.disabled,
        ]}
        onClick={e => {
          e.preventDefault()

          if (!isDisabled) {
            onClick()
          }
        }}
        {...(isDisabled && {
          tabIndex: -1,
          "aria-disabled": true,
        })}
      >
        {children}
      </a>
    </li>
  )
}

const shouldRenderPage = (i, selected, count, margin, surroundings) => {
  return (
    // selected
    i === selected ||
    // first displayed
    i < margin ||
    // last displayed
    i >= count - margin ||
    // before selected
    (i < selected &&
      i >=
        selected -
          surroundings -
          pad(count - selected - 1, margin, surroundings)) ||
    // after selected
    (i > selected &&
      i <= selected + surroundings + pad(selected, margin, surroundings))
  )
}

const pad = (n, margin, surroundings) =>
  n <= margin + surroundings ? margin + surroundings - n : 0
