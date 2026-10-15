import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true only after hydration has completed on the client.
 * Returns false during SSR and during the initial hydration render pass.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
