/** @format */
import * as vscode from 'vscode';
import { Bookmark } from '../model/Bookmark';
import { WorkspaceController } from './WorkspaceController';
import { EditorController } from './EditorController';
import { Flow } from '../model/Flow';
import { UNCATEGORISED } from '../constants/constants';

export class BookmarkController {
  constructor(
    private context: vscode.ExtensionContext,
    private workspaceController: WorkspaceController,
    private editorController: EditorController
  ) {}

  addBookmark(activeEditor: any = vscode.window.activeTextEditor, bookmarkText: string) {
    const { filePath, lineNumber } = this.getFilePathAndLine(activeEditor);
    this.addOrEditBookmark(filePath, lineNumber, bookmarkText);
  }

  editBookmark(filePath: string, lineNumber: string, bookmarkText: string) {
    this.addOrEditBookmark(filePath, Number(lineNumber), bookmarkText);
  }

  private addOrEditBookmark(filePath: string, lineNumber: number, bookmarkText: string = UNCATEGORISED) {
    const [enteredBookmarkName, enteredFlowName, enteredIndex] = bookmarkText.split(',').map(text => text.trim()) || [],
      storedBookmarks: any = this.workspaceController.getBookmarks(),
      flowName: string = enteredFlowName || UNCATEGORISED;

    let listOfFlows: any = this.workspaceController.getFlows();
    listOfFlows = Array.isArray(listOfFlows) ? listOfFlows : [];

    // Removing existing flow on the lineNumber
    if ((storedBookmarks[filePath] || {})[lineNumber]) {
      const previousFlowIndex = storedBookmarks[filePath][lineNumber].flowIndex,
        bookmarkIndexList: any[] = listOfFlows[previousFlowIndex].bookmarksIndexes;

      bookmarkIndexList.length === 1 ? (listOfFlows[previousFlowIndex] = null) : bookmarkIndexList.pop();
    }

    const flowIndex = this.getIndexOfExistingOrNewFLow(listOfFlows, flowName), // To get the index of existing or new flowName
      flowObject = listOfFlows[flowIndex],
      flow = flowIndex < listOfFlows.length && flowObject ? new Flow(flowObject.name, flowObject.bookmarksIndexes) : new Flow(flowName),
      index = enteredIndex ? Number(enteredIndex) : flow.getbookmarksIndexes().length;

    flow.addNewBookmarkIndex(index);

    flowIndex < listOfFlows.length ? (listOfFlows[flowIndex] = flow) : listOfFlows.push(flow);

    // Creating and Saving Bookmark
    const newBookmark = new Bookmark(enteredBookmarkName, flow.getName(), index, flowIndex);
    storedBookmarks[filePath] = storedBookmarks[filePath] || {};
    storedBookmarks[filePath][lineNumber] = newBookmark;

    this.workspaceController.updateBookmarks(storedBookmarks);
    this.workspaceController.updateFlows(listOfFlows);

    this.decorateActiveEditor();
  }

  clearBookmark(activeEditor: any = vscode.window.activeTextEditor) {
    const { filePath, lineNumber } = this.getFilePathAndLine(activeEditor);
    this.clearOrDeleteBookmark(filePath, lineNumber);
  }

  deleteBookmark(filePath: string, lineNumber: string) {
    this.clearOrDeleteBookmark(filePath, Number(lineNumber));
  }

  private clearOrDeleteBookmark(filePath: string, lineNumber: number) {
    const storedBookmarks = this.workspaceController.getBookmarks();
    let flowName: string = '',
      flowIndex: number = -1;

    // Removing the Bookmark from the file
    if (storedBookmarks[filePath] && storedBookmarks[filePath][lineNumber]) {
      const filteredBookmark: any = {};
      Object.keys(storedBookmarks[filePath]).forEach((line: string): void => {
        if (line !== lineNumber.toString()) {
          filteredBookmark[line] = filteredBookmark[line] || {};
          filteredBookmark[line] = storedBookmarks[filePath][line];
        } else {
          flowName = storedBookmarks[filePath][line].flowName;
          flowIndex = Number(storedBookmarks[filePath][line].flowIndex);
        }
      });
      storedBookmarks[filePath] = filteredBookmark;
    } else {
      vscode.window.showInformationMessage('This line does not have any bookmark');
      return;
    }

    // Removing the flow
    const listOfFlows: any[] = this.workspaceController.getFlows(),
      flow: any = new Flow(listOfFlows[flowIndex].name, listOfFlows[flowIndex].bookmarksIndexes);

    // Poping one item to decrease the count of bookmarks for this flow
    flow.bookmarksIndexes.pop();
    listOfFlows[flowIndex] = flow.bookmarksIndexes.length > 0 ? flow : null;
    this.workspaceController.updateFlows(listOfFlows);
    this.workspaceController.updateBookmarks(storedBookmarks);
    this.decorateActiveEditor();
  }

  clearAllBookmarks() {
    this.workspaceController.clearAllFlows();
    this.workspaceController.clearAllBookmarks();
    this.decorateActiveEditor();
  }

  decorateActiveEditor(activeEditor: any = vscode.window.activeTextEditor) {
    const activeEditorBookmarks = this.workspaceController.getActiveEditorBookmarks(activeEditor);
    this.editorController.displayBookmarkForActiveEditor(activeEditor, activeEditorBookmarks);
  }

  private getFilePathAndLine(activeEditor: any = vscode.window.activeTextEditor): { filePath: string; lineNumber: number } {
    const fullFilePath: string = activeEditor.document.uri.fsPath,
      length = vscode.workspace.rootPath?.length || 0,
      filePath = fullFilePath.substring(length);
    return {
      filePath,
      lineNumber: activeEditor.selection.active.line,
    };
  }

  private getIndexOfExistingOrNewFLow(listOfFlows: any[], flowName: string): number {
    let flowIndex: number = -1;
    for (let index = 0; index < listOfFlows.length; index++) {
      const flow: any = listOfFlows[index];
      if (flow && flow.name.toLowerCase() === flowName.toLowerCase()) {
        flowIndex = index;
        break;
      } else if (!flow && flowIndex < 0) {
        // to get first Null Object in array
        flowIndex = index;
      }
    }
    return flowIndex >= 0 ? flowIndex : listOfFlows.length;
  }
}
