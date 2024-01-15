import { run } from './diario-seduc/functions/run';
import { runWithQueue } from './diario-seduc/functions/runWithQueue';

switch (mode) {
  case 'queued':
    runWithQueue(defaultMemory);
    break;
  case 'normal':
    run(defaultMemory);
    break;
}
