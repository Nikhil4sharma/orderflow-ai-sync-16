
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useOrders } from "@/contexts/OrderContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { User, Settings, FileText } from "lucide-react";

interface SliderOption {
  id: number;
  label: string;
  value: number;
  description: string;
  roles: string[];
}

const defaultOptions: SliderOption[] = [
  {
    id: 1,
    label: "Order Priority",
    value: 50,
    description: "Set priority level for orders",
    roles: ["Admin", "Sales", "Design", "Prepress", "Production"]
  },
  {
    id: 2,
    label: "Production Speed",
    value: 70,
    description: "Adjust production speed settings",
    roles: ["Admin", "Production"]
  },
  {
    id: 3,
    label: "Quality Level",
    value: 90,
    description: "Set quality thresholds for production",
    roles: ["Admin", "Design", "Prepress", "Production"]
  },
  {
    id: 4,
    label: "Client Communication",
    value: 60,
    description: "Adjust frequency of client updates",
    roles: ["Admin", "Sales"]
  },
  {
    id: 5,
    label: "Resource Allocation",
    value: 40,
    description: "Control resource distribution",
    roles: ["Admin"]
  }
];

const RoleBasedSliderMenu: React.FC = () => {
  const { currentUser } = useOrders();
  const [activeOption, setActiveOption] = useState<SliderOption | null>(null);
  const [sliderValue, setSliderValue] = useState<number[]>([50]);
  
  // Filter options based on user role
  const filteredOptions = defaultOptions.filter(option => 
    currentUser && option.roles.includes(currentUser.role)
  );
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
  };
  
  const handleOptionSelect = (option: SliderOption) => {
    setActiveOption(option);
    setSliderValue([option.value]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Settings Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Menubar className="border-none p-0">
            <MenubarMenu>
              <MenubarTrigger className="font-medium data-[state=open]:bg-accent flex justify-between w-full">
                {activeOption ? activeOption.label : "Select an option"}
                <Settings className="h-4 w-4 ml-2" />
              </MenubarTrigger>
              <MenubarContent>
                {filteredOptions.map((option) => (
                  <React.Fragment key={option.id}>
                    <MenubarItem onClick={() => handleOptionSelect(option)}>
                      {option.label}
                    </MenubarItem>
                    {option.id !== filteredOptions[filteredOptions.length - 1].id && (
                      <MenubarSeparator />
                    )}
                  </React.Fragment>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
          {activeOption && (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                {activeOption.description}
              </p>
              <div className="py-2">
                <Slider
                  value={sliderValue}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleSliderChange}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Low</span>
                <span className="font-medium">{sliderValue[0]}%</span>
                <span>High</span>
              </div>
            </div>
          )}
          
          {!activeOption && (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Select an option to adjust settings</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleBasedSliderMenu;
