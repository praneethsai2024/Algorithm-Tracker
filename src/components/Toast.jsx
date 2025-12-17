import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

// Internal Component
function ToastItem({ message, type, onClose }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Animation trigger
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={18} className="text-green-400" />;
            case 'error': return <AlertCircle size={18} className="text-red-400" />;
            default: return <Info size={18} className="text-sky-400" />;
        }
    };

    return (
        <div
            className={`pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-slate-100 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-in slide-in-from-right-full fade-in duration-300 ${isExiting ? 'animate-out fade-out slide-out-to-right-full duration-300' : ''}`}
        >
            {getIcon()}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-300">
                <X size={16} />
            </button>
        </div>
    );
}
