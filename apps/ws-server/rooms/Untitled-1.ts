// MemoryStore.ts

type Item = {
  id: string;
  [key: string]: any;
};

export class MemoryStore {
  private data: Record<string, Item> = {};

  constructor(private storeName: string) {}

  // Add an item
  add(item: Omit<Item, 'id'>) {
    const id = crypto.randomUUID(); // generates unique id
    this.data[id] = { id, ...item };
    return this.data[id];
  }

  // Get one item by id
  get(id: string) {
    return this.data[id] || null;
  }

  // Get all items
  getAll() {
    return Object.values(this.data);
  }

  // Update an item
  update(id: string, updateData: Partial<Item>) {
    if (!this.data[id]) return null;
    this.data[id] = { ...this.data[id], ...updateData };
    return this.data[id];
  }

  // Delete an item
  delete(id: string) {
    if (!this.data[id]) return false;
    delete this.data[id];
    return true;
  }

  // Clear all items
  clear() {
    this.data = {};
  }
}
