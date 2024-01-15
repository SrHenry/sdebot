export class Queue<T> {
  constructor(private items: T[] = []) {}

  enqueue(...elements: T[]) {
    this.items.push(...elements);
  }

  dequeue() {
    if (this.isEmpty()) return;

    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return;

    return this.items[0];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  get size() {
    return this.items.length;
  }
}
