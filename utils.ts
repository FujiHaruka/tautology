export class Stack<T> {
  private items: T[] = [];

  get top(): T | undefined {
    return this.items[this.items.length - 1];
  }

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  popAll(): T[] {
    const { items } = this;
    this.items = [];
    return items.reverse();
  }
}
