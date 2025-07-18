import { toast } from "sonner";
import { CheckCircle, Tag, AlertTriangle, X, Info } from "lucide-react";

export const Toast = {
  success: (message: string, description?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#00b737]/20 rounded-xl shadow-2xl shadow-[#00b737]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00b737]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#00b737]/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-[#00b737]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#00b737] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#00b737]/60 hover:text-white hover:bg-[#00b737]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
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
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#454545]/20 rounded-xl shadow-2xl shadow-[#454545]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#454545]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#454545]/20 rounded-full">
              <Tag className="w-4 h-4 text-[#454545]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#454545] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#454545]/60 hover:text-white hover:bg-[#454545]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
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
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#EF4444]/20 rounded-xl shadow-2xl shadow-[#EF4444]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#EF4444]/20 rounded-full">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#EF4444] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#EF4444]/60 hover:text-white hover:bg-[#EF4444]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
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
        <div className="flex items-center justify-between w-full max-w-md p-4 bg-gradient-to-r from-[#1E1E21]/95 to-[#000000]/95 backdrop-blur-xl border border-[#454545]/20 rounded-xl shadow-2xl shadow-[#454545]/10 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#454545]/5 to-transparent rounded-xl" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="p-1.5 bg-[#454545]/20 rounded-full">
              <Info className="w-4 h-4 text-[#454545]" />
            </div>
            <div className="flex-1">
              <span className="text-white font-medium text-sm tracking-wide block">
                {message}
              </span>
              {description && (
                <span className="text-[#454545] text-xs mt-1 block">
                  {description}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(t)}
            className="text-[#454545]/60 hover:text-white hover:bg-[#454545]/10 p-1.5 rounded-full transition-all duration-200 relative z-10 flex-shrink-0"
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
