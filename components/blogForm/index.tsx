import { blogFormType } from '@/libs/types/blogFormType';
import { Button, FileInput, Group, Image, Input, Select, TagsInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FaFileImage } from 'react-icons/fa';
import TextEditor from './textEditor';

type BlogFormProps = {
  updateValues?: blogFormType;
  handleSubmitForm: (values: blogFormType) => void;
  isEditing?: boolean;
  workSpaceList: string[];
};

const initialValues: blogFormType = {
  title: '',
  tag: [] as string[],
  workspace: '',
  backgroundImg: null as File | null,
  content: ''
};

const BlogForm = ({ updateValues, handleSubmitForm, isEditing = false, workSpaceList }: BlogFormProps) => {
  const form = useForm({
    initialValues: isEditing ? updateValues : initialValues,

    validate: {
      title: (title) => (title.trim().length === 0 ? 'Title is required' : null),
      tag: (tags) => (tags.length === 0 ? 'Tags are required' : null),
      workspace: (workspace, values) => {
        if (
          values.tag.some((tag) => tag.toLowerCase().includes('workspace')) &&
          workspace.trim().length === 0
        ) {
          return 'Workspace is required';
        }
        return null;
      },
      content: (content) =>
        content.trim().length === 0 || content === '<p></p>' ? 'Content is required' : null
      // backgroundImg: (backgroundImg) => (backgroundImg === null ? 'Background image is required' : null)
    }
  });

  const handleClearForm = () => {
    form.reset();
    form.setFieldValue('backgroundImg', null);
  };

  const handleSubmit = (values: blogFormType) => {
    handleSubmitForm(values);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='flex w-9/12 flex-col gap-3'>
      <TextInput withAsterisk label='Title' placeholder='Title...' {...form.getInputProps('title')} />

      <TagsInput
        withAsterisk
        label='Tag'
        description="Type 'workspaces'  to show your workspaces"
        clearable
        placeholder='Tag...'
        onClear={() => form.setFieldValue('tag', [])}
        {...form.getInputProps('tag')}
        onChange={(value) => {
          form.setFieldValue('tag', value);
        }}
      />

      {form.values.tag?.some((tag) => tag.toLowerCase().includes('workspace')) && (
        <Select
          withAsterisk
          data={workSpaceList}
          disabled={workSpaceList.length === 0}
          label='Workspace'
          description={
            workSpaceList.length === 0 &&
            "You don't belong to any workspaces , Please remove 'workspaces' from tag field"
          }
          placeholder='Workspace...'
          {...form.getInputProps('workspace')}
        />
      )}

      <FileInput
        withAsterisk
        clearable
        description='Optional'
        rightSection={<FaFileImage />}
        label='Background Image'
        placeholder='Background Image...'
        {...form.getInputProps('backgroundImg')}
        onChange={(value) => {
          form.setFieldValue('backgroundImg', value);
        }}
      />

      {form.values.backgroundImg && (
        <Image
          src={
            typeof form.getValues().backgroundImg === 'string'
              ? form.getValues().backgroundImg
              : URL.createObjectURL(form.values.backgroundImg! as File)
          }
          alt='Background Image Preview'
        />
      )}

      <Input.Wrapper withAsterisk label='Content' error={form.errors.content}>
        <TextEditor form={form} />
      </Input.Wrapper>

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
