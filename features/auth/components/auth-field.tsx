import { cn } from "@/utils/cn";
import { fadeIn } from "@/utils/motion";
import { motion } from "motion/react";
import { ReactNode } from "react";

type AuthFieldProps = {
  name: string;
  type: string;
  value: string;
  placeholder: string;
  handleChange: (name: string, value: string) => void;
  icon: React.FC<{ size?: number }>;
  required?: boolean;
  rightIcon?: ReactNode;
};

const AuthField = ({
  name,
  type,
  value,
  placeholder,
  handleChange,
  icon: Icon,
  required = false,
  rightIcon,
}: AuthFieldProps) => {
  return (
    <motion.div
      variants={fadeIn({
        direction: "up",
        type: "spring",
        delay: 0,
        duration: 0.3,
      })}
      initial="hidden"
      animate="show"
      className="relative"
    >
      <label className="sr-only">{name}</label>
      <div className="relative">
        <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2">
          <div className="text-fg/60 flex h-5 w-5 items-center justify-center">
            <Icon size={20} />
          </div>
        </div>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            "bg-secondary/40 border-border w-full rounded-md border",
            "text-fg placeholder:text-fg/40 py-3 pr-12 pl-12",
            "focus:ring-primary/50 focus:border-primary focus:ring-2 focus:outline-none",
            "transition-all duration-200",
          )}
          value={value}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required={required}
        />
        {rightIcon && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuthField;
