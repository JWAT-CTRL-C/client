import { blogFormType } from '@/libs/types/blogFormType';
import {
  Autocomplete,
  Button,
  FileInput,
  Group,
  Image,
  Input,
  Select,
  TagsInput,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FaFileImage } from 'react-icons/fa';
import TextEditor from './textEditor';
import { workspacesType } from '@/libs/types/workspacesType';
import { useState } from 'react';

type BlogFormProps = {
  updateValues?: blogFormType;
  handleSubmitForm: (values: blogFormType) => void;
  isEditing?: boolean;
  workSpaceList: workspacesType[];
};

const initialValues: blogFormType = {
  title: '',
  tag: [] as string[],
  workspace: '',
  backgroundImg: null as File | null,
  content: '',
  source: ''
};

const BlogForm = ({ updateValues, handleSubmitForm, isEditing = false, workSpaceList }: BlogFormProps) => {
  const workSpaceListOnlyName = workSpaceList.map((workSpace) => workSpace.workspaceName);
  const sourceList = workSpaceList.map((workSpace) => workSpace.sources);
  const sourceListOnlyname = workSpaceList.map((source) => source.workspaceName);

  const form = useForm({
    initialValues: isEditing ? updateValues : initialValues,

    validate: {
      title: (title) => (title.trim().length === 0 ? 'Title is required' : null),
      tag: (tags) => {
        if (tags.length === 0) return 'Tags are required';

        if (workSpaceList.length === 0 && tags.includes('workspaces'))
          return "You don't belong to any workspace so remove it from tag field";
        return null;
      },
      workspace: (workspace, values) => {
        if (workspace && workspace.trim().length === 0) return 'Workspace is required';

        return null;
      },

      source: (source) => {
        if (source && source.trim().length === 0) return 'Source is required';
        if (source && !sourceListOnlyname.includes(source)) return `${source} not belong to workspaces`;
        return null;
      },
      content: (content) =>
        content.trim().length === 0 || content === '<p></p>' ? 'Content is required' : null
      // backgroundImg: (backgroundImg) => (backgroundImg === null ? 'Background image is required' : null)
    }
  });

  const [indexSelectingField, setIndexSelectingField] = useState(0);

  const handleClearForm = () => {
    form.reset();
    form.setFieldValue('backgroundImg', null);
  };

  const handleSubmit = (values: blogFormType) => {
    handleSubmitForm(values);
  };

  const handleSelectField = (value: string | null) => {
    value && form.setFieldValue('workspace', value);

    const indexSelecting =
      value && workSpaceListOnlyName.findIndex((workspaceName) => workspaceName === value);

    setIndexSelectingField(indexSelecting || 0);

    if (value && !form.getValues().tag.includes('workspaces'))
      form.setFieldValue('tag', [...form.getValues().tag, 'workspaces']);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='flex w-9/12 flex-col gap-3'>
      <TextInput withAsterisk label='Title' placeholder='Title...' {...form.getInputProps('title')} />

      <TagsInput
        withAsterisk
        label='Tag'
        clearable
        placeholder='Tag...'
        onClear={() => form.setFieldValue('tag', [])}
        {...form.getInputProps('tag')}
        onChange={(tag) => {
          form.setFieldValue('tag', tag);
        }}
      />

      <Select
        data={workSpaceListOnlyName}
        disabled={workSpaceList.length === 0}
        label='Workspace'
        placeholder={`${workSpaceList.length === 0 ? "You don't belong to any workspace" : 'Workspace...'}`}
        {...form.getInputProps('workspace')}
        onChange={(workspace) => {
          handleSelectField(workspace);
        }}
      />

      <Autocomplete
        label='Source'
        placeholder='Source...'
        disabled={workSpaceList.length === 0}
        data={sourceList[indexSelectingField].map((source) => source.sourceName)}
        {...form.getInputProps('source')}
      />

      <FileInput
        clearable
        description='Optional'
        rightSection={<FaFileImage />}
        label='Background Image'
        accept='image/*'
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
