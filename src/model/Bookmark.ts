/** @format */

export class Bookmark {
  bookmarkName: string;
  flowName: string;
  index: number;
  flowIndex: number;

  constructor(bookmarkName: string, flowName: string, index: number, flowIndex: number) {
    this.bookmarkName = bookmarkName.trim();
    this.index = index;
    this.flowName = flowName;
    this.flowIndex = flowIndex;
  }

  getBookmarkName(): string {
    return this.bookmarkName;
  }

  getFlow(): string {
    return this.flowName;
  }

  getIndex(): number {
    return this.index;
  }
}
