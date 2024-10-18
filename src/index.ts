import * as vscode from 'vscode';
import { MySTFoldingRangeProvider } from './foldingProvider.js';
import { YAMLFrontmatterHoverProvider } from './hoverProvider.js';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      { language: 'markdown' },
      new MySTFoldingRangeProvider(),
    ),
    vscode.languages.registerFoldingRangeProvider(
      { language: 'myst' },
      new MySTFoldingRangeProvider(),
    ),
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { scheme: 'file', language: 'myst' },
      new YAMLFrontmatterHoverProvider(),
    ),
  );

  // Register the schema association programmatically if needed
  const yamlExtension = vscode.extensions.getExtension('redhat.vscode-yaml');
  if (yamlExtension) {
    // Check if the YAML extension is activated
    yamlExtension.activate().then(() => {
      vscode.window.showInformationMessage('YAML Schema Extension Activated!');
    });
  } else {
    vscode.window.showErrorMessage('RedHat YAML extension is required for this extension to work.');
  }
}

export function deactivate() {}
