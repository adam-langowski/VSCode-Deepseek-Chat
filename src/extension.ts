import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "local-llm" is now active!');

	const disposable = vscode.commands.registerCommand('local-llm.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'deepchat',
			'DeepSeek Chat',
			vscode.ViewColumn.One,
			{enableScripts:true}	
		);

		panel.webview.html = getWebviewContent();

		panel.webview.onDidReceiveMessage(async (message: any) => {
			if(message.command === 'chat') {
				const userPrompt = message.prompt;
				let responseText = '';
				
				try {
					const streamResponse = await ollama.chat({
						model: 'deepseek-r1:7b',
						messages: [{role: 'user', content: userPrompt}],
						stream: true
					});
					
					for await (const part of streamResponse) {
						responseText += part.message.content;
						panel.webview.postMessage({command: 'chatResponse', text: responseText});
					}
				} catch (err) {
					console.error('Error:', err);
					panel.webview.postMessage({command: 'chatResponse', text: 'Error: ' + (err as Error).message});
				}
			}
		});
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				font-family: 'Arial', sans-serif;
				margin: 0;
				padding: 1rem;
				background-color: #f9f9f9;
				color: #333;
			}
			h3 {
				color: #444;
				margin-bottom: 1rem;
			}
			#prompt {
				width: 100%;
				box-sizing: border-box;
				padding: 0.75rem;
				font-size: 1rem;
				border: 1px solid #ccc;
				border-radius: 4px;
				margin-bottom: 1rem;
				resize: vertical;
				min-height: 100px;
			}
			#askButton {
				background-color: #007acc;
				color: white;
				border: none;
				padding: 0.75rem 1.5rem;
				font-size: 1rem;
				border-radius: 4px;
				cursor: pointer;
				transition: background-color 0.3s ease;
			}
			#askButton:hover {
				background-color: #005f99;
			}
			#response {
				border: 1px solid #ccc;
				border-radius: 4px;
				padding: 1rem;
				background-color: white;
				margin-top: 1rem;
				white-space: pre-wrap;
				font-family: 'Courier New', Courier, monospace;
				font-size: 0.9rem;
				color: #555;
			}
			footer {
				margin-top: 2rem;
				text-align: center;
				font-size: 0.8rem;
				color: #777;
			}
		</style>
	</head>
	<body>
		<h3>DeepSeek Chat</h3>
		<textarea id="prompt" rows="3" placeholder="Type your message here..."></textarea><br />
		<button id="askButton">Ask</button>
		<div id="response"></div>
		<footer>
			Powered by Ollama & DeepSeek | VS Code Extension | Adam Langowski 2025
		</footer>

		<script>
			const vscode = acquireVsCodeApi();

			function sendMessage() {
				const prompt = document.getElementById('prompt').value;
				if (prompt.trim()) { 
					vscode.postMessage({command: 'chat', prompt});
				}
			}

			document.getElementById('askButton').addEventListener('click', sendMessage);

			document.getElementById('prompt').addEventListener('keydown', (event) => {
				if (event.key === 'Enter' && !event.shiftKey) { 
					event.preventDefault(); 
					sendMessage(); 
				}
			});

			window.addEventListener('message', event => {
				const { command, text } = event.data;
				if(command === 'chatResponse') {
					document.getElementById('response').innerText = text;
				} 
			});
		</script>
	</body>
	</html>
	`;
}