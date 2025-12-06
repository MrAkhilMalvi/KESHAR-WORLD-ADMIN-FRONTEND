import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

export class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Error Boundary Caught:", error, info);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onReset={this.resetError} />
      );
    }
    return this.props.children || <Outlet />;
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    onReset();
    navigate("/");
  };

  const handleClearAll = () => {
    // Clear local storage
    localStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
    });

    onReset();
    window.location.href = "/";
  };

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  
  const isAuthenticated = auth?.isAuthenticated === true;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 text-center p-6">
      <h1 className="text-3xl font-bold mb-2">⚠️ An error occurred</h1>
      <p className="text-gray-600 mb-6">
        {error?.message || "Something went wrong."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {isAuthenticated && (
          <button
            onClick={handleGoHome}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary_hover transition"
          >
            Go To Homepage
          </button>
        )}
        <button
          onClick={onReset}
          className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition"
        >
          Try Again
        </button>
        <button
          onClick={handleClearAll}
          className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition"
        >
          Try Fresh Login
        </button>
      </div>
    </div>
  );
}
