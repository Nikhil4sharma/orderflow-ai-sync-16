
import React from "react";
import { useTheme } from "@/components/theme-provider";

interface OrderFlowLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const OrderFlowLogo: React.FC<OrderFlowLogoProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Define sizes for different variants
  const sizes = {
    sm: { fontSize: "18px" },
    md: { fontSize: "24px" },
    lg: { fontSize: "30px" },
  };
  
  // Colors based on theme
  const logoColor = isDarkTheme ? "#FFFFFF" : "#000000";
  
  return (
    <div 
      className={`logo-container flex items-center ${className} transition-all duration-300 hover:scale-105`}
    >
      <span 
        className="font-bold tracking-tight hover:text-primary transition-colors duration-300"
        style={{ 
          color: logoColor,
          fontFamily: "Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: sizes[size].fontSize,
          textShadow: isDarkTheme ? "0 0 20px rgba(255,255,255,0.1)" : "none",
        }}
      >
        OrderFlow
      </span>
    </div>
  );
};

export default OrderFlowLogo;
