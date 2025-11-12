import React from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";

const baseOptions = {
  duration: 3000,
  position: "bottom-right",
  style: {
    background: "transparent",
    border: "none",
    padding: 0,
    boxShadow: "none",
    margin: 0,
  },
};

const buildToast = (variant, title, description) => {
  const isSuccess = variant === "success";
  const bgClass = isSuccess ? "bg-green-500" : "bg-red-500";
  const accentClass = isSuccess ? "bg-green-600/20" : "bg-red-600/20";
  const textClass = isSuccess ? "text-green-100" : "text-red-100";
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div className={`w-[360px] flex items-center ${bgClass} text-white px-4 py-3 rounded-lg shadow-lg`}>
      <div className={`p-2 ${accentClass} rounded-full mr-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {description ? <p className={`text-sm ${textClass}`}>{description}</p> : null}
      </div>
    </div>
  );
};

export const showSuccessToast = (title = "Success", description = "") => {
  toast(buildToast("success", title, description), baseOptions);
};

export const showErrorToast = (title = "Something went wrong", description = "") => {
  toast(buildToast("error", title, description), baseOptions);
};
