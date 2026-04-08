interface LoadingProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function Loading({ text = "Reading the stars...", size = "md" }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeStyles[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
        <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
      {text && <p className="text-text-muted text-sm animate-pulse">{text}</p>}
    </div>
  );
}
