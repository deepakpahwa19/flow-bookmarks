/** @format */

export class Flow {
  private bookmarksIndexes: number[];
  private name: string;
  constructor(name: string, bookmarksIndexes: number[] = []) {
    this.name = name;
    this.bookmarksIndexes = bookmarksIndexes;
  }

  getbookmarksIndexes(): number[] {
    return this.bookmarksIndexes;
  }

  getName(): string {
    return this.name;
  }

  addNewBookmarkIndex(index: number): void {
    this.bookmarksIndexes.push(index);
  }
}
