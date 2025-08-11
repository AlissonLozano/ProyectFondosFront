/* eslint @typescript-eslint/no-explicit-any: "off" */
import {
  toast,
  type ToastContent,
  type ToastContentProps,
  type ToastOptions,
  type UpdateOptions,
} from "react-toastify";

const toastContentNotify = (msg: string, otherOptions = {}) => {
  toast.info(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...otherOptions,
  });
};

const toastContentError = (
  msg: ToastContent,
  autoClose: number | false = 5000,
  otherOptions = {}
) => {
  toast.warning(msg, {
    position: "top-center",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...otherOptions,
    autoClose: autoClose,
  });
};

export interface UpdateOptionsError extends ToastOptions {
  render?: (props: ToastContentProps<any>) => React.ReactNode;
}

export interface UpdateOptionsSuccess {
  render?: (props: ToastContentProps<any>) => React.ReactNode;
}

const toastContentPending = (
  promise: Promise<unknown>,
  onPending: UpdateOptions = { render: () => "Pending ..." },
  onSuccess: UpdateOptionsSuccess = {
    render: ({ data }) => `Success ${JSON.stringify(data)}`,
  },
  onError: UpdateOptionsError = {
    render: ({ data }) => `Error ${JSON.stringify(data)}`,
  },
  options?: ToastOptions
) => {
  toast.promise(
    promise,
    {
      pending: {
        type: "info",
        ...onPending,
      },
      error: {
        type: "warning",
        closeOnClick: false,
        ...onError,
      },
      success: {
        type: "info",
        ...onSuccess,
      },
    },
    options
  );
};

export { toastContentNotify, toastContentError, toastContentPending };
