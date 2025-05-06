
import React from "react";
import { useTheme } from "@/components/theme-provider";

interface ChhapaiLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ChhapaiLogo: React.FC<ChhapaiLogoProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  
  // Define sizes
  const sizes = {
    sm: { width: 120, height: 30 },
    md: { width: 160, height: 40 },
    lg: { width: 200, height: 50 },
  };
  
  // Colors based on theme
  const logoColor = isDarkTheme ? "#FFFFFF" : "#000000";
  
  return (
    <div className={`flex items-center ${className}`} style={sizes[size]}>
      <svg 
        width={sizes[size].height} 
        height={sizes[size].height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <circle cx="50" cy="50" r="45" stroke={logoColor} strokeWidth="6" fill="transparent" />
        <path 
          d="M70 25 L30 75" 
          stroke={logoColor} 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
      </svg>
      
      <span 
        style={{ 
          color: logoColor,
          fontFamily: "Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontWeight: 700,
          fontSize: size === "sm" ? "18px" : size === "md" ? "24px" : "30px",
        }}
      >
        chhapai
      </span>
    </div>
  );
};

export default ChhapaiLogo;
