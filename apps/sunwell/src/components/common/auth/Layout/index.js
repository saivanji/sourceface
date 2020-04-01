import React from "react"

export default ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="flex flex-col max-w-lg w-full mx-4 mt-4 mb-16">
        {children}
        <span className="mt-auto absolute w-full bottom-0 left-0 text-xs text-center font-bold mb-4">
          Crafted with <span>❤</span>️ by @aiven715
        </span>
      </div>
    </div>
  )
}
