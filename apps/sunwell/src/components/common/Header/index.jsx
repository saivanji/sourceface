import React from "react"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Dropdown from "@sourceface/components/dropdown"
import styles from "./index.css"

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Settings",
    link: "/settings",
  },
  {
    name: "Users",
    link: "/settings/users",
  },
]

export default function Header() {
  return (
    <div className={styles.root}>
      <div className={styles.wrap}>
        <Breadcrumbs items={items} />
        <Dropdown className={styles.profile}>
          <Dropdown.Trigger>
            <button className={styles.avatar}>
              <Avatar value="A" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
