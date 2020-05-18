import React from "react"
import Card from "@sourceface/components/card"
import styles from "./index.scss"

export default ({ children, title, description }) => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {children}
      <span className={styles.copyright}>
        Crafted with <span>❤</span>️ by @aiven715
      </span>
    </div>
  )
}

// export default ({ children, title, description }) => {
//   return (
//     <div className={styles.root}>
//       <div className={styles.container}>
//         <Card size="loose">
//           <span className={styles.title}>{title}</span>
//           <span className={styles.description}>{description}</span>
//           {children}
//         </Card>
//         <span className={styles.copyright}>
//           Crafted with <span>❤</span>️ by @aiven715
//         </span>
//       </div>
//     </div>
//   )
// }
