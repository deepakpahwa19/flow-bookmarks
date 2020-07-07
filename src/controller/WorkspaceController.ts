/** @format */

import * as vscode from 'vscode';
import { BOOKMARKS, FLOWS } from '../constants/constants';
export class WorkspaceController {
  context: vscode.ExtensionContext;
  savedBookmarks: any;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.savedBookmarks = {};
  }

  getBookmarks(): any {
    return this.context.workspaceState.get(BOOKMARKS) || {};
  }

  updateBookmarks(storedBookmarks: any): void {
    this.context.workspaceState.update(BOOKMARKS, storedBookmarks);
  }

  clearAllBookmarks(): void {
    this.context.workspaceState.update(BOOKMARKS, {});
  }

  getFlows(): any {
    return this.context.workspaceState.get(FLOWS) || [];
  }

  updateFlows(storedFlows: any[]): void {
    this.context.workspaceState.update(FLOWS, storedFlows);
  }

  clearAllFlows(): void {
    this.context.workspaceState.update(FLOWS, []);
  }

  getActiveEditorBookmarks(activeEditor: any = vscode.window.activeTextEditor): any {
    const fullFilePath: string = activeEditor.document.uri.fsPath,
      length = vscode.workspace.rootPath?.length || 0,
      filePath = fullFilePath.substring(length) || '',
      storedBookmarks = this.getBookmarks();
    return storedBookmarks[filePath];
  }

  getListOfFlowNames(): any {
    this.savedBookmarks = {};
    const flows: any = {};
    const storedBookmarks = this.getBookmarks();
    Object.keys(storedBookmarks).forEach((filePath: string) => {
      Object.keys(storedBookmarks[filePath]).forEach((lineNumber: string) => {
        const bookmark = storedBookmarks[filePath][lineNumber];
        if (!flows[bookmark.flowName]) {
          flows[bookmark.flowName] = bookmark.flowIndex;
        }
        this.savedBookmarks[bookmark.flowName] = this.savedBookmarks[bookmark.flowName] || {};
        this.savedBookmarks[bookmark.flowName][filePath] = this.savedBookmarks[bookmark.flowName][filePath] || {};
        this.savedBookmarks[bookmark.flowName][filePath][lineNumber] = this.savedBookmarks[bookmark.flowName][filePath][lineNumber] || {};
        this.savedBookmarks[bookmark.flowName][filePath][lineNumber].bookmarkName = bookmark.bookmarkName;
        this.savedBookmarks[bookmark.flowName][filePath][lineNumber].index = bookmark.index;
        this.savedBookmarks[bookmark.flowName][filePath][lineNumber].flowIndex = bookmark.flowIndex;
      });
    });

    /*
    this.savedBookmarks:{
      flowName: {
        fileName: {
          lineNumber: {
            bookmarkName: 'activate',
            index: 12
          }
        }
      }
    }
    */

    return flows;
  }

  getBookmarksForFlow(flowName: string): {} {
    return this.savedBookmarks[flowName];
  }
}
