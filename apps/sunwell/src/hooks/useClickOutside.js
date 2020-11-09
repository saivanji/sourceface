import { useEffect } from "react"

export default (ref, onClickOutside) => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickOutside()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  })
}
