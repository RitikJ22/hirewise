import { toast } from "sonner";
import { CheckCircle, Tag, AlertTriangle, X, Info } from "lucide-react";

export const Toast = {
  success: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-green-500/20 rounded-xl shadow-2xl shadow-green-500/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-green-500/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex-1">
              <span className="text-green-200 font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-green-300/70 text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-green-300/60 hover:text-green-200 hover:bg-green-500/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  sell: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-orange-500/20 rounded-xl shadow-2xl shadow-orange-500/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-orange-500/20 rounded-full">
              <Tag className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <span className="text-orange-200 font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-orange-300/70 text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-orange-300/60 hover:text-orange-200 hover:bg-orange-500/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  error: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-red-500/20 rounded-xl shadow-2xl shadow-red-500/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <span className="text-red-200 font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-red-300/70 text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-red-300/60 hover:text-red-200 hover:bg-red-500/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },

  info: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-blue-500/20 rounded-full">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <span className="text-blue-200 font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-blue-300/70 text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-blue-300/60 hover:text-blue-200 hover:bg-blue-500/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      {
        duration: 4000,
      }
    );
  },
};

export default Toast;
