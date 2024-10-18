import * as vscode from 'vscode';

export class MySTFoldingRangeProvider implements vscode.FoldingRangeProvider {
  provideFoldingRanges(
    document: vscode.TextDocument,
    context: vscode.FoldingContext,
    token: vscode.CancellationToken,
  ): vscode.FoldingRange[] | Thenable<vscode.FoldingRange[]> {
    const foldingRanges: vscode.FoldingRange[] = [];

    const startRegex = /^:{3,}.*$/; // Matches lines with ::: or more colons
    const endRegex = /^:{3,}\s*$/; // Matches lines with ::: or more colons without content

    let startLine: number | null = null;
    let startDelimiter: string | null = null;

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);

      // Check if the line is a start of a folding block
      if (startLine === null && startRegex.test(line.text)) {
        startLine = i;
        startDelimiter = line.text.match(/^:{3,}/)?.[0] || null; // Capture the start delimiter
      }

      // Check if the line is an end of a folding block
      if (startLine !== null && endRegex.test(line.text)) {
        const endDelimiter = line.text.match(/^:{3,}/)?.[0] || '';

        // Ensure the end delimiter matches the start delimiter
        if (startDelimiter && startDelimiter === endDelimiter) {
          foldingRanges.push(new vscode.FoldingRange(startLine, i));
          startLine = null; // Reset startLine for the next block
          startDelimiter = null;
        }
      }
    }

    return foldingRanges;
  }
}
