export default function NotificationList({ notifications = [] }: { notifications: any[] }) {
  return (
    <div className='min-h-[30vh] p-3'>
      <div className='grid h-full w-full place-items-center rounded-md border border-gray-100 bg-slate-50'>
        No notification found
      </div>
    </div>
  );
}
