export async function fetchDocument(url: string | URL): Promise<Document>;

export async function fetchDocument(url: string | URL): Promise<Document> {
  const response = await fetch(url);
  const parser = new DOMParser();

  {
    const contentType = response.headers.get('Content-Type');
    const charsetMatch = contentType?.match(/charset=([^;]+)/i) ?? null;
    const encoding = charsetMatch?.[1] ?? null;

    if (encoding === null) {
      const html = await response.text();

      return parser.parseFromString(html, 'text/html');
    }

    const decoder = new TextDecoder(encoding);
    const buffer = await response.arrayBuffer();
    const html = decoder.decode(buffer);

    return parser.parseFromString(html, 'text/html');
  }
}
