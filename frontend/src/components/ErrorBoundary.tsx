import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.href = '/';
  };

  handleClearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-3xl text-[#0c1e33] mb-2">
                Đã xảy ra lỗi
              </h1>
              <p className="font-['Poppins:Regular',sans-serif] text-[#495d72] mb-6">
                Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-['Poppins:Medium',sans-serif] text-red-800 mb-2">
                  Thông tin lỗi:
                </p>
                <code className="block text-sm text-red-700 font-mono overflow-x-auto">
                  {this.state.error.toString()}
                </code>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-['Poppins:Medium',sans-serif] text-red-800 mb-2">
                      Chi tiết kỹ thuật
                    </summary>
                    <pre className="text-xs text-red-700 font-mono overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-[#0c1e33] hover:bg-[#152d47] text-white font-['Poppins:Medium',sans-serif] py-3 px-6 rounded-lg transition-colors"
              >
                Tải lại trang
              </button>
              <button
                onClick={this.handleClearStorage}
                className="flex-1 bg-white hover:bg-gray-50 text-[#0c1e33] border border-[#0c1e33] font-['Poppins:Medium',sans-serif] py-3 px-6 rounded-lg transition-colors"
              >
                Xóa dữ liệu & Tải lại
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-[#495d72] font-['Poppins:Regular',sans-serif] text-center">
                Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với bộ phận kỹ thuật
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
