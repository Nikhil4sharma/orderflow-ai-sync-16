
import { toast as sonnerToast } from "sonner";

// Re-export the toast functions from sonner for consistent usage across the app
export const toast = {
  success: (message: string, options = {}) => sonnerToast.success(message, options),
  error: (message: string, options = {}) => sonnerToast.error(message, options),
  info: (message: string, options = {}) => sonnerToast.info(message, options),
  warning: (message: string, options = {}) => sonnerToast.warning(message, options),
  promise: sonnerToast.promise,
  custom: sonnerToast,
  dismiss: sonnerToast.dismiss,
  loading: (message: string, options = {}) => sonnerToast.loading(message, options),
};

// Helper functions for common toast patterns
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showPaymentRequiredToast = () => {
  toast.warning("Full payment is required before proceeding", {
    description: "Please record payment to continue with this operation."
  });
};

export const showPaymentRecordedToast = (amount: number) => {
  toast.success(`Payment of ₹${amount.toLocaleString("en-IN")} recorded`, {
    description: "The payment has been successfully recorded."
  });
};

export const showOrderStatusToast = (status: string) => {
  toast.info(`Order status updated to: ${status}`, {
    description: "The order status has been successfully updated."
  });
};
