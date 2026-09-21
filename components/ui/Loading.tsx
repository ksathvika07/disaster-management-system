interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
    >
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#203449] border-t-[#4DA3FF]" />

      <span className="text-sm text-[#A8B5C4]">{text}</span>
    </div>
  );
}