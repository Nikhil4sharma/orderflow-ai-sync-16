
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

// Prepress department specific statuses
export type PrepressStatus = 
  | 'Waiting for approval' 
  | 'Working on it' 
  | 'Forwarded to production';
