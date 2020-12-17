import React, { useState } from "react"
import cx from "classnames"
import { ValidationError } from "yup"
import { Button, Label, Toggle, Autocomplete } from "@sourceface/components"
import Add from "assets/add.svg"
import {
  Action,
  useEditor,
  useConfiguration,
  useContainer,
} from "packages/factory"
import Card from "./Card"
import styles from "./index.scss"

export default function Option(props) {
  return (
    <Option.Group>
      <Option.Element {...props} />
    </Option.Group>
  )
}

Option.Group = function OptionGroup({ children }) {
  return <div className={styles.group}>{children}</div>
}

// TODO: restrict field names starting from "@"
Option.Element = function OptionElement({
  label,
  name,
  component,
  actionsOnly = false,
  ...props
}) {
  const { selectors } = useEditor()
  const { module } = useConfiguration()

  const actions = selectors.actions(module.id, name)

  return (
    <>
      <Head
        name={name}
        label={label}
        creationVisible={actionsOnly && !actions.length}
      />
      {actionsOnly || actions.length ? (
        <Pipe actions={actions} />
      ) : (
        <Field {...props} name={name} component={component} />
      )}
    </>
  )
}

function Head({ name, label, creationVisible = false }) {
  const { stock } = useContainer()
  const { module } = useConfiguration()
  const { createAction } = useEditor()

  return (
    <Label
      className={styles.label}
      title={label}
      trail={
        <Toggle
          className={styles.add}
          position="bottomRight"
          trigger={
            <Button
              className={cx(styles.button, creationVisible && styles.visible)}
              appearance="link"
              size="small"
              icon={<Add />}
            >
              Add action
            </Button>
          }
        >
          {(close) => (
            <Autocomplete
              placeholder="Choose action..."
              items={stock.actions.list}
              map={(item) => ({ title: item.type, value: item.type })}
              onChange={(value) => {
                createAction(module.id, name, value)
                close()
              }}
            />
          )}
        </Toggle>
      }
    />
  )
}

function Pipe({ actions }) {
  const { removeAction, renameAction } = useEditor()

  return actions.map((action) => (
    <div key={action.id} className={styles.action}>
      <Action action={action}>
        {(root, cut) => (
          <Card
            cut={cut}
            name={action.name}
            onRename={(name) => renameAction(action.id, name)}
            onRemove={() => removeAction(action.id)}
          >
            {root}
          </Card>
        )}
      </Action>
    </div>
  ))
}

function Field({ name, component: Component, ...props }) {
  const { configureModule } = useEditor()
  const { module } = useConfiguration()
  const { stock } = useContainer()
  const { validationSchema } = stock.modules.dict[module.type]
  const [error, setError] = useState(null)
  const value = module.config[name]

  return (
    <Component
      {...props}
      style={{ width: "100%" }}
      error={error?.message}
      value={error?.value ?? value}
      onChange={(event) => {
        try {
          /**
           * In case event is SyntheticEvent then extract value, otherwise treat first
           * argument as value.
           */
          const value =
            event.constructor.name === "SyntheticEvent"
              ? event.target.value
              : event
          validationSchema.fields[name]?.validateSync(value)
          setError(null)

          return configureModule(module.id, name, value)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          setError(err)
        }
      }}
    />
  )
}
