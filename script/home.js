let seperator = document.querySelector('.seperator');
let editor = document.querySelector('.code');
let output = document.querySelector('.output');
let mousePressed = false;
let language = document.querySelector('.language');
let fonts = document.querySelector('.fonts');

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

const CodeEditor = new CodeMirror(editor, {
    lineNumbers: true, 
    mode: "text/x-csrc",
    value: `#include<stdio.h>\n\nint main(void) {\n\tprintf("Hello World\\n");\n\treturn 0;\n}`,
    smartIndent: true,
    spellcheck: true,
    indentUnit: 4,
    tabSize: 4,
    matchBrackets: true,
    indentWithTabs: true,
    styleActiveLine: true,
    scrollbarStyle: 'overlay',
    lineWiseCopyCut: true,
    spellcheck: true,
    autoInsert: true,
    autoCloseBrackets: true,
    theme: 'erlang-dark',
    lineWrapping: true,
});

let height = window.innerHeight - document.querySelector('.navbar').offsetHeight;
CodeEditor.setSize("100%", height - 2 + "px");

window.onresize = () => {
    height = window.innerHeight - document.querySelector('.navbar').offsetHeight;
    CodeEditor.setSize("100%", height - 2 + "px");
};

function resize(e) {

    setTimeout(() => {
        editor.style.width = String(e.x) + "px";
        output.style.width = String(window.innerWidth - e.x - 12) + "px";
    }, 20)
    
};

seperator.addEventListener('mousedown', (e) => {
    seperator.children[0].classList.add('hover');
    document.addEventListener('mousemove', resize);
});

seperator.addEventListener('mouseup', (e) => {
    seperator.children[0].classList.remove('hover');
    document.removeEventListener('mousemove', resize);
});

language.addEventListener('change', (e) => {

    if(e.target.value === 'c') {
        CodeEditor.setOption('mode', 'text/x-csrc');
    } else if (e.target.value === 'c++') {
        CodeEditor.setOption('mode', 'text/x-c++src');
    } else if (e.target.value === 'java') {
        CodeEditor.setOption('mode', 'text/x-java');
    } else if (e.target.value === 'javascript') {
        CodeEditor.setOption('mode', 'javascript');
    } else if (e.target.value === 'python') {
        CodeEditor.setOption('mode', 'python');
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