import React from 'react'
import cx from 'classnames'
import Spinner from '../Spinner'
import styles from './index.scss'

export default ({ children, isAwaiting, className }) => {
  if (!isAwaiting) {
    return children
  }

  return (
    <div className={cx(styles.root, className)}>
      {children}
      <div className={styles.area}><Spinner /></div>
    </div>
  )
}
