import React from "react";
import { MessageCircle, MessageSquare } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center w-full bg-gradient-to-br from-primary/10 to-base-200 p-12 relative">
      {/* Blob Shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Floating Chat Bubbles */}
      <div className="relative max-w-md text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
            <MessageSquare className="size-6 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-primary">{title}</h2>
        <p className="text-base-content/70">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
