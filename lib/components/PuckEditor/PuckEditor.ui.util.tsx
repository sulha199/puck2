import { type FieldRenderFunctions, type FieldProps, FieldLabel, type Field } from "@measured/puck"
import type { PropsWithChildren } from "react"
import { getPuckComponentNameFromFieldId } from "./PuckEditor.util"

export function FieldTypeContainer<T extends keyof FieldRenderFunctions, FieldType extends { type: T }>(
  props: FieldProps<FieldType, any> & PropsWithChildren<{ name: string }>
) {
  const { children, field, value, name } = props
  return (
    <div
      className={`puck-fields__field puck-fields__field--name_${name} puck-fields__field--type_${field.type} puck-fields__field--value_${value}`}>
      {children}
    </div>
  )
}

export const getConfigFieldVersion = <T extends number>(maxVersionNumber: T) => {
  return {
    type: 'number',
    min: 1 as const,
    max: maxVersionNumber,
    placeholder: `Use latest`,
  } as const satisfies Field<number>
}

export const getConfigFieldCss = () => {
  const styleNames = ['style1', 'style2', 'style3']
  const label = 'CSS'
  return {
    label,
    type: 'custom',
    render: ({ onChange, value, id }) => {
      const componentName = getPuckComponentNameFromFieldId(id)
      const getCheckboxId = (value: string) => `${componentName || ''}__${id}__css__option--${value}`
      const onCheckChange = (e: React.ChangeEvent<HTMLInputElement>, styleName: string) => {
        const styleNameIndex = value?.indexOf(styleName)
        const isStyleNameExist = styleNameIndex >= 0
        if (e.target.checked) {
          if (!isStyleNameExist) {
            onChange(value.concat([styleName]))
          }
        } else {
          if (isStyleNameExist) {
            onChange(value.filter((v) => v != styleName))
          }
        }
      }
      return (
        <>
          <FieldLabel label={label} />
          <div className='bg-light'>
            {styleNames.map((name) => {
              const id = getCheckboxId(name)
              return (
                <div className='form-check' key={id}>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    value={name}
                    id={id}
                    checked={value?.includes(name)}
                    onChange={(e) => onCheckChange(e, name)}
                  />
                  <label className='form-check-label' htmlFor={id}>
                    {name}
                  </label>
                </div>
              )
            })}
          </div>
        </>
      )
    },
  } as const satisfies Field<string[]>
}