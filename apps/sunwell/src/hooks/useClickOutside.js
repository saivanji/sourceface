import { useEffect } from "react"

export default (ref, onClickOutside) => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClickOutside()
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleClick)

    return () => {
      document.removeEventListener("mouseup", handleClick)
    }
  })
}
