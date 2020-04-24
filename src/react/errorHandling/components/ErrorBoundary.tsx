import React, { ErrorInfo, ReactNode, Component } from 'react';

export type OnErrorOccurredHandler = (
    error: Error,
    errorInfo: ErrorInfo
) => void;

type Props = {
    children: React.ReactNode;
    renderFallback: (error: Error, errorInfo: ErrorInfo) => ReactNode;
    onErrorOccurred?: OnErrorOccurredHandler;
};

type State = {
    error: Error | null;
    errorInfo: ErrorInfo | null;
};

export default class ErrorBoundary extends Component<Props, State> {
    state = {
        error: null,
        errorInfo: null,
    };

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState(
            (currentState: State): State => ({
                ...currentState,
                error,
                errorInfo,
            })
        );

        const { onErrorOccurred } = this.props;

        if (onErrorOccurred) {
            onErrorOccurred(error, errorInfo);
        }
    }

    render() {
        const { error, errorInfo } = this.state;
        const { children, renderFallback } = this.props;

        if (error && errorInfo) {
            return renderFallback(error, errorInfo);
        }

        return children;
    }
}
