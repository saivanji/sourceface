import React from "react"
import styles from "./index.scss"

export default function Breadcrumbs({
  children,
  link = DefaultBreadcrumbsLink,
}) {
  return (
    <div className={styles.root}>
      {React.Children.map(children, (item, i) => (
        <React.Fragment key={i}>
          {i !== 0 && "/"}
          {React.cloneElement(item, { component: link })}
        </React.Fragment>
      ))}
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
