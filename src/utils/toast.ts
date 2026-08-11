import Toast, { ToastShowParams } from "react-native-toast-message";

type ToastOptions = Omit<ToastShowParams, "type" | "text1" | "text2">;

export const showSuccess = (
  text1: string,
  text2?: string,
  options?: ToastOptions
) => {
  Toast.show({
    type: "success",
    text1,
    text2,
    ...options,
  });
};

export const showError = (
  text1: string,
  text2?: string,
  options?: ToastOptions
) => {
  Toast.show({
    type: "error",
    text1,
    text2,
    ...options,
  });
};

export const showWarning = (
  text1: string,
  text2?: string,
  options?: ToastOptions
) => {
  Toast.show({
    type: "info",
    text1,
    text2,
    ...options,
  });
};

export const showToast = (params: ToastShowParams) => {
  Toast.show(params);
};

export const hideToast = () => {
  Toast.hide();
};
