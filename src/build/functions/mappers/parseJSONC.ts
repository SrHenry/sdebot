import { parse } from 'comment-json';

export const parseJSONC = (file: string) => parse(file, null, true);
