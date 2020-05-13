import React from "react"
import cx from "classnames"
import styles from "./index.css"
import ContentIcon from "assets/content.svg"
import SettingsIcon from "assets/settings.svg"

export default function Sidebar() {
  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <div className={styles.logo} />
        <NavLink>
          <ContentIcon />
        </NavLink>
        <div className={styles.bottom}>
          <NavLink>
            <SettingsIcon />
          </NavLink>
        </div>
      </div>
      <div className={styles.menu}>
        <span className={styles.menuTitle}>Settings</span>
        <div className={styles.menuList}>
          <MenuLink>Security</MenuLink>
          <MenuLink isActive>Users management</MenuLink>
          <MenuLink>Access management</MenuLink>
        </div>
      </div>
    </div>
  )
}

// TODO: should have a tagname
function NavLink({ className, children }) {
  return <button className={cx(styles.navLink, className)}>{children}</button>
}

// TODO: should have a tagname
function MenuLink({ children, isActive }) {
  return (
    <button className={cx(styles.menuLink, isActive && styles.active)}>
      {children}
    </button>
  )
}
