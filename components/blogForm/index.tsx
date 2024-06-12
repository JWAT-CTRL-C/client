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
import { useEffect, useState } from 'react';

type BlogFormProps = {
  updateValues?: blogFormType;
  handleSubmitForm: (values: blogFormType) => void;
  isEditing?: boolean;
  workSpaceList?: workspacesType[];
};

const initialValues: blogFormType = {
  blog_tle: '',
  blog_tag: [],
  blog_wksp: null,
  blog_img: null as File | null,
  blog_cont: '',
  blog_src: null
};

const BlogForm = ({
  updateValues,
  handleSubmitForm,
  isEditing = false,
  workSpaceList = []
}: BlogFormProps) => {
  const workSpaceListOnlyName = workSpaceList.map((workSpace) => workSpace.wksp_name);
  const sourceList = workSpaceList.map((workSpace) => workSpace.wksp_src);
  //const sourceListOnlyname = workSpaceList.map((source) => source.wksp_name);

  const form = useForm({
    initialValues: isEditing ? updateValues : initialValues,

    validate: {
      blog_tle: (blog_tle) => (blog_tle.trim().length === 0 ? 'Title is required' : null),
      blog_tag: (blog_tags) => {
        // if (blog_tags.length === 0) return 'Tags are required';

        if (workSpaceList.length === 0 && blog_tags.includes('workspaces'))
          return "You don't belong to any workspace so remove it from tag field";
        return null;
      },
      blog_wksp: (blog_wksp, values) => {
        if (blog_wksp && blog_wksp.trim().length === 0) return 'Workspace is required';

        return null;
      },

      blog_src: (blog_src) => {
        if (blog_src && blog_src.trim().length === 0) return 'Source is required';

        return null;
      },
      blog_cont: (blog_cont) =>
        blog_cont.trim().length === 0 || blog_cont === '<p></p>' ? 'Content is required' : null
      //blog_img: (blog_img) => (blog_img === null ? 'Background image is required' : null)
    }
  });

  const [indexSelectingField, setIndexSelectingField] = useState(0);

  function handleClearForm() {
    form.setValues(initialValues);
    // form.setFieldValue('blog_wksp', null);
    // form.setFieldValue('blog_tle', '');
    // form.setFieldValue('blog_tag', []);
    // form.setFieldValue('blog_src', '');
    // form.setFieldValue('blog_img', null);
    // form.setFieldValue('blog_cont', '');
  }

  const handleSubmit = (values: blogFormType) => {
    handleSubmitForm(values);
  };
  const handleSelectField = (value: string | null) => {
    const selectedWorkspace = workSpaceList.find((workspace) => workspace.wksp_id === value);
    form.setFieldValue('blog_wksp', selectedWorkspace ? selectedWorkspace.wksp_id : null);

    const indexSelecting = selectedWorkspace
      ? workSpaceList.findIndex((workspace) => workspace.wksp_id === selectedWorkspace.wksp_id)
      : 0;

    setIndexSelectingField(indexSelecting);

    if (selectedWorkspace && !form.getValues().blog_tag.includes('workspaces')) {
      form.setFieldValue('blog_tag', [...form.getValues().blog_tag, 'workspaces']);
    }
  };

  const handleSourceField = (value: string | null) => {
    const selectedSource = sourceList[indexSelectingField]?.find((source) => source.src_id === value);
    form.setFieldValue('blog_src', selectedSource ? selectedSource.src_id : null);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='flex w-9/12 flex-col gap-3'>
      <TextInput withAsterisk label='Title' placeholder='Title...' {...form.getInputProps('blog_tle')} />

      <TagsInput
        label='Tag'
        clearable
        description='Optional'
        placeholder='Tag...'
        onClear={() => form.setFieldValue('blog_tag', [])}
        {...form.getInputProps('blog_tag')}
        onChange={(blog_tag) => {
          form.setFieldValue('blog_tag', blog_tag);
        }}
      />
      <Select
        data={workSpaceList.map((workspace) => ({ value: workspace.wksp_id, label: workspace.wksp_name }))}
        checkIconPosition='right'
        description='Optional'
        clearable
        allowDeselect={false}
        onClear={() => {
          form.setFieldValue('blog_wksp', '');
          if (form.getValues().blog_tag.includes('workspaces')) {
            form.setFieldValue(
              'blog_tag',
              form.getValues().blog_tag.filter((blog_tag) => blog_tag !== 'workspaces')
            );
          }
        }}
        disabled={workSpaceList.length === 0}
        label='Workspaces'
        placeholder={`${workSpaceList.length === 0 ? "You don't belong to any workspace" : 'Workspace...'}`}
        {...form.getInputProps('blog_wksp')}
        onChange={(blog_wksp) => handleSelectField(blog_wksp)}
      />

      <Autocomplete
        label='Resource'
        description='Optional'
        placeholder={`${!sourceList[indexSelectingField] ? 'No resource to find' : 'Resource...'}`}
        disabled={workSpaceList.length === 0 || !sourceList[indexSelectingField]}
        data={
          form.getValues().blog_wksp
            ? sourceList[indexSelectingField]?.map((source) => ({
                value: source.src_id,
                label: source.src_name
              }))
            : []
        }
        {...form.getInputProps('blog_src')}
        onChange={(source) => handleSourceField(source)}
      />

      <FileInput
        clearable
        description='Optional'
        rightSection={<FaFileImage />}
        label='Background Image'
        accept='image/*'
        placeholder='Background Image...'
        {...form.getInputProps('blog_img')}
        onChange={(value) => {
          form.setFieldValue('blog_img', value);
        }}
      />

      {form.values.blog_img && (
        <Image
          src={
            typeof form.getValues().blog_img === 'string'
              ? form.getValues().blog_img
              : URL.createObjectURL(form.values.blog_img! as File)
          }
          alt='Background Image Preview'
        />
      )}

      <Input.Wrapper withAsterisk label='Content' error={form.errors.blog_cont}>
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
