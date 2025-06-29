import { KeyValuePair } from '@/common/types/KeyValuePair';

export type Context = {
  url: string;
  q: KeyValuePair[];
  payload: Record<
    | 'data_chamada'
    | `conteudo[${number}]`
    | `freq[${number}][${number}]`
    | `tipoAula[${number}][${number}]`,
    string
  >;
};
