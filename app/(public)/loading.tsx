"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-6">
        {/* Animated outer ring */}
        <div className="absolute w-24 h-24 border-[1.5px] border-border border-t-accent rounded-full animate-spin" />
        
        {/* Inner static logo */}
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-transparent">
          <Image
            src="/logo.png"
            alt="Loading..."
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-full animate-pulse object-center"
          />
        </div>
      </div>
      <p className="font-label text-xs uppercase tracking-[0.2em] text-accent animate-pulse">
        Please Wait...
      </p>
    </div>
  );
}
