
export type ProductionStage = 
  | 'Printing' 
  | 'Cutting' 
  | 'Pasting' 
  | 'Foiling' 
  | 'Electroplating' 
  | 'Letterpress' 
  | 'Embossed' 
  | 'Diecut' 
  | 'Quality Check' 
  | 'Ready to Dispatch';

export type DesignStatus = 
  | 'Working on it' 
  | 'Pending Feedback from Sales Team' 
  | 'Forwarded to Prepress';

export type PrepressStatus = 
  | 'Waiting for approval' 
  | 'Forwarded to production' 
  | 'Working on it';
