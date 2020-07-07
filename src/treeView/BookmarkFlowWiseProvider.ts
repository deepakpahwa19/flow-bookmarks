/** @format */

import * as vscode from 'vscode';
import { WorkspaceController } from '../controller/WorkspaceController';

export class BookmarkFlowWiseProvider implements vscode.TreeDataProvider<StoredBookmarks> {
  constructor(
    private workSpaceRoot: string | undefined,
    private workspaceController: WorkspaceController,
    private context: vscode.ExtensionContext,
    private colors: string[]
  ) {}

  private _onDidChangeTreeData: vscode.EventEmitter<StoredBookmarks> = new vscode.EventEmitter<StoredBookmarks>();
  readonly onDidChangeTreeData: vscode.Event<StoredBookmarks> = this._onDidChangeTreeData.event;

  refresh(offset: StoredBookmarks): void {
    this._onDidChangeTreeData.fire(offset);
  }

  getTreeItem(element: StoredBookmarks): vscode.TreeItem {
    return element;
  }

  getChildren(element: StoredBookmarks): Thenable<StoredBookmarks[]> {
    if (!this.workSpaceRoot) {
      vscode.window.showInformationMessage('No workspace root was provided...');
    }

    if (element) {
      if (element.getFileName()) {
        return Promise.resolve([]); // to stop triggering getChildren method
      } else {
        return Promise.resolve(this.getBookmarksForFlow(element.label));
      }
    } else {
      return Promise.resolve(this.getListOfFlow());
    }
  }

  private getListOfFlow(): StoredBookmarks[] {
    let listOfFlow: StoredBookmarks[] = [];
    const flows: any = this.workspaceController.getListOfFlowNames();

    listOfFlow = Object.keys(flows).map(flowName => {
      const color = this.colors[flows[flowName] % this.colors.length];
      return new StoredBookmarks(flowName, vscode.TreeItemCollapsibleState.Collapsed, this.context.asAbsolutePath(`images/bookmark-${color}.svg`));
    });
    return listOfFlow.sort((a: StoredBookmarks, b: StoredBookmarks) => {
      const flowNameA = a.getLabel(),
        flowNameB = b.getLabel();
      return flowNameA < flowNameB ? -1 : flowNameA > flowNameB ? 1 : 0;
    });
  }

  private getBookmarksForFlow(flowName: string): StoredBookmarks[] {
    const bookmarksForFlow: any = this.workspaceController.getBookmarksForFlow(flowName);
    const bookmarks: StoredBookmarks[] = [];
    Object.keys(bookmarksForFlow).forEach((filePath: string) => {
      Object.keys(bookmarksForFlow[filePath]).forEach(lineNumber => {
        const indexOfBookmark = Number(bookmarksForFlow[filePath][lineNumber].flowIndex) % this.colors.length,
          color = this.colors[indexOfBookmark],
          fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        bookmarks.push(
          new StoredBookmarks(
            bookmarksForFlow[filePath][lineNumber].index + '. ' + bookmarksForFlow[filePath][lineNumber].bookmarkName,
            vscode.TreeItemCollapsibleState.None,
            this.context.asAbsolutePath(`images/bookmark-${color}.svg`),
            fileName,
            lineNumber,
            bookmarksForFlow[filePath][lineNumber].index,
            flowName,
            {
              command: 'flowBookmark.jumpTo',
              title: '',
              arguments: [filePath, lineNumber, flowName],
            },
            'dependency'
          )
        );
      });
    });
    return bookmarks.sort((a: StoredBookmarks, b: StoredBookmarks) => a.getIndex() - b.getIndex());
  }
}

class StoredBookmarks extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public iconPath?: string,
    public fileName?: string | undefined,
    // public filePath?: string | undefined,
    public lineNumber?: string,
    public index?: number,
    public flowName?: string,
    public readonly command?: vscode.Command,
    public contextValue?: string
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return `${this.index}.${this.label}- ${this.fileName}`;
  }

  get description(): string | undefined {
    return this.fileName && this.lineNumber ? `${this.fileName} - ${Number(this.lineNumber) + 1}` : '';
  }

  getFileName(): string | undefined {
    return this.fileName;
  }

  getIndex(): number {
    return this.index || 0;
  }

  getLabel(): string {
    return this.label;
  }
}
