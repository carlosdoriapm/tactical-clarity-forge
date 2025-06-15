
import React from "react";
interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}
const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => (
  <div className="fixed top-0 inset-x-0 z-50 bg-red-500/90 text-white px-6 py-4 flex items-center justify-between shadow-md animate-fade-in" role="alert">
    <span className="text-sm font-medium">{message}</span>
    {onDismiss &&
      <button
        className="ml-4 text-lg font-bold focus:outline-none"
        aria-label="Dismiss error"
        onClick={onDismiss}
      >×</button>
    }
  </div>
);
export default ErrorBanner;
