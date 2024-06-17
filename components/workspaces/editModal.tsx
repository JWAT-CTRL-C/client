// import { Modal, rem, Tabs } from '@mantine/core';
// import { FaCog, FaUsers } from 'react-icons/fa';
// import EditGeneralWorkspaceForm from './editGeneralForm';
// import EditWorkspaceMemberForm from './editMemberForm';

// export type WorkspaceEditFormType = {
//   opened: boolean;
//   handleClose: () => void;
// };
// export default function EditWorkspaceModal({ opened, handleClose }: WorkspaceEditFormType) {
//   const iconStyle = { width: rem(12), height: rem(12) };
//   return (
//     <Modal opened={opened} onClose={handleClose} closeOnClickOutside={false} size='lg' centered>
//       <Tabs defaultValue='general' mih={560}>
//         <Tabs.List>
//           <Tabs.Tab value='general' leftSection={<FaCog style={iconStyle} />}>
//             General
//           </Tabs.Tab>
//           <Tabs.Tab value='collaborator' leftSection={<FaUsers style={iconStyle} />}>
//             Collaborator
//           </Tabs.Tab>
//         </Tabs.List>

//         <Tabs.Panel value='general'>
//           <EditGeneralWorkspaceForm />
//         </Tabs.Panel>
//         <Tabs.Panel value='collaborator'>
//           <EditWorkspaceMemberForm />
//         </Tabs.Panel>
//       </Tabs>
//     </Modal>
//   );
// }
