import { debug } from '@/common/functions/debug';
import { GlobalMacroValidator } from '@/common/validators/GlobalMacroValidator';
import { parseRawMemory } from '@/diario-seduc/functions/mappers/parseRawMemory';
import { run } from '@/diario-seduc/functions/run';
import { runWithQueue } from '@/diario-seduc/functions/runWithQueue';

GlobalMacroValidator.validate({
  defaultMemory,
  mode,
  INTERVAL,
  CONSUMER_SLEEP_INTERVAL,
  RATE_LIMIT,
  CONCURRENCY,
});

debug('[main::File] >> MACROS validated successfully!');
debug(
  `[main::File] >> Running in ${mode} mode with the following configuration:`,
  {
    INTERVAL,
    CONSUMER_SLEEP_INTERVAL,
    RATE_LIMIT,
    CONCURRENCY,
  },
);

const _memory = parseRawMemory(defaultMemory);

switch (mode) {
  case 'queued':
    runWithQueue(_memory);
    break;
  case 'normal':
    run(_memory);
    break;
}
