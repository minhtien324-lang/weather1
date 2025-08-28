import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Cập nhật state để render fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log lỗi
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    margin: '20px'
                }}>
                    <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>
                        Đã xảy ra lỗi
                    </h2>
                    <p style={{ color: '#7f1d1d', marginBottom: '15px' }}>
                        Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử tải lại trang.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Tải lại trang
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '20px', textAlign: 'left' }}>
                            <summary>Chi tiết lỗi (chỉ hiển thị trong development)</summary>
                            <pre style={{ 
                                backgroundColor: '#f3f4f6', 
                                padding: '10px', 
                                borderRadius: '5px',
                                overflow: 'auto',
                                fontSize: '12px'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
