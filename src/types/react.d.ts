/**
 * Stub type declarations for React
 * These are temporary until React Native is initialized with proper dependencies
 */

declare module "react" {
  export interface Component<P = {}, S = {}> {}
  export function useState<T>(
    initialValue: T | (() => T)
  ): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export const Fragment: any;
  
  export type FC<P = {}> = (props: P) => JSX.Element | null;
}

