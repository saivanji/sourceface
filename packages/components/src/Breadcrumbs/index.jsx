import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Breadcrumbs({
  children,
  link = DefaultBreadcrumbsLink,
}) {
  return (
    <div className={styles.root}>
      {React.Children.map(children, (item, i) => {
        const isLast = i === React.Children.count(children) - 1
        return (
          <React.Fragment key={i}>
            {!isLast ? (
              <>
                {React.cloneElement(item, { component: link })}
                {"/"}
              </>
            ) : (
              <span className={cx(styles.link, styles.disabled)}>
                {item.props.children}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

Breadcrumbs.Link = function BreadcrumbsLink({
  children,
  to,
  component: Component,
}) {
  return (
    <Component to={to} className={styles.link}>
      {children}
    </Component>
  )
}

function DefaultBreadcrumbsLink({ children, to, className }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  )
}
