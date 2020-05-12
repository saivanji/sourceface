import React from "react"
import styles from "./index.css"
import Avatar from "@sourceface/components/avatar"
import Breadcrumbs from "@sourceface/components/breadcrumbs"
import Dropdown, {
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "@sourceface/components/dropdown"

// TODO: think about path
const items = [
  {
    name: "Home",
    link: "/",
  },
  // probably settings path will not exist
  {
    name: "Settings",
    link: "/settings",
  },
  {
    name: "Users",
    link: "/settings/users",
  },
]

export default ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.content}>{children}</div>
    </>
  )
}

function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.headerWrap}>
        <Breadcrumbs items={items} />
        <Dropdown className={styles.profile}>
          <DropdownButton>
            <Avatar className={styles.avatar} value="A" />
          </DropdownButton>
          <DropdownMenu>
            <DropdownItem>Sign out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  )
}

// <div className="flex">
//   <div className="flex-1">
//     <div className="mb-6 py-2 px-4 flex items-center">
//       <div className="ml-auto">
//         <img
//           className="w-8 h-8 rounded-full"
//           src="https://randomuser.me/api/portraits/men/1.jpg"
//           alt="photo"
//         />
//       </div>
//     </div>
//   </div>
// </div>

// const MenuItem = ({ children, icon }) => (
//   <a href="/" className="mb-5 flex items-center text-base">
//     <div className="w-8 flex justify-center">1</div>
//     {children}
//   </a>
// )

// const Menu = () => (
//   <div className="flex flex-col -mb-3">
//     <MenuItem>Orders</MenuItem>
//     <MenuItem>Products</MenuItem>
//     <MenuItem>Stores</MenuItem>
//     <MenuItem>Calls</MenuItem>
//   </div>
// )
//
//
//
// <div className="flex flex-col w-64 bg-gray-shade-100 h-screen text-white flex-shrink-0 px-5 pb-4">
//   <div className="font-display text-2xl mb-8 h-16 pb-2 flex items-end">
//     Sourceface
//   </div>
//   <Menu />
//   <div className="mt-auto">Help</div>
// </div>
