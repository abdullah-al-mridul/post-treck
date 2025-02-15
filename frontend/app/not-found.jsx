import NotFoundButtons from "@/components/ui/NotFoundButtons";

export const metadata = {
  title: "404: Not Found | Post Treck",
  description: "The page you're looking for doesn't exist.",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Glitch Effect */}
        <div className="relative">
          <h1 className="text-[150px] font-black leading-none select-none">
            <span className="absolute inset-0 text-black dark:text-zinc-100 animate-glitch-1 mix-blend-screen">
              404
            </span>
            <span className="absolute inset-0 text-black dark:text-darkBorder animate-glitch-2 mix-blend-multiply dark:mix-blend-screen">
              404
            </span>
            <span className="absolute inset-0 text-darkBorder dark:text-black animate-glitch-3 mix-blend-multiply dark:mix-blend-screen">
              404
            </span>
            <span className="relative text-black dark:text-zinc-100 shadow-glitch">
              404
            </span>
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold dark:text-zinc-100">
            Page Not Found
          </h2>
          <p className="text-black/50 dark:text-zinc-100/70">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <NotFoundButtons />
      </div>
    </div>
  );
};

export default NotFound;
