import { useEffect, useState } from 'react';
import { FaFileImage, FaTimes } from 'react-icons/fa';

import { showErrorToast } from '@/components/shared/toast';
import { blogFormType } from '@/libs/types/blogFormType';
import { workspacesType } from '@/libs/types/workspacesType';
import {
  ActionIcon,
  AspectRatio,
  Button,
  FileInput,
  Flex,
  Group,
  Image,
  Input,
  Select,
  TagsInput,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';

import TextEditor from './textEditor';

const MAX_IMAGE_SIZE = 1024 * 1024 * 3; // 3MB

type BlogFormPropsBase = {
  handleSubmitForm: (values: blogFormType) => void;
  workSpaceList: Pick<workspacesType, 'wksp_id' | 'wksp_name' | 'resources'>[];
  fromWorkspacesPage?: {
    wksp_id?: string | string[];
    resrc_id?: string | string[];
  };
};

type BlogFormPropsEditing = BlogFormPropsBase & {
  isEditing: true;
  updateValues: blogFormType;
};

type BlogFormPropsNotEditing = BlogFormPropsBase & {
  isEditing?: false;
  updateValues?: undefined;
};

type BlogFormProps = BlogFormPropsEditing | BlogFormPropsNotEditing;

const initialValues: blogFormType = {
  blog_tle: '',
  blog_tag: [],
  blog_wksp: null,
  blog_img: null as File | null,
  blog_cont: '',
  blog_src: ''
};

const BlogForm = ({
  updateValues,
  handleSubmitForm,
  isEditing = false,
  workSpaceList,
  fromWorkspacesPage
}: BlogFormProps) => {
  const [indexSelectingField, setIndexSelectingField] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [prevTag, setPrevTag] = useState<string[]>([]);

  const workSpaceListOptions = workSpaceList?.map((workSpace) => ({
    value: workSpace?.wksp_id,
    label: workSpace?.wksp_name
  }));
  const sourceList = workSpaceList && workSpaceList?.map((workSpace) => workSpace?.resources);

  const form = useForm({
    initialValues: isEditing ? updateValues : initialValues,

    validate: {
      blog_tle: (blog_tle) => (blog_tle.trim().length === 0 ? 'Title is required' : null),
      blog_tag: (blog_tags) => {
        if (workSpaceList.length === 0 && blog_tags.includes('workspaces'))
          return "You don't belong to any workspace so remove it from tag field";
        if (blog_tags.includes('workspaces') && !form.values.blog_wksp) return 'Select workspace first';
        if (!blog_tags.includes('workspaces') && form.values.blog_wksp)
          return 'You must add workspaces tag first';
        return null;
      },
      blog_wksp: (blog_wksp) => {
        if (blog_wksp && blog_wksp.trim().length === 0) return 'Workspace is required';
        return null;
      },
      blog_src: (blog_src) => {
        if (blog_src && blog_src?.trim()?.length === 0) return 'Resource is required';

        return null;
      },
      blog_cont: (blog_cont) =>
        blog_cont.trim().length === 0 || blog_cont === '<p></p>' ? 'Content is required' : null,

      blog_img: (blog_img) => {
        if (blog_img && typeof blog_img !== 'string' && blog_img.size > MAX_IMAGE_SIZE) {
          return `Image size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`;
        }
        return null;
      }
    }
  });

  useEffect(() => {
    if (isEditing && updateValues) {
      form.setValues(updateValues);
      setSelectedSource(updateValues.blog_src ?? null);
    }
  }, [isEditing, updateValues]);

  useEffect(() => {
    if (form.getValues().blog_wksp) {
      const selectedWorkspace = workSpaceList.find(
        (workspace) => workspace.wksp_id === form.getValues().blog_wksp
      );
      const indexSelecting = selectedWorkspace
        ? workSpaceList.findIndex((workspace) => workspace.wksp_id === selectedWorkspace.wksp_id)
        : 0;
      setIndexSelectingField(indexSelecting);
    }
  }, [form.getValues().blog_wksp, workSpaceList]);

  useEffect(() => {
    if (fromWorkspacesPage?.resrc_id && fromWorkspacesPage?.wksp_id) {
      const findWorkspaceFromWorkspacePage = workSpaceList.find(
        (wksp) => wksp.wksp_id === fromWorkspacesPage.wksp_id
      );

      if (findWorkspaceFromWorkspacePage) {
        handleSelectField(findWorkspaceFromWorkspacePage.wksp_id);
        const findResourceFromWorkspacePage = sourceList[indexSelectingField].find(
          (resrc) => resrc.resrc_id === fromWorkspacesPage.resrc_id
        );
        findResourceFromWorkspacePage &&
          !findResourceFromWorkspacePage.blog &&
          handleSourceField(findResourceFromWorkspacePage.resrc_id);
      }
    } else {
      handleClearForm();
    }
  }, [fromWorkspacesPage?.resrc_id, fromWorkspacesPage?.wksp_id]);

  function handleClearForm() {
    form.setValues(initialValues);
    setSelectedSource(null);
  }

  const handleSubmit = (values: blogFormType) => {
    handleSubmitForm({ ...values, blog_src: selectedSource });
  };

  const handleSelectField = (value: string | null) => {
    const selectedWorkspace = workSpaceList.find((workspace) => workspace.wksp_id === value);
    form.setFieldValue('blog_wksp', selectedWorkspace ? selectedWorkspace.wksp_id : null);

    const indexSelecting = selectedWorkspace
      ? workSpaceList.findIndex((workspace) => workspace.wksp_id === selectedWorkspace.wksp_id)
      : 0;

    setIndexSelectingField(indexSelecting);

    if (selectedWorkspace && !form.getValues().blog_tag.includes('workspaces')) {
      form.setFieldValue('blog_tag', (prevTag) => [...prevTag, 'workspaces']);
      setPrevTag((prevTag) => [...prevTag, 'workspaces']);
    }
  };

  const handleSourceField = (value: string | null) => {
    setSelectedSource(value);
    form.setFieldValue('blog_src', value);
  };

  const handleClearWorkspaceFiled = () => {
    form.setFieldValue('blog_wksp', '');
    if (form.getValues().blog_tag.includes('workspaces')) {
      form.setFieldValue('blog_tag', (prevTag) => prevTag.filter((tag) => tag !== 'workspaces'));
    }
  };
  const handleClearTagField = () => {
    if (prevTag.includes('workspaces')) {
      form.setFieldValue('blog_wksp', null);
    }
    setPrevTag([]);

    form.setFieldValue('blog_tag', []);
  };

  const handleClearImage = () => {
    form.setFieldValue('blog_img', null);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='flex w-9/12 flex-col gap-3'>
      <TextInput withAsterisk label='Title' placeholder='Title...' {...form.getInputProps('blog_tle')} />

      <TagsInput
        label='Tag'
        clearable
        description='Optional'
        onDuplicate={(tag) => showErrorToast(`Tag "${tag}" already exists`)}
        placeholder='Tag...'
        splitChars={[',', ' ', '|']}
        {...form.getInputProps('blog_tag')}
        onChange={(blog_tag) => {
          if (isEditing && blog_tag.includes('workspaces') && !form.values.blog_wksp) {
            showErrorToast('You can not add workspaces tag in editing mode');
            return;
          }
          if (isEditing && !blog_tag.includes('workspaces') && form.values.blog_wksp) {
            showErrorToast('You can not remove workspaces tag in editing mode');
            return;
          }
          setPrevTag((prevTag) => [...prevTag, ...blog_tag]);
          form.setFieldValue('blog_tag', blog_tag);
          if (blog_tag.includes('workspaces') && workSpaceList.length > 0 && !form.values.blog_wksp) {
            form.setFieldValue('blog_wksp', workSpaceList[0]?.wksp_id);
          } else if (!blog_tag.includes('workspaces') && form.values.blog_wksp) {
            form.setFieldValue('blog_wksp', null);
          }
        }}
        onClear={handleClearTagField}
      />

      <Select
        data={workSpaceListOptions}
        checkIconPosition='right'
        description='Optional'
        clearable
        searchable
        maxDropdownHeight={200}
        //allowDeselect={false}
        onClear={handleClearWorkspaceFiled}
        readOnly={isEditing}
        disabled={workSpaceList.length === 0 || isEditing}
        label='Workspaces'
        placeholder={`${workSpaceList.length === 0 ? "You don't belong to any workspace" : 'Workspace...'}`}
        {...form.getInputProps('blog_wksp')}
        onChange={(blog_wksp) => handleSelectField(blog_wksp)}
      />

      <Select
        label='Resource'
        description='Optional'
        searchable
        checkIconPosition='right'
        clearable
        nothingFoundMessage='Nothing found...'
        maxDropdownHeight={200}
        placeholder={`${sourceList[indexSelectingField]?.length === 0 ? 'No resource to find' : 'Resource...'}`}
        readOnly={isEditing}
        disabled={
          workSpaceList.length === 0 ||
          sourceList[indexSelectingField]?.length === 0 ||
          isEditing ||
          !form.getValues().blog_wksp
        }
        data={
          form.getValues().blog_wksp
            ? sourceList[indexSelectingField]?.map((source) => ({
                value: source?.resrc_id,
                label: source?.resrc_name,
                disabled: source.blog ? true : false
              }))
            : []
        }
        value={selectedSource}
        onChange={handleSourceField}
      />

      {!form.values.blog_img && (
        <FileInput
          clearable={!isEditing}
          description='Optional'
          leftSection={<FaFileImage />}
          label='Background Image'
          disabled={isEditing}
          accept='image/*'
          placeholder='Background Image...'
          {...form.getInputProps('blog_img')}
          onChange={(value) => {
            form.setFieldValue('blog_img', value);
          }}
        />
      )}

      {form.values.blog_img && (
        <Flex className='flex-col items-start lg:flex-row lg:items-center' gap='sm' mt={10}>
          <AspectRatio ratio={1080 / 720} maw={350}>
            <div className='relative'>
              <Image
                radius={'md'}
                fit='cover'
                src={
                  typeof form.getValues().blog_img === 'string'
                    ? form.getValues().blog_img
                    : URL.createObjectURL(form.values.blog_img! as File)
                }
                alt='Background Image Preview'
              />
              {!isEditing && (
                <ActionIcon
                  className='absolute -right-1 -top-1'
                  variant='filled'
                  color='red'
                  size='xs'
                  radius={'lg'}
                  onClick={handleClearImage}>
                  <FaTimes />
                </ActionIcon>
              )}
            </div>
          </AspectRatio>
          {!isEditing && (
            <Flex direction={'column'} className='mb-7'>
              <Text fw={500}>Name: &nbsp;{(form.values.blog_img as File)?.name}</Text>
              <Text fw={500}>
                Size: &nbsp;{`${((form.values.blog_img as File)?.size / 1024).toFixed(2)} KB`}
              </Text>
            </Flex>
          )}
        </Flex>
      )}

      <Input.Wrapper error={form.errors.blog_img}>
        <p></p>
      </Input.Wrapper>

      <Input.Wrapper withAsterisk label='Content' error={form.errors.blog_cont}>
        <TextEditor form={form} />
      </Input.Wrapper>

      <Group justify='space-between' mt='md'>
        {!isEditing ? (
          <Button variant='outline' type='reset' onClick={handleClearForm}>
            Clear
          </Button>
        ) : (
          <div />
        )}

        <Button type='submit'>Save</Button>
      </Group>
    </form>
  );
};

export default BlogForm;
