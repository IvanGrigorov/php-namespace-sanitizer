// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "php-namespace-sanitizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = generateNamespaceSinitizeCommand();

	context.subscriptions.push(disposable);
}

function generateNamespaceSinitizeCommand() {
	let disposable = vscode.commands.registerCommand('php-namespace-sanitizer.sanitize', () => {
		vscode.window.activeTextEditor!.edit(editBuilder => {
			let text = vscode.window.activeTextEditor!.document.getText();
			let lines = text.split('\r\n');
			lines = lines.map((line) => line.trim());
			let lineIndex = 0;
			lines.forEach(line => {
				line = line.replace(';', '');
				sainitizeLineByLine(line, editBuilder, text, lineIndex);
				lineIndex++;
			})
		})
	});
	return disposable;
}

function sainitizeLineByLine(line: string, editBuilder: vscode.TextEditorEdit, text: string, lineIndex: number) {
	if (/^use /.test(line)) {
		let textToLookUp = text.replace(line, '');
		let latestNamespace = line.split('\\').pop() || '';
		let namespace = '';
		let splitByAlias = latestNamespace?.split(' as ') || [];
		if (splitByAlias.length > 1) {
			namespace = splitByAlias.pop()!.trim();
		}
		else {
			namespace = latestNamespace.trim();
		}
		let regex = namespace + '[^\\w]';
		var count = (textToLookUp.match(new RegExp(regex, 'gm')) || []).length;
		if (!count) {
			editBuilder.delete(new vscode.Range(new vscode.Position(lineIndex, 0), new vscode.Position(lineIndex + 1, 0)));
		}
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
