import { post__ISO8859_1 } from '@/common/functions/post__ISO8859_1';
import type { Context } from '../types/Context';

export async function postContent({ url, payload }: Context) {
  return post__ISO8859_1(url, Object.entries(payload));
}
