/** @format */

import * as vscode from 'vscode';

export class EditorController {
  bookmarkDecoratorList: any;
  colors: string[] = [];
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext, colors: string[]) {
    this.context = context;
    this.colors = colors;
    this.bookmarkDecoratorList = this.colors.map(color => {
      return vscode.window.createTextEditorDecorationType({
        gutterIconPath: context.asAbsolutePath(`images/bookmark-${color}.svg`),
      });
    });
  }

  openTextDocument(filePath: string, lineNumber: string): void {
    filePath = vscode.workspace.rootPath + filePath;
    const uriDocBookmark = vscode.Uri.file(filePath);
    vscode.workspace.openTextDocument(uriDocBookmark).then(doc => {
      vscode.window.showTextDocument(doc).then(editor => {
        const line: number = parseInt(lineNumber, 10);
        const column: number = parseInt(lineNumber, 10) + 100;
        let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
        if (editor.selection.active.line === line) {
          reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
        }
        const newSe = new vscode.Selection(line, column, line, column);
        editor.selection = newSe;
        editor.revealRange(newSe, reviewType);
      });
    });
  }

  displayBookmarkForActiveEditor(activeEditor: vscode.TextEditor, activeEditorBookmarks: any) {
    const linesOfEachFLow: any[][] = this.colors.map(color => []); // [[],[],[]]
    if (activeEditorBookmarks) {
      Object.keys(activeEditorBookmarks).forEach(lineNumber => {
        const rangeObject = {
          range: new vscode.Range(new vscode.Position(Number(lineNumber), 0), new vscode.Position(Number(lineNumber), 10)),
          rangeBehaviour: vscode.DecorationRangeBehavior.OpenClosed,
          hoverMessage:
            activeEditorBookmarks[lineNumber].bookmarkName +
              ', ' +
              activeEditorBookmarks[lineNumber].flowName +
              ', ' +
              activeEditorBookmarks[lineNumber].index || '',
        };
        const arr = linesOfEachFLow[Number(activeEditorBookmarks[lineNumber].flowIndex) % this.colors.length];
        arr.push(rangeObject);
      });
    }
    linesOfEachFLow.forEach((lines, index) => activeEditor.setDecorations(this.bookmarkDecoratorList[index], lines));
  }
}
