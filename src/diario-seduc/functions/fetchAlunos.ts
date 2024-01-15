import { fetchDocument } from '@/common/functions/fetchDocument';

export async function fetchAlunos(url: string): Promise<string[]> {
  const root = await fetchDocument(url);

  const inputs = [
    ...root.querySelectorAll(
      'html > body > .container > div tbody > tr > td:nth-child(4) input',
    ),
  ] as HTMLInputElement[];

  return [
    ...new Set(
      inputs.map(({ name }) => name.replace(/^freq\[(\d+)\]\[(\d+)\]$/, '$2')),
    ),
  ];
}
