// import type { Mention } from '';

// import { Plugin } from '@ckeditor/ckeditor5-core'
import { addListToDropdown, Collection, createDropdown, ViewModel, Plugin, SplitButtonView, type ListDropdownButtonDefinition, type ListDropdownGroupDefinition, ButtonView, DropdownButtonView } from 'ckeditor5'

// import Model from '@ckeditor/ckeditor5-ui/src/model'
// import { addListToDropdown, createDropdown, type ListDropdownButtonDefinition, type ListDropdownGroupDefinition } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
// import SplitButtonView from '@ckeditor/ckeditor5-ui/src/dropdown/button/splitbuttonview'
// import { Collection } from '@ckeditor/ckeditor5-utils'
import { dictionary, participant } from 'lib/shared/data'

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
      Object.keys(participant).forEach((key) =>
        participantItems.add({
          model: new ViewModel({
            withText: true,
            label: `{{participant.${key}}}`,
          }),
          type: 'button',
        })
      )
      const dictionaryItems = new Collection<ListDropdownButtonDefinition>()
      Object.keys(dictionary.en_us).forEach((key) =>
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
