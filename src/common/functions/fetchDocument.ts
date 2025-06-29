export async function fetchDocument(url: string | URL): Promise<Document> {
  const response = await fetch(url);
  const html = await response.text();

  return new DOMParser().parseFromString(html, 'text/html');
}
