import React, { Component } from "react";

import lazyCaptureException from "lib/lazyCaptureException";

type Props = {
  children: React.ReactNode;
  ErrorComponent?: React.ElementType;
  componentName?: string;
  canDismiss?: boolean;
};
type State = { hasError: boolean };

const initialState: State = { hasError: false };

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    const { componentName } = this.props;
    lazyCaptureException(error, { errorInfo, componentName });
    if (super.componentDidCatch) {
      super.componentDidCatch(error, errorInfo);
    }
  }

  dismissError = () => {
    this.setState(initialState);
  };

  render() {
    const { hasError } = this.state;
    const { children, ErrorComponent = () => null, canDismiss = false } = this.props;
    if (hasError) {
      return (
        <ErrorComponent
          shouldCaptureException={false}
          dismissError={canDismiss ? this.dismissError : undefined}
        />
      );
    }
    return children;
  }
}

export default ErrorBoundary;
