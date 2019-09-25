import * as React from "react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { sw_compile } from "../.."

interface ButtonProps {
  icon?: IconProp
  type: ("primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link")
  className?: string

  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Button: React.FunctionComponent<ButtonProps> = (props) => {
  return (
    <button className={`btn btn-${props.type} ${props.className}`} onClick={() => {
      sw_compile({ "a": 1, "b": 2 })
    }}>
      { props.icon ? <FontAwesomeIcon icon={props.icon} />  : null }
      { props.icon && props.children ? " " : null }
      { props.children }
    </button>
  )
}

export default Button;