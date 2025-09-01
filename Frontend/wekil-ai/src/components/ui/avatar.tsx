"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "./utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Avatar.displayName = "Avatar";

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  ({ src, alt = "Avatar", className, width = 80, height = 80 }, ref) => (
    <div ref={ref} className={cn("relative w-full h-full", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover rounded-full"
      />
    </div>
  )
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 text-lg font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
