import { Bounce, toast } from 'react-toastify';

export const showSuccessToast = (mes: string) =>
  toast.success(mes, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
    className: 'top-12'
  });

export const showErrorToast = (mes: string) =>
  toast.error(mes, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
    className: 'top-12'
  });

export const showNotifyToast = (mes: React.ReactNode) =>
  toast(mes, {
    position: 'top-right',
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
    className: 'top-12 !p-0 !m-0 !bg-transparent !w-96 right-16'
  });
