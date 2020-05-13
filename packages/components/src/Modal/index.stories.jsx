import React from "react"
import { withKnobs, select } from "@storybook/addon-knobs"
import { withA11y } from "@storybook/addon-a11y"
import Button from "../Button"
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./index"

export default { title: "Modal", decorators: [withKnobs, withA11y] }

export const Regular = () => (
  <Modal
    size={select("Size", ["compact", "normal", "loose"], "normal")}
    isOpened
  >
    <ModalHeader iconBefore={<AlertIcon />}>User removal</ModalHeader>
    <ModalBody>
      Are you sure that you want to remove that user? This can not be undone
    </ModalBody>
    <ModalFooter>
      <Button appearance="secondary">Cancel</Button>
      <Button>Submit</Button>
    </ModalFooter>
  </Modal>
)