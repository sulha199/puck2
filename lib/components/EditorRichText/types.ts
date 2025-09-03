import type { FieldRenderFunctions } from "@measured/puck";

export type EditorRichTextProps = Pick<Parameters<FieldRenderFunctions['textarea']>[0], 'onChange' | 'value'> &{
  onFocus?: () => void
  onBlur?: () => void
  parentId: string;
}