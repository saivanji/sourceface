import React from "react"
import styles from "./index.scss"

export default function Breadcrumbs({
  path,
  link: Link = DefaultBreadcrumbsLink,
}) {
  return (
    <div className={styles.root}>
      {path.map((item, i) => (
        <React.Fragment key={i}>
          {i !== 0 && "/"}
          <Link className={styles.link} key={i} to={item.link}>
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}

// export default function Breadcrumbs({
//   children,
//   link: Link = DefaultBreadcrumbsLink,
// }) {
//   return (
//     <div className={styles.root}>
//       {React.Children.map(children, (item, i) => (
//         <React.Fragment key={i}>
//           {i !== 0 && "/"}
//           {React.cloneElement(item, { component: link })}
//         </React.Fragment>
//       ))}
//     </div>
//   )
// }

// Breadcrumbs.Link = function BreadcrumbsLink({
//   children,
//   to,
//   component: Component,
// }) {
//   return (
//     <Component to={to} className={styles.link}>
//       {children}
//     </Component>
//   )
// }

function DefaultBreadcrumbsLink({ children, to, className }) {
  return (
    <a href={to} className={className}>
      {children}
    </a>
  )
}
