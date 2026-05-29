import * as Icons from "lucide-react";
import React from "react";

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function LucideIcon({ name, className, size = 20 }: LucideIconProps) {
  // Dynamic lookup in the Lucide icon library
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Return a default fallback icon if it doesn't exist
    const Fallback = Icons.Wrench;
    return React.createElement(Fallback, { className, size });
  }
  
  return React.createElement(IconComponent, { className, size });
}
