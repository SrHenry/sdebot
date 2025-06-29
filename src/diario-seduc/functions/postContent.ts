import { post__ISO8859_1 } from '@/common/functions/post__ISO8859_1';
import { Context } from '@/diario-seduc/types/Context';

export async function postContent({ url, payload }: Context) {
  return post__ISO8859_1(url, { Referer: url }, Object.entries(payload));
}
