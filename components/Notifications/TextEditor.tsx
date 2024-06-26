import { useCustomEditor } from '@/libs/hooks/useCustomEditor';
import { useMantineTheme } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { BubbleMenu } from '@tiptap/react';
import { useEffect } from 'react';

const TextEditor = ({ form }: { form: UseFormReturnType<{ noti_tle: string; noti_cont: string }> }) => {
  const editor = useCustomEditor({
    onUpdate({ editor }) {
      form.setFieldValue('noti_cont', editor.getHTML());
      form.validateField('noti_cont');
    },
    content: form.getValues().noti_cont
  });

  const theme = useMantineTheme();

  useEffect(() => {
    if (editor && form.values.noti_cont !== editor.getHTML()) {
      editor.commands.setContent(form.values.noti_cont, false);
    }
  }, [form.values.noti_cont, editor]);

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor
      editor={editor}
      className='mb-1 h-full overflow-clip'
      style={{
        borderColor: form.errors.noti_cont ? theme.colors.red[7] : '',
        borderRadius: theme.radius.md
      }}>
      <RichTextEditor.Toolbar sticky stickyOffset={80}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.Highlight />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <BubbleMenu editor={editor}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Link />
        </RichTextEditor.ControlsGroup>
      </BubbleMenu>

      <RichTextEditor.Content className='min-h-24' />
    </RichTextEditor>
  );
};

export default TextEditor;
