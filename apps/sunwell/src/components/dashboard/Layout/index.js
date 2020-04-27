import React from "react"
import { Tabs } from "@sourceface/components"

// Ignore that component for now
export default ({ children }) => {
  return (
    <div className="flex">
      <div className="flex flex-col w-64 bg-gray-shade-100 h-screen text-white flex-shrink-0 px-5 pb-4">
        <div className="font-display text-2xl mb-8 h-16 pb-2 flex items-end">
          Sourceface
        </div>
        <Menu />
        <div className="mt-auto">Help</div>
      </div>
      <div className="flex-1">
        <div className="mb-6 py-2 px-4 flex items-center">
          <div>
            <span className="text-xs">Home › Categories</span>
            <span className="block text-lg font-semibold">Products list</span>
          </div>
          <div className="ml-auto">
            <img
              className="w-8 h-8 rounded-full"
              src="https://randomuser.me/api/portraits/men/1.jpg"
              alt="photo"
            />
          </div>
        </div>
        <div className="px-4">
          <div className="mb-8">
            <Tabs />
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm"></div>
        </div>
      </div>
    </div>
  )
}

const MenuItem = ({ children, icon }) => (
  <a href="/" className="mb-5 flex items-center text-base">
    <div className="w-8 flex justify-center">1</div>
    {children}
  </a>
)

const Menu = () => (
  <div className="flex flex-col -mb-3">
    <MenuItem>Orders</MenuItem>
    <MenuItem>Products</MenuItem>
    <MenuItem>Stores</MenuItem>
    <MenuItem>Calls</MenuItem>
  </div>
)
