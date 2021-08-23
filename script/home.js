let editor = document.querySelector('.code');
let io = document.querySelector('.io');
let input = document.querySelector(".input");
let output = document.querySelector('.output');
let language = document.querySelector('.language');
let fonts = document.querySelector('.fonts');
let run = document.querySelector('#run');
let save = document.querySelector('#save');
let download = document.querySelector('#download');

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

let cCode = `#include<stdio.h>

int main(void) {
    printf("Hello, World!");
    return 0;
}
`

let cppCode = `#include<iostream>
using namespace std;

int main(void) {
    cout << "Hello, World!" << endl;
    return 0;
}
`

let javaCode = `// class name must be test

public class test {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`

let jsCode = `console.log("Hello, World!");`

let pyCode = `print("Hello, World!");`


const CodeEditor = new CodeMirror(editor, {
    lineNumbers: true, 
    mode: "text/x-csrc",
    value: cCode,
    smartIndent: true,
    spellcheck: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true,
    indentWithTabs: true,
    styleActiveLine: true,
    scrollbarStyle: 'overlay',
    lineWiseCopyCut: true,
    enableSearchTools: true,
    enableCodeFolding: true,
    highlightMatches: true,
    spellcheck: true,
    autoInsert: true,
    extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
    autoCloseBrackets: true,
    theme: 'erlang-dark',
    lineWrapping: true,
});
const Outputs = new CodeMirror(output, {
    theme: 'erlang-dark',
    lineWrapping: true,
    scrollbarStyle: 'overlay',
    readOnly: true,
});
const Inputs = new CodeMirror(input, {
    theme: 'erlang-dark',
    lineWrapping: true,
    scrollbarStyle: 'overlay'
});

CodeEditor.setSize('100vw', '63vh');
Outputs.setSize('100%', '100%');
Inputs.setSize('100%', '100%');


// Inputs.placeholder = 'Input goes here';
Inputs.setValue("Input goes here.. (clear)\n");
Outputs.setValue("Output \n")

language.addEventListener('change', (e) => {

    if(e.target.value === 'c') {
        CodeEditor.setOption('mode', 'text/x-csrc');
        CodeEditor.setValue(cCode);
    } else if (e.target.value === 'c++') {
        CodeEditor.setOption('mode', 'text/x-c++src');
        CodeEditor.setValue(cppCode);
    } else if (e.target.value === 'java') {
        CodeEditor.setOption('mode', 'text/x-java');
        CodeEditor.setValue(javaCode);
    } else if (e.target.value === 'javascript') {
        CodeEditor.setOption('mode', 'javascript');
        CodeEditor.setValue(jsCode);
    } else if (e.target.value === 'python') {
        CodeEditor.setOption('mode', 'python');
        CodeEditor.setValue(pyCode);
    } else if (e.target.value === 'php') {
        CodeEditor.setOption('mode', 'php');
    }

    CodeEditor.refresh();

});

fonts.addEventListener('change', e => {

    document.querySelectorAll('.CodeMirror *').forEach(el => {
        el.style.fontFamily = e.target.value;
    });

});

run.addEventListener('click', () => {


    let lang = '';

    // console.log(CodeEditor.getMode());

    switch (CodeEditor.getMode().helperType ?? CodeEditor.getMode().name) {
        case 'text/x-csrc':
            lang = 'c';
            break;

        case 'text/x-c++src':
            lang = 'cpp';
            break;

        case 'text/x-java':
            lang = 'java';
            break;
        
        case 'python':
            lang = 'py';
            break;

        case 'javascript':
            lang = 'js'
            break;

    }
    // console.log("now sending");

    fetch('/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({
            language: lang,
            code: CodeEditor.getValue(),
        })
    })
    .then(res => {
        // console.log('now hre');
        return (res.text());
    })
    .then(res => {
        return JSON.parse(res);
    })
    .then(res => {

        let Output;
        // console.log('now here');

        if(res.err !== undefined) {
            Output = res.stderr + '\n\n';
        } else {
            Output = res.stdout + '\n\n';
        }
        // console.log(output);
        Outputs.setValue(
            Output
        )
    })
    .catch(err => {
        // console.log(err);
    })

});


let seperator = document.querySelector('.seperator');
let keyPressed = false;


function move(e) {

    setTimeout(() => {
        if(window.innerHeight - e.y > 40 && e.y >= 100) {
            CodeEditor.setSize('100vw', `calc(${e.y - 1}px - 7vh)`)
            
            Inputs.setSize('100%', `${window.innerHeight - 6 - e.y}px`)
            Outputs.setSize('100%', `${window.innerHeight - 6 - e.y}px`)
            input.style.height = `${window.innerHeight - 6 - e.y}px`
            io.style.height = `${window.innerHeight - 6 - e.y}px`
            output.style.height = `${window.innerHeight - 6 - e.y}px`
            
        } 
    }, 50)
}

seperator.addEventListener('mousedown', (e) => {
    window.addEventListener('mousemove', move);
});

window.addEventListener('mouseup', (e) => {
    window.removeEventListener('mousemove', move);
});
