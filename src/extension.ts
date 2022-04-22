import * as vscode from "vscode";

import sampleTokens from "./tokens_sample_format.json";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "materialtokenstocss.tokenstocss",
    () => {
      //

      const editor = vscode.window.activeTextEditor;
      try {
        if (editor) {
          const doc = editor.document;
          const text = doc.getText();

          if (text.length <= 20 || !text.includes('"dsp_spec_version"')) {
            /// not a valid DSP File
            // show an error message with a button to learn more
            vscode.window
              .showErrorMessage(
                "This is not a valid Materials Token File",
                "Learn More"
              )
              .then((selection) => {
                if (selection === "Learn More") {
                  vscode.env.openExternal(
                    vscode.Uri.parse(
                      "https://github.com/harshdhiman/material-tokens-to-CSS#How-to-use"
                    )
                  );
                }
              });
          } else {
            const tokens = JSON.parse(text) as typeof sampleTokens;

            let output = ".md-theme{\n";

            tokens.entities.forEach((entity) => {
              if (entity.value.startsWith("#")) {
                let line = "--" + entity.name.split(".").join("-");
                line += ": " + entity.value + ";";
                output += line + "\n";
              }
            });

            output += "}";

            //
            //replace the text
            editor.edit((editBuilder) => {
              editBuilder.replace(
                new vscode.Range(0, 0, doc.lineCount, 0),
                output
              );
            });
          }
        }
      } catch (e) {
        vscode.window.showErrorMessage(e as any);
      }
    }
  );

  context.subscriptions.push(disposable);
}
export function deactivate() {}
