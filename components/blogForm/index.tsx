import { Button, FileInput, Group, Image, Select, TagsInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FaFileImage } from 'react-icons/fa';

const initialValues = {
  title: '',
  tag: [] as string[],
  workspace: '',
  backgroundImg: null as File | null
};

const BlogForm = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,

    validate: {
      title: (title) => (title.trim().length === 0 ? 'Title is required' : null),
      tag: (tags) => (tags.length === 0 ? 'Tags is required' : null),
      workspace: (workspace, values) => {
        if (
          values.tag.some((tag) => tag.toLowerCase().includes('workspace')) &&
          workspace.trim().length === 0
        ) {
          return 'Title is required';
        }
        return null;
      }
      // backgroundImg: (backgroundImg) => (backgroundImg === null ? 'Background image is required' : null)
    }
  });

  const editor = useEditor({
    extensions: [Document, Paragraph, Text, StarterKit],

    content: '<b>Write your blog here! 🌎️</b>',
    injectCSS: true
  });

  const workSpaceList = ['ábc', 'Angular', 'React ', 'Vue'];

  const handleClearForm = () => {
    form.reset();
    form.setFieldValue('backgroundImg', null);
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='flex w-9/12 flex-col gap-3'>
      <TextInput
        withAsterisk
        label='Title'
        placeholder='Title...'
        key={form.key('title')}
        {...form.getInputProps('title')}
      />

      <TagsInput
        withAsterisk
        label='Tag'
        clearable
        placeholder='Tag...'
        key={form.key('tag')}
        onClear={() => form.setFieldValue('tag', [])}
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter') {
        //     e.preventDefault();
        //     setTags([...tags, e.currentTarget.value]);
        //   }
        // }}
        {...form.getInputProps('tag')}
        onChange={(value) => {
          form.setFieldValue('tag', value);
        }}
      />

      {form.getValues().tag.some((tag) => tag.toLowerCase().includes('workspace')) && (
        <Select
          withAsterisk
          clearable
          data={workSpaceList}
          defaultValue={workSpaceList[0]}
          label='workspace'
          placeholder='Workspace...'
          key={form.key('workspace')}
          {...form.getInputProps('workspace')}
        />
      )}

      <FileInput
        withAsterisk
        clearable
        description='Optional'
        rightSection={<FaFileImage />}
        value={form.getValues().backgroundImg}
        label='Background Image'
        placeholder='Background Image...'
        {...form.getInputProps('backgroundImg')}
        onChange={(value) => {
          form.setFieldValue('backgroundImg', value);
        }}
      />

      {form.getValues().backgroundImg && (
        <Image src={URL.createObjectURL(form.getValues().backgroundImg!)} alt='Background Image Preview' />
      )}

      <EditorContent className='w-full bg-slate-950' editor={editor} />

      <Group justify='space-between' mt='md'>
        <Button variant='outline' type='reset' onClick={handleClearForm}>
          Clear
        </Button>

        <Button type='submit'>Save</Button>
      </Group>
    </form>
  );
};

export default BlogForm;
