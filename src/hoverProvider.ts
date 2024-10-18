import * as vscode from 'vscode';

export class YAMLFrontmatterHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position, /(\w+)/);
    position.line;
    if (!range) {
      return;
    }

    const word = document.getText(range);
    const documentation = getDocumentationForKey(word);

    if (documentation) {
      return new vscode.Hover(documentation);
    }
  }
}

function getDocumentationForKey(key: string): string | null {
  const docs: { [key: string]: string } = {
    title: 'The title of the document.',
    author: 'The author of the document.',
    tags: 'A list of tags associated with the document.',
    description: 'A brief description of the document.',
  };

  return docs[key] || null;
}
