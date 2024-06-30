import { common, createLowlight } from 'lowlight';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { EditorOptions, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

/**
 * The `useCustomEditor` function in TypeScript is a custom editor hook that initializes an editor with
 * specified extensions and content.
 */
export const useCustomEditor = ({
  content,
  placeholder,
  extensions = [],
  ...props
}: Partial<EditorOptions> & { placeholder?: string }) => {
  const lowlight = createLowlight(common);

  const editor = useEditor(
    {
      content,
      extensions: [
        StarterKit.configure({
          codeBlock: false
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        TextStyle,
        Color,
        Superscript,
        Subscript,
        Underline,
        Link.configure({
          openOnClick: 'whenNotEditable'
        }),
        Placeholder.configure({ placeholder: placeholder || 'Write your content here...' }),
        Highlight,
        CodeBlockLowlight.configure({ lowlight }),
        Image
      ].concat(extensions),
      ...props
    },
    []
  );

  return editor;
};
