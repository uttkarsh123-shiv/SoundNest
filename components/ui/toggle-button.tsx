import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  activeColor?: "blue" | "orange" | "green";
  children: React.ReactNode;
}

export function ToggleButton({
  isActive,
  onClick,
  activeColor = "green",
  children
}: ToggleButtonProps) {
  const colorStyles = {
    green: {
      active: "bg-green-1 text-black shadow-lg hover:bg-green-2",
      inactive: "text-white-3 border-white-1/10 hover:bg-white-1/5 hover:text-white-1",
      dot: "bg-green-1"
    },
    orange: {
      active: "bg-gradient-to-r from-green-1 to-green-2 text-white shadow-lg hover:shadow-green-1/20",
      inactive: "text-green-1 border-green-1/20 hover:bg-green-1/10",
      dot: "bg-green-1"
    },
    blue: {
      active: "bg-green-1 text-black shadow-lg hover:bg-green-2",
      inactive: "text-white-3 border-white-1/10 hover:bg-white-1/5",
      dot: "bg-green-1"
    }
  };

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={cn(
        'w-full text-xs sm:text-base font-medium',
        'transition-all duration-300 hover:scale-[1.02]',
        'rounded-xl h-10 sm:h-12 px-2 sm:px-6',
        isActive ? colorStyles[activeColor].active : colorStyles[activeColor].inactive
      )}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div className={cn(
          "hidden sm:block size-1.5 sm:size-2 rounded-full", // Added hidden sm:block to hide on mobile
          isActive ? "bg-white" : colorStyles[activeColor].dot,
          "transition-all duration-300",
          isActive && "animate-pulse"
        )} />
        {children}
      </div>
    </Button>
  );
}