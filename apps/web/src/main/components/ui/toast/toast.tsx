import { T_ToastContainer, ToastContainer } from "./components/toast-container";
import { Icons } from "@/main/utils/icons";
import { toast as sonnerToast } from "sonner";

const showPreviewToast = () => {
  return sonnerToast.custom((id) => (
    <ToastContainer
      id={id}
      title="Coming soon"
      description="This feature will be coming soon!"
      buttonVisible={false}
      icon={<Icons.Clock className="size-4.5" />}
      color="text-subtext"
    />
  ));
};

export type T_SuccessToast = Omit<T_ToastContainer, "id">;
const showSuccessToast = (toast: T_SuccessToast) => {
  return sonnerToast.custom((id) => (
    <ToastContainer
      id={id}
      title={toast.title}
      description={toast.description}
      url={toast.url}
      urlType={toast.urlType}
      buttonVisible={true}
      icon={<Icons.CheckCircle className="size-4.5" />}
    />
  ));
};

export type T_LoadingToast = Omit<T_ToastContainer, "id">;
const showLoadingToast = (toast: T_LoadingToast) => {
  return sonnerToast.custom((id) => (
    <ToastContainer
      id={id}
      title={toast.title}
      description={toast.description}
      buttonVisible={false}
      icon={<Icons.Loading className="size-4.5 animate-spin" />}
      color="text-yellow-500"
    />
  ));
};

export type T_ErrorToast = Omit<T_ToastContainer, "id" | "title">;
const showErrorToast = (toast: T_ErrorToast) => {
  return sonnerToast.custom((id) => (
    <ToastContainer
      id={id}
      title="Something went wrong"
      description={toast.description}
      buttonVisible={false}
      icon={<Icons.Error className="size-4.5" />}
      color="text-red"
    />
  ));
};

export type T_PromiseToast<T> = {
  promise: Promise<T>;
  loading: T_LoadingToast;
  success: (data: T) => T_SuccessToast;
  error?: (error: unknown) => T_ErrorToast;
};
async function showPromiseToast<T>({ promise, loading, success, error }: T_PromiseToast<T>) {
  // Show the loading toast first
  const toastId = sonnerToast.custom(
    (id) => (
      <ToastContainer
        id={id}
        title={loading.title}
        description={loading.description}
        buttonVisible={loading.url && loading.urlType ? true : false}
        icon={<Icons.Loading className="size-4.5 animate-spin" />}
        color="text-yellow-500"
        url={loading.url}
        urlType={loading.urlType}
      />
    ),
    { duration: Infinity } // 👈 This prevents auto-dismiss
  );

  try {
    const result = await promise;

    // Replace with success toast
    sonnerToast.custom(
      (id) => (
        <ToastContainer
          id={id}
          title={success(result).title}
          description={success(result).description}
          url={success(result).url}
          urlType={success(result).urlType}
          buttonVisible={true}
          icon={<Icons.CheckCircle className="size-4.5" />}
        />
      ),
      { id: toastId, duration: 4000 } // 👈 Auto-dismiss after success if you want
    );

    return result;
  } catch (err) {
    // Replace with error toast
    sonnerToast.custom(
      (id) => (
        <ToastContainer
          id={id}
          title="Something went wrong"
          description={error ? error(err).description : "An unexpected error occurred."}
          buttonVisible={false}
          icon={<Icons.Error className="size-4.5" />}
          color="text-red"
        />
      ),
      { id: toastId, duration: 5000 } // 👈 or Infinity if you want to keep it until manual close
    );

    throw err;
  }
}

export const TOAST = {
  showPreviewToast,
  showSuccessToast,
  showLoadingToast,
  showErrorToast,
  showPromiseToast,
};
