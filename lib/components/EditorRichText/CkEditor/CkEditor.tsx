import { CKEditor as CKEditorReact } from '@ckeditor/ckeditor5-react'
// import TableClassesPlugin from 'ckeditor5-table-classes/src/tableclasses';
import { type FieldRenderFunctions } from '@measured/puck'

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
  Editor,
  EventInfo,
} from 'ckeditor5'
// import { ClassicEditor, } from 'ckeditor5'
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

// import { Bold ,Italic} from '@ckeditor/ckeditor5-basic-styles'
// import { Heading } from '@ckeditor/ckeditor5-heading'
// import { FontColor } from '@ckeditor/ckeditor5-font'
import 'ckeditor5/ckeditor5.css'
import './CkEditor.scss'
import MergeFields from './CkEditor.plugin.MergeFields'
import type { EditorRichTextProps } from '../types'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { RENDERER_TEXTAREA_RESYNC_EDITOR_VALUE_DEBOUNCE } from 'lib/shared/const'

class ClassicEditorCustom extends ClassicEditor {}

ClassicEditorCustom.builtinPlugins = [
  // TableClassesPlugin
]

export const PuckCkEditor = memo(
  function <TEditor extends Editor = ClassicEditorCustom>(
    props: EditorRichTextProps & {
      editor?: CKEditorReact<TEditor>['editor']
    }
  ): ReturnType<FieldRenderFunctions['textarea']> {
    const editorInstanceRef = useRef<CKEditorReact<TEditor>>(null)
    const { value, editor, onChange, onBlur, onFocus, parentId } = props
    const propsValue = value as string | undefined
    const editorEditorInstance = editorInstanceRef.current?.editor

    const isNeedToSyncEditorValue = useMemo(() => {
      const editorEditorData = editorEditorInstance?.getData()
      return propsValue && propsValue.trim() != editorEditorData?.trim()
    }, [propsValue, editorEditorInstance])

    const [isNeedToSyncEditorValueDebounced] = useDebounceValue(
      isNeedToSyncEditorValue,
      RENDERER_TEXTAREA_RESYNC_EDITOR_VALUE_DEBOUNCE
    )

    useEffect(() => {
      if (propsValue && isNeedToSyncEditorValueDebounced) {
        ;((rawHtmlTextValue: string) => {
          const editorEditorData = editorEditorInstance?.getData()
          if (editorEditorInstance && editorEditorData && editorEditorData.trim() !== rawHtmlTextValue?.trim()) {
            editorEditorInstance.setData(rawHtmlTextValue || '')
          }
        })(propsValue)
      }
    }, [isNeedToSyncEditorValueDebounced])

    const onEditorChange = useCallback(
      (event: EventInfo, editor: TEditor) => {
        const value = editor.getData()
        if (value != propsValue) {
          onChange(value)
        }
      },
      [onChange, propsValue]
    )
    const renderResult = useMemo(() => {
      return (
        <CKEditorReact<TEditor>
          editor={editor || (ClassicEditorCustom as any)}
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
            initialData: propsValue || '',
            toolbar: {
              shouldNotGroupWhenFull: true,
              items: [
                'undo',
                'redo',
                '|',
                'heading', // {

                //   label: 'Style',
                //   icon: 'plus',
                //   items: [
                //     'heading', 'style',
                //   ],
                //   withText: true,
                // },
                '|',
                'fontColor',
                'fontSize',
                'fontFamily',
                'fontBackgroundColor',
                '|',
                'alignment',
                'outdent',
                'indent',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'code',
                '|',
                '-',
                'insertTable',
                '|',
                'link',
                '|',
                'mergeFields',
                '|',
                'bulletedList',
                'numberedList',
                'toDoList',
                '|',
                'horizontalLine',
                '|',
              ],
            },
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
          onChange={onEditorChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={(editorInstance) => {
            // editorInstance?.editor?.setData(props.value)
            if (editorInstance) {
              editorInstanceRef.current = editorInstance
            }
          }}
        />
      )
    }, [editor, onFocus, onBlur, onEditorChange])
    return renderResult
  },
  (prevProps, { onChange, parentId, editor, onBlur, onFocus }) => {
    return !(
      prevProps.onChange != onChange ||
      prevProps.editor != editor ||
      prevProps.onBlur != onBlur ||
      prevProps.onFocus != onFocus
    )
  }
)
