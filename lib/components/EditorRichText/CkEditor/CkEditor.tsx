import { CKEditor as CKEditorReact } from '@ckeditor/ckeditor5-react'
import { type FieldRenderFunctions } from '@measured/puck'

import { FieldLabel } from '@measured/puck'
import { ClassicEditor, Bold, Heading, FontColor, Italic, Essentials } from 'ckeditor5'
// import { ClassicEditor, } from 'ckeditor5'
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { useEffect, useRef } from 'react'

// import { Bold ,Italic} from '@ckeditor/ckeditor5-basic-styles'
// import { Heading } from '@ckeditor/ckeditor5-heading'
// import { FontColor } from '@ckeditor/ckeditor5-font'
import 'ckeditor5/ckeditor5.css';
import MergeFields from './CkEditor.plugin.MergeFields'

export const PuckCkEditor: FieldRenderFunctions['textarea'] = (props) => {
  // const cloud = useCKEditorCloud({
  //   version: '32.0.0',
  //   premium: true,
  // })
  const value = useRef(props.value)
  const editorInstanceRef = useRef<CKEditorReact<ClassicEditor>>(null)

  // if (cloud.status === 'error') {
  //   return <div>CK Editor Error! {JSON.stringify(cloud.error)}</div>
  // }

  // if (cloud.status === 'loading') {
  //   return <div>Loading...</div>
  // }

  // const { Heading, ClassicEditor, Essentials, Paragraph, Bold, Italic, FontColor, ImageUtils, ImageEditing, Mention } =
  //   cloud.CKEditor
  // const { MergeFields } = cloud.CKEditorPremiumFeatures

  // console.log(MergeFields)e
  

  return (
    <>
      {props.field.label && <FieldLabel label={props.field.label} />}
      <CKEditorReact
        editor={ClassicEditor}
        config={{
          licenseKey:
            '',
          plugins: [Essentials, Bold, Heading, FontColor, Italic, MergeFields],
          initialData: props.value || '',
          // toolbar: ['undo', 'redo', '|', 'heading', '|', 'mergeFields', '|', 'fontColor', '|', 'bold', 'italic', '|'],
          toolbar: {
            items: ['heading', '|', 'mergeFields', '|', 'fontColor', '|', 'bold', 'italic', '|'],
            shouldNotGroupWhenFull: true,
          },
        }}
        onChange={(event, editor) => props.onChange(editor.getData())}
        ref={(editorInstance) => {
          // editorInstance?.editor?.setData(props.value)
          editorInstanceRef.current = editorInstance;
          
        }}
      />
    </>
  )
}
