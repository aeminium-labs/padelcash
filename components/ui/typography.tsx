import { cva } from "class-variance-authority";

export const typographyVariants = cva([], {
    variants: {
        variant: {
            paragraph: "leading-7 [&:not(:first-child)]:mt-6",
            small: "text-sm leading-none",
            subtle: "text-sm text-slate-500 dark:text-slate-400",
            h3: "text-2xl tracking-tight",
        },
        style: {
            normal: "font-normal",
            bold: "font-bold",
            italic: "italic",
        },
    },
    defaultVariants: {
        variant: "paragraph",
        style: "normal",
    },
});
