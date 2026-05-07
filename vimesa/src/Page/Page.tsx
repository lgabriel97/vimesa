import type { PropsWithChildren } from "react";

// page.tsx o tu layout raíz
export default function Page({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm md:max-w-lg lg:max-w-2xl">{children}</div>
    </div>
  );
}
