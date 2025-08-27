// import type { Mention } from '';

// import { Plugin } from '@ckeditor/ckeditor5-core'
import type { Field } from '@azavista/advanced-search'
import { addListToDropdown, Collection, createDropdown, ViewModel, Plugin, SplitButtonView, type ListDropdownButtonDefinition, type ListDropdownGroupDefinition, ButtonView, DropdownButtonView } from 'ckeditor5'
import type { PuckEditorDictionary } from 'lib/components/PuckEditor/type'

export default class CkEditorPluginMergeFields extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [] as const
  }
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'MergeFields' as const
  }

  static participantFields: Field[] = []

  static dictionary: PuckEditorDictionary = {};

  init() {
    const editor = this.editor
    editor.ui.componentFactory.add('mergeFields', (locale) => {
      
      const dropdownView = createDropdown(locale, DropdownButtonView)
      dropdownView.buttonView.set({
        withText: true,
        label: 'Merge Tags',
        tooltip: true,
        isOn: false,
        
      })
      const participantItems = new Collection<ListDropdownButtonDefinition>()
      CkEditorPluginMergeFields.participantFields.forEach((field) =>
        participantItems.add({
          model: new ViewModel({
            withText: true,
            label: `{{participant.${field.name}}}`,
          }),
          type: 'button',
        })
      )
      const dictionaryItems = new Collection<ListDropdownButtonDefinition>()
      Object.keys(Object.values(CkEditorPluginMergeFields.dictionary)[0] || {}).forEach((key) =>
        dictionaryItems.add({
          model: new ViewModel({
            withText: true,
            label: `{{dictionary.${key}}}`,
          }),
          type: 'button',
        })
      )

      const items = new Collection<ListDropdownGroupDefinition>()
      items.add({
        items: participantItems,
        label: 'Participant',
        type: 'group'
      })
      items.add({
        type: 'group',
        items: dictionaryItems,
        label: 'Dictionary'
      })
      addListToDropdown(dropdownView, items)
      dropdownView.on('execute', (event) => {
        const eventSourceButtonView = event.source as ButtonView;
        if (eventSourceButtonView.label && eventSourceButtonView.label?.startsWith('{{')) {
          // Change the model to insert the text.
          editor.model.change( writer => {
            editor.model.insertContent(
              writer.createText( eventSourceButtonView.label || '' )
            );
          } );
        }
      })

      return dropdownView
    })
  }
}
