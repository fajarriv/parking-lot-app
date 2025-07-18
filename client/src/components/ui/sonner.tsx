import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#374151",
          "--normal-text": "#f9fafb",
          "--normal-border": "#4b5563",
          "--success-bg": "#065f46",
          "--success-text": "#d1fae5",
          "--success-border": "#10b981",
          "--error-bg": "#7f1d1d",
          "--error-text": "#fecaca",
          "--error-border": "#ef4444",
          "--warning-bg": "#78350f",
          "--warning-text": "#fef3c7",
          "--warning-border": "#f59e0b",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
