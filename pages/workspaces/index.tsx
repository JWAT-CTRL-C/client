import DefaultLayout from '@/components/layouts/DefaultLayout';
// import WorkspaceCard from "@/components/workspaces/workspaceCard";
// import WorkspaceList from "@/components/workspaces/worspaceList";

export default function Workspace() {
  return (
    <div className='flex flex-wrap gap-4 p-2'>
      <h2 className='ml-5 text-2xl font-semibold uppercase'>Workspaces</h2>
      {/* <WorkspaceList/> */}
    </div>
  );
}
Workspace.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
