import React from "react"
import cx from "classnames"
import styles from "./index.css"

export default function Pagination({
  className,
  pageCount,
  selectedPage,
  onPageClick,
  pageMargin = 1,
  pageSurroundings = 2,
  // makePage,
}) {
  const isPrevDisabled = selectedPage === 0
  const isNextDisabled = selectedPage === pageCount - 1

  return (
    <nav className={className}>
      <ul className={styles.root}>
        <Item
          onClick={() => !isPrevDisabled && onPageClick(selectedPage - 1)}
          isDisabled={isPrevDisabled}
        >
          Previous
        </Item>
        {Array(pageCount)
          .fill()
          .map((_, i) => i)
          .filter(i =>
            shouldRenderPage(
              i,
              selectedPage,
              pageCount,
              pageMargin,
              pageSurroundings
            )
          )
          .map(i => (
            <>
              {
                // {i === pageCount - pageMargin && <Item isDisabled>...</Item>}
              }
              <Item
                isSelected={i === selectedPage}
                key={i}
                onClick={() => onPageClick(i)}
              >
                {i + 1}
              </Item>
            </>
          ))}
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

function Item({ children, isSelected, isDisabled, onClick }) {
  return (
    <li className={styles.item}>
      <a
        href="#"
        className={cx(
          styles.link,
          isSelected && styles.selected,
          isDisabled && styles.disabled
        )}
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
