import React, { Component, ErrorInfo } from "react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught in Error Boundary:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl transform transition-transform animate-fadeIn">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-red-600">
                                ¡Ups! Ocurrió un error inesperado
                            </h2>
                            <p className="mt-2 text-gray-700">{this.state.error?.message}</p>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                                >
                                    Intentar nuevamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;