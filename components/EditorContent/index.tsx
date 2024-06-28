import { useEffect } from 'react';

import { useCustomEditor } from '@/libs/hooks/useCustomEditor';
import { cn } from '@/libs/utils';
import { EditorContent } from '@tiptap/react';

export interface IShowContentProps {
  className?: string;
  content: string;
}

export default function ShowContent({ content, className }: IShowContentProps) {
  const editor = useCustomEditor({ content, editable: false });

  useEffect(() => {
    if (editor) editor.commands.setContent(content);
  }, [content]);

  return <EditorContent className={cn('overflow-hidden *:outline-none', className)} editor={editor} />;
}
