import React from "react"
import cx from "classnames"
import styles from "./index.css"
import ContentIcon from "assets/content-line.svg"
import GroupIcon from "assets/group-line.svg"
import LockIcon from "assets/lock-line.svg"
import QuestionIcon from "assets/question-line.svg"
import SettingsIcon from "assets/settings-line.svg"
import ShieldIcon from "assets/shield-line.svg"
import StackIcon from "assets/stack-line.svg"

// TODO: move to kit
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
            <QuestionIcon />
          </NavLink>
          <NavLink>
            <StackIcon />
          </NavLink>
          <NavLink>
            <SettingsIcon />
          </NavLink>
        </div>
      </div>
      <div className={styles.menu}>
        <span className={styles.menuTitle}>Settings</span>
        <div className={styles.menuList}>
          <MenuLink iconBefore={<ShieldIcon />}>Security</MenuLink>
          <MenuLink iconBefore={<GroupIcon />} isActive>
            Users management
          </MenuLink>
          <MenuLink iconBefore={<LockIcon />}>Access management</MenuLink>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  children,
  className,
  isActive,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.navLink, isActive && styles.active, className)}
    >
      {children}
    </Component>
  )
}

function MenuLink({
  children,
  className,
  iconBefore,
  isActive,
  component: Component = "a",
  ...props
}) {
  return (
    <Component
      {...props}
      className={cx(styles.menuLink, isActive && styles.active, className)}
    >
      {iconBefore && <iconBefore.type className={styles.menuIcon} />}
      {children}
    </Component>
  )
}
