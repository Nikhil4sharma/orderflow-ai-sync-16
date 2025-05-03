
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MobileBackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const MobileBackButton: React.FC<MobileBackButtonProps> = ({ 
  to = "/", 
  label = "Back", 
  className = "" 
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button
      variant="ghost"
      className={`md:hidden ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4 mr-2" /> {label}
    </Button>
  );
};

export default MobileBackButton;
