// p42:ignore-file

import type { __MACROS__ } from '@/common/types/global.MACROS';

declare const __MACROS__: __MACROS__;

declare global {
  ///? MACROS:

  declare const {
    defaultMemory,
    mode,
    INTERVAL,
    CONSUMER_SLEEP_INTERVAL,
    RATE_LIMIT,
    CONCURRENCY,
  } = __MACROS__;

  ///? END;
}

export {};
