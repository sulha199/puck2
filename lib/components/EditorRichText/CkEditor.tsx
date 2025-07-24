import { CKEditor as CKEditorReact, useCKEditorCloud } from '@ckeditor/ckeditor5-react'
import { type FieldRenderFunctions, type TextareaField } from '@measured/puck'
import { FieldLabel } from '@measured/puck'
import { useRef } from 'react'

export const PuckCkEditor: FieldRenderFunctions['textarea'] = (props) => {
  const cloud = useCKEditorCloud({
    version: '45.2.1',
    premium: true,
  })
  const value = useRef(props.value);

  if (cloud.status === 'error') {
    return <div>CK Editor Error! {JSON.stringify(cloud.error)}</div>
  }

  if (cloud.status === 'loading') {
    return <div>Loading...</div>
  }

  const { Heading, ClassicEditor, Essentials, Paragraph, Bold, Italic, FontColor } = cloud.CKEditor

  return (
    <>
      {props.field.label && <FieldLabel label={props.field.label} />}
      <CKEditorReact
        editor={ClassicEditor}
        data={value.current}
        id={props.id}
        config={{
          licenseKey:
            'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODE5MTM1OTksImp0aSI6IjJiNWUzNWMzLTU1OWYtNDhiZC1iMjY2LWQzZjQxMTRlNjM2MyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6ImQyODNjZWJlIn0.-Co3PT_GcXVDitIpzTrQ7kHtTBiCnjo0fQb4LzM_-4zq6DX3VdCQ8swANHTUYCP9m64jLbi4OiNCHvHF6eYy-A',
          plugins: [Essentials, Paragraph, Bold, Italic, Heading, FontColor],
          toolbar: ['undo', 'redo', '|', 'heading', '|', 'fontColor', '|', 'bold', 'italic', '|'],
        }}
        onChange={(event, editor) => props.onChange(editor.getData())}
      />
    </>
  )
}
