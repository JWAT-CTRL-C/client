import { blogFormType } from '@/libs/types/blogFormType';
import { Container, Grid, useMantineTheme } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import { Image as ImageTiptab } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { BubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
  const editor = useEditor({
    extensions: [
      TextStyle,
      FontFamily.configure({
        types: ['textStyle']
      }),
      Color,
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      ImageTiptab,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write your content here...' })
    ],
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
    <>
      <RichTextEditor
        editor={editor}
        className='mb-1 h-full overflow-clip text-xs'
        style={{
          borderColor: form.errors.blog_cont ? theme.colors.red[7] : '',
          borderRadius: theme.radius.md
        }}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <Container fluid>
            <Grid gutter='xs' grow>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Undo />
                  <RichTextEditor.Redo />
                  <RichTextEditor.ColorPicker colors={colors} />
                </RichTextEditor.ControlsGroup>
              </Grid.Col>
            </Grid>
          </Container>
        </RichTextEditor.Toolbar>

        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Link />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        <RichTextEditor.Content className='min-h-96' />
      </RichTextEditor>
    </>
  );
};

export default TextEditor;
