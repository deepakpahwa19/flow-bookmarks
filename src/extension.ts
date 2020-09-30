/** @format */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BookmarkController } from './controller/BookmarkController';
import { WorkspaceController } from './controller/WorkspaceController';
import { BookmarkFlowWiseProvider } from './treeView/BookmarkFlowWiseProvider';
import { EditorController } from './controller/EditorController';
import { COLORS } from './constants/constants';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let colors: string[] = COLORS;
  let editorController: EditorController,
    workspaceController: WorkspaceController,
    bookmarkController: any = undefined,
    bookmarkFlowWiseProvider: BookmarkFlowWiseProvider;

  function init() {
    const listOfColors: any = vscode.workspace.getConfiguration('flowbookmark');
    colors = listOfColors.get('listOfColors').length > 0 && listOfColors.get('listOfColors').length < 11 ? listOfColors.get('listOfColors') : COLORS;
    editorController = new EditorController(context, colors);
    workspaceController = new WorkspaceController(context);
    bookmarkController = new BookmarkController(context, workspaceController, editorController);
    bookmarkFlowWiseProvider = new BookmarkFlowWiseProvider(vscode.workspace.rootPath, workspaceController, context, colors);
    vscode.window.registerTreeDataProvider('flowBookmarksView', bookmarkFlowWiseProvider);
  }

  init();

  if (bookmarkController) {
    bookmarkController.decorateActiveEditor();
  }

  vscode.commands.registerCommand('flowBookmarksView.refreshEntry', node => {
    bookmarkFlowWiseProvider.refresh(node);
  });

  //Events
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor && editor.document === vscode.window.activeTextEditor?.document) {
      bookmarkController.decorateActiveEditor(editor);
    }
  });

  // Commands
  // Add a new bookmark from command prompt
  let addNew = vscode.commands.registerCommand('flowbookmark.addNew', () => {
    const activeEditor: any = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return vscode.window.showInformationMessage('Please select a file first...');
    }
    const inputBoxOptions = <vscode.InputBoxOptions>{
      prompt: 'Add Bookmark name, Flow name, index',
      placeHolder: 'Bookmark name, Flow name, index',
    };
    vscode.window.showInputBox(inputBoxOptions).then(enteredText => {
      if (!enteredText) {
        vscode.window.showInformationMessage('Please enter Bookmark Name,Flow Name and/or index');
        return;
      }
      bookmarkController.addBookmark(activeEditor, enteredText);
      vscode.commands.executeCommand('flowBookmarksView.refreshEntry');
    });
  });

  // Edit Bookmark from Sidebar
  const editBookmark = vscode.commands.registerCommand('flowBookmarksView.editEntry', node => {
    const [index, bookmarkName] = node.label.split('. '),
      filePath = node.command.arguments[0],
      lineNumber = node.command.arguments[1],
      flowName = node.command.arguments[2],
      currentLabel = bookmarkName + ', ' + flowName + ', ' + index,
      inputBoxOptions = <vscode.InputBoxOptions>{
        prompt: 'Edit Bookmark name, Flow name, index',
        placeHolder: 'Bookmark name, Flow name, index',
        value: currentLabel,
      };
    vscode.window.showInputBox(inputBoxOptions).then(enteredText => {
      if (!enteredText) {
        vscode.window.showInformationMessage('Please enter Bookmark Name,Flow Name and/or index');
        return;
      }
      bookmarkController.editBookmark(filePath, lineNumber, enteredText);
      vscode.commands.executeCommand('flowBookmarksView.refreshEntry');
    });
  });

  // Clear the bookmark from Command Prompt
  let clearBookmark = vscode.commands.registerCommand('flowbookmark.clear', () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return vscode.window.showWarningMessage('Select a file first');
    }
    bookmarkController.clearBookmark(activeEditor);
    vscode.commands.executeCommand('flowBookmarksView.refreshEntry');
  });

  // Delete Bookmark from Sidebar
  const deleteBookmark = vscode.commands.registerCommand('flowBookmarksView.deleteBookmark', node => {
    const [index, bookmarkName] = node.label.split('. '),
      filePath = node.command.arguments[0],
      lineNumber = node.command.arguments[1],
      flowName = node.command.arguments[2];
    bookmarkController.deleteBookmark(filePath, lineNumber);
    vscode.commands.executeCommand('flowBookmarksView.refreshEntry');
  });

  // Clear All bookmarks from Command Prompt
  let clearAllBookmarks = vscode.commands.registerCommand('flowbookmark.clearAll', () => {
    bookmarkController.clearAllBookmarks();
    vscode.commands.executeCommand('flowBookmarksView.refreshEntry');
  });

  // Jump To bookmark from Sidebar
  vscode.commands.registerCommand('flowBookmark.jumpTo', (filePath: string, lineNumber: string) => {
    editorController.openTextDocument(filePath, lineNumber);
  });

  // Testing purpose helloWorld
  // let disposable = vscode.commands.registerCommand('flowbookmark.helloWorld', () => {
  //   vscode.window.showInformationMessage('Hello from FlowBookmark!');
  // });

  // context.subscriptions.push(disposable);
  context.subscriptions.push(addNew);
  context.subscriptions.push(editBookmark);
  context.subscriptions.push(clearBookmark);
  context.subscriptions.push(deleteBookmark);
  context.subscriptions.push(clearAllBookmarks);
}

// this method is called when your extension is deactivated
export function deactivate() {}
