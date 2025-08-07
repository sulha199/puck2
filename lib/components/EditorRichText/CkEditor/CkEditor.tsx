import { CKEditor as CKEditorReact } from '@ckeditor/ckeditor5-react'
// import TableClassesPlugin from 'ckeditor5-table-classes/src/tableclasses';
import { type FieldRenderFunctions } from '@measured/puck'

import { FieldLabel } from '@measured/puck'
import {
  ClassicEditor,
  Bold,
  Heading,
  FontColor,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Essentials,
  Table,
  TableToolbar,
  Style,
  Link,
  HorizontalLine,
  GeneralHtmlSupport,
  List,
  Paragraph,
  FontSize,
  FontFamily,
  FontBackgroundColor,
  Subscript,
  Superscript,
  Alignment,
  TodoList,
  Indent,
  IndentBlock,
  TableSelection,
  AutoLink,
  LinkEditing,
} from 'ckeditor5'
// import { ClassicEditor, } from 'ckeditor5'
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { useEffect, useRef } from 'react'

// import { Bold ,Italic} from '@ckeditor/ckeditor5-basic-styles'
// import { Heading } from '@ckeditor/ckeditor5-heading'
// import { FontColor } from '@ckeditor/ckeditor5-font'
import 'ckeditor5/ckeditor5.css'
import './CkEditor.scss'
import MergeFields from './CkEditor.plugin.MergeFields'

class ClassicEditorCustom extends ClassicEditor {}

ClassicEditorCustom.builtinPlugins = [
  // TableClassesPlugin
];

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
        editor={ClassicEditorCustom}
        config={{
          licenseKey: '',
          plugins: [
            Essentials,
            Heading,

            FontColor,
            FontSize,
            FontFamily,
            FontBackgroundColor,

            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,

            Alignment,
            Indent,
            IndentBlock,

            Table,
            TableToolbar,
            TableSelection,

            MergeFields,

            List,
            TodoList,

            Style,

            Link,
            AutoLink,
            LinkEditing,

            HorizontalLine,
            GeneralHtmlSupport,
            Paragraph,
          ],
          initialData: props.value || '',
          toolbar: {
            shouldNotGroupWhenFull: true,
            items:[
            'undo', 'redo', '|',
             'heading',// {
                //   label: 'Style',
                //   icon: 'plus',
                //   items: [
                //     'heading', 'style',
                //   ],
                //   withText: true,
                // },
                '|',
                'fontColor', 'fontSize', 'fontFamily', 'fontBackgroundColor', '|',
                'alignment', 'outdent', 'indent', '|',
                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', '|',
                '-',
                'insertTable', '|' ,
                'link', '|',
                'mergeFields','|',
                'bulletedList', 'numberedList', 'toDoList', '|', 
                'horizontalLine', '|',
          ]},
          // toolbar: {
          //   items: [, '|', 'fontColor', '|', 'bold', 'italic', '|', 'link', 'insertTable',  'bulletedList', 'numberedList', 'horizontalLine'],
          //   shouldNotGroupWhenFull: true,
          // },
          style: {
            definitions: [
              ...new Array(6).fill(null).map((_, index) => ({
                name: `h${index + 1}. Bootstrap heading`,
                element: `h${index + 1}`,
                classes: [],
              })),
              {
                name: 'Paragraph',
                element: 'p',
                classes: [''],
              },
              {
                name: 'Paragraph Lead',
                element: 'p',
                classes: ['lead'],
              },
            ],
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: '' },
              // { model: 'paragraph', title: 'Paragraph Lead', class: 'lead' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: '' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: '' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: '' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: '' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: '' },
            ],
          },
          link: {
            // toolbar: [ 'linkPreview', '|', 'editLink', 'linkProperties', 'unlink' ]
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
            tableToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onChange={(event, editor) => props.onChange(editor.getData())}
        ref={(editorInstance) => {
          // editorInstance?.editor?.setData(props.value)
          editorInstanceRef.current = editorInstance
        }}
      />
    </>
  )
}
