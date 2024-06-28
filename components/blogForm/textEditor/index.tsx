import { useCustomEditor } from '@/libs/hooks/useCustomEditor';
import { blogFormType } from '@/libs/types/blogFormType';
import { useMantineTheme } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { BubbleMenu } from '@tiptap/react';
import { useEffect } from 'react';

const colors = [
  '#25262b',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14'
];

const TextEditor = ({ form }: { form: UseFormReturnType<blogFormType> }) => {
  const editor = useCustomEditor({
    onUpdate({ editor }) {
      form.setFieldValue('blog_cont', editor.getHTML());
      form.validateField('blog_cont');
    },
    content: form.getValues().blog_cont
  });

  const theme = useMantineTheme();

  useEffect(() => {
    if (editor && form.values.blog_cont !== editor.getHTML()) {
      editor.commands.setContent(form.values.blog_cont, false);
    }
  }, [form.values.blog_cont, editor]);

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor
      editor={editor}
      className='mb-1 h-full overflow-clip'
      style={{
        borderColor: form.errors.blog_cont ? theme.colors.red[7] : '',
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
          <RichTextEditor.Code />
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
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ColorPicker colors={colors} />

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

      <RichTextEditor.Content className='min-h-48' />
    </RichTextEditor>
  );
};

export default TextEditor;
