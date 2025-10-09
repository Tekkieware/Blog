import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeout: NodeJS.Timeout | null;

  type DebouncedFunction = T & { cancel: () => void };

  const debounced = function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(context, args), delay);
  } as T;

  (debounced as DebouncedFunction).cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced as DebouncedFunction;
}
