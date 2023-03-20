import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const name = 'appStore';

interface Serialize {
  options?: {
    map?: boolean;
  };
}

export const serialize = {
  options: {
    map: true,
  },
  //https://github.com/pmndrs/zustand/issues/899
  //https://github.com/pmndrs/zustand/issues/716
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// export const serialize = { options: true };

export const config = { name, serialize };
