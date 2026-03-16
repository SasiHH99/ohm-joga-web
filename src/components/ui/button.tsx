import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const styles = {
  primary:
    "bg-moss text-ivory shadow-[0_20px_60px_rgba(85,107,93,0.22)] hover:bg-moss/90",
  secondary:
    "bg-ivory text-ink ring-1 ring-sand/70 hover:bg-sand/20",
  ghost: "bg-transparent text-ink ring-1 ring-stone/25 hover:bg-ivory/60",
};

type Variant = keyof typeof styles;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
