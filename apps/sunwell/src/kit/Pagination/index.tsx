import React from "react"
import cx from "classnames"
import ChevL from "assets/chev-l.svg"
import ChevR from "assets/chev-r.svg"
import styles from "./index.scss"

export default function Pagination({
  className,
  pageCount,
  selectedPage,
  onPageClick,
  pageMargin = 1,
  pageSurroundings = 2,
  ...props
}: // makePage,
Props) {
  const isPrevDisabled = selectedPage === 0
  const isNextDisabled = selectedPage === pageCount - 1

  return (
    <nav {...props} className={className}>
      <ul className={styles.root}>
        <Item
          onClick={() => !isPrevDisabled && onPageClick(selectedPage - 1)}
          isDisabled={isPrevDisabled}
        >
          <ChevL />
        </Item>
        {Array(pageCount)
          .fill(undefined)
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
                  {!shouldRenderNext && (
                    <Item isDots isDisabled>
                      ...
                    </Item>
                  )}
                </React.Fragment>
              )
            )
          })}
        <Item
          onClick={() => !isNextDisabled && onPageClick(selectedPage + 1)}
          isDisabled={isNextDisabled}
        >
          <ChevR />
        </Item>
      </ul>
    </nav>
  )
}

function Item({
  children,
  isSelected,
  isDisabled,
  isDots,
  onClick,
  ...props
}: ItemProps) {
  return (
    <li {...props} className={styles.item}>
      <a
        href="#"
        className={cx(
          styles.link,
          isSelected && styles.selected,
          isDisabled && styles.disabled,
          isDots && styles.dots
        )}
        onClick={e => {
          e.preventDefault()

          if (!isDisabled && onClick) {
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

const shouldRenderPage = (
  i: number,
  selected: number,
  count: number,
  margin: number,
  surroundings: number
) => {
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

const pad = (n: number, margin: number, surroundings: number) =>
  n <= margin + surroundings ? margin + surroundings - n : 0

interface Props {
  pageCount: number
  selectedPage: number
  onPageClick: (page: number) => void
  className?: string
  pageMargin?: number
  pageSurroundings?: number
}

interface ItemProps {
  children: React.ReactNode
  isSelected?: boolean
  isDisabled?: boolean
  isDots?: boolean
  onClick?: () => void
}
