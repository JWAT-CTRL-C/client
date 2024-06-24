import { common, createLowlight } from 'lowlight';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
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
