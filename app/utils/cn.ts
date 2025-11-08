import classNames from 'classnames';

/**
 * Utility function to merge CSS classes
 * Wrapper around classnames library for conditional class application
 */
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return classNames(...inputs);
}

