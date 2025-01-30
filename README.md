# DeepSeek VS Code Extension

This extension enables running DeepSeek models locally using Ollama. It provides a chat interface within VS Code to interact with the DeepSeek model.

![alt text](images/image.png)

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) with [npm](https://www.npmjs.com/) 
- [VS Code](https://code.visualstudio.com/) 
- [Ollama](https://ollama.com/)

## How to run

### 1. Download the DeepSeek Model
Run the following command to download the DeepSeek model:
```bash
ollama run deepseek-r1:7b
```
### 2. Clone this repository
```bash
git clone https://github.com/adam-langowski/local-llm-vscode-extension.git
cd local-llm-vscode-extension
```
  
### 3. Inside the project install the required dependencies:
```bash 
nmp i
```
### 4. Start Debugging
Press F5 or go to the Run and Debug section and start debugging.
![alt text](images/image-1.png)

### 5. Inside a new window run: **local-llm.start**
![1738234108542](images/llm-start.png)

- After the first usage it will show up as **Deepseek chat**
![1738232020212](images/chat.png)



### **Note**
You can select different models, just remember to adjust this section in **extension.ts** file:
![1738234699579](images/code-selection.png)
