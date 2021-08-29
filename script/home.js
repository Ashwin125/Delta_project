let editor = document.querySelector('.code');
let io = document.querySelector('.io');
let input = document.querySelector(".input");
let output = document.querySelector('.output');
let language = document.querySelector('.language');
let fonts = document.querySelector('.fonts');
let font_size = document.querySelector('#font_size');
let run = document.querySelector('#run');
let save = document.querySelector('#save');
let copy = document.querySelector("#copy");
let download = document.querySelector('#download');
let downloadButton = document.querySelector('#download_file');
let file_is_open = false;
let open_fileName = '';
let open_fileID = NaN;

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

font_size.value = 18;

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

Inputs.setValue("Input goes here.. (clear)\n");
Outputs.setValue("Output \n")

language.addEventListener('change', (e) => {

    let lang_precode;    

    if(e.target.value === 'c') {
        CodeEditor.setOption('mode', 'text/x-csrc');
        // CodeEditor.setValue(cCode);
        lang_precode = cCode;
    } else if (e.target.value === 'c++') {
        CodeEditor.setOption('mode', 'text/x-c++src');
        lang_precode = cppCode;
    } else if (e.target.value === 'java') {
        CodeEditor.setOption('mode', 'text/x-java');
        lang_precode = javaCode;
    } else if (e.target.value === 'javascript') {
        CodeEditor.setOption('mode', 'javascript');
        lang_precode = jsCode;
    } else if (e.target.value === 'python') {
        CodeEditor.setOption('mode', 'python');
        lang_precode = pyCode;
    }

    if(!file_is_open)
        CodeEditor.setValue(lang_precode);
    CodeEditor.refresh();

});

fonts.addEventListener('change', e => {

    document.querySelector('.CodeMirror').style.fontFamily = e.target.value;

});

run.addEventListener('click', () => {

    let lang = getLanguage();


    fetch('/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({
            type: 'process',
            language: lang,
            code: CodeEditor.getValue(),
            input: Inputs.getValue(),
        })
    })
    .then(res => {
        return (res.text());
    })
    .then(res => {
        return JSON.parse(res);
    })
    .then(res => {

        let Output;
        if(res.err !== undefined) {
            Output = res.stderr + '\n\n';
        } else {
            Output = res.stdout + '\n\n';
        }
        
        Outputs.setValue(
            Output
        )
    })
    .catch(err => {
        window.alert('Something went wrong');
    })

});

document.querySelector('#pop_save_modal').addEventListener('click', () => {
    if(file_is_open) {
        document.querySelector('#save_file_name').value = open_fileName;
    }
});

document.querySelector('#clear').addEventListener('click', () => {
    CodeEditor.setValue('');
});

copy.addEventListener('click', () => {


    navigator.clipboard.writeText(CodeEditor.getValue());


});

download.addEventListener('click', (e) => {

    if(file_is_open) {

        document.querySelector('#download_file_name').value = open_fileName;

    } else {

        let name = 'Code_Editor_' + (new Date()).toLocaleString().replace(' ', '').replace(',','_') + '.' + getLanguage();
        document.querySelector('#download_file_name').value = name;

    }

});

downloadButton.addEventListener('click', e => {

    let fileName = document.querySelector('#download_file_name').value;
    let content = CodeEditor.getValue();
    let blob = new Blob([content], { type: 'text/plain;charset=utf-8'});
    let a = document.createElement('a');

    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
    
    a.remove();

});

font_size.addEventListener('change', () => {

    let size = Number(font_size.value);

    document.querySelector('#range_value').innerHTML = size + 'px';

    document.querySelectorAll('.CodeMirror').forEach(e =>  {
        e.style.fontSize = size + 'px';
    })

});

if(save) {

    save.addEventListener('click', () => {

        let content = CodeEditor.getValue();
        let language = getLanguage();

        let fileName = document.querySelector('#save_file_name').value;
        let extension = fileName.split('.');
        extension = extension[extension.length - 1];

        if(extension !== language) 
            fileName += '.' + language;

            
        if(file_is_open) {
            

            fetch('/home', { 

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({

                    type: 'update',
                    fileName: fileName,
                    content: content,
                    fileID: open_fileID,
                    lang: language,

                })
            })

            document.querySelector('#file_name').innerHTML = fileName;
            let id = '#file_' + open_fileID + '_block p';
            document.querySelector(id).innerHTML = fileName;
            document.querySelector('#save_file_name').value = '';
            return;
        }


        fetch('/home', {
    
            method: 'POST',
    
            headers: {
                'Content-Type': 'application/json'  
            },
    
            body: JSON.stringify({
                type: 'save',
                language: language,
                content: content,
                file_name: fileName
            })
    
        })
        .then(res => {
            return res.text();
        })
        .then(res => {
            insertFiles();
            document.querySelector('#save_file_name').value = '';
            return JSON.parse(res);
        })
        .catch(err => {
            window.alert("Something went wrong");
        })
        
    });

}

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

function getLanguage() {
    let lang = '';
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

    return lang;

}

function insertFiles() {

    getAllFiles()
    .then(res => {

        let fileslist = document.querySelector('#fileslist');
        
        if(Array.isArray(res)) {
            
            if(res.length === 0) {
                fileslist.innerHTML = `
                    <div class="text-center">
                        You don't have any file saved. 
                    </div>
                `
            } else {
                fileslist.innerHTML = '';

                res.forEach(file => {

                    fileslist.innerHTML += `
                        <ul id='file_${file.FileID}_block' style='list-style: none' class='p-0'>
                            <li class='d-flex justify-content-between'>
                                
                                <p style='font-size: 14px'>${file.File_Name}</p> 
                                
                                <div class='btn-group d-flex'>
                                    <p data-file='${file.FileID}' data-fileName='${file.File_Name}' data-bs-toggle="modal" data-bs-target="#deleteModal" class='delete btn btn-outline-danger'>Delete</p>
                                    <p data-file='${file.FileID}' data-fileName='${file.File_Name}' data-last-open='${file.Last_Modified}' class='open btn btn-outline-primary'>Open</p>
                                    <p data-file='${file.FileID}' data-fileName='${file.File_Name}' data-bs-toggle="modal" data-bs-target="#renameModal" class='rename btn btn-outline-primary'>Rename</p>
                                </div>
                            </li>
                        </ul>
                    `
                });

                addDeleteEvent();
                addRenameEvent();
                addOpenEvent();
            }

        } else {
            fileslist.innerHTML = `
                <div class="text-center">
                    Login/Register to view and save your file.
                </div>
            `
        }
    });

}

function getFile(fileID) {


    return fetch('/home', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'file',
            fileID: fileID,
        })
    })
    .then(res => {
        return res.text()
    })
    .then(res => {
        return JSON.parse(res)
    })
    .then(res => {
        return res;
    })
    .catch(err => {
        // do nothing
    })

}

function getAllFiles() {

    return fetch('/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({
            type: 'files',
        })
    })
    .then(res => {
        return (res.text());
    })
    .then(res => {
        return JSON.parse(res);
    })
    .then(res => {
        return res;

    })
    .catch(err => {
        // nothing to do.
    })

}

function deleteFile(fileID) {
    fetch('/home', {
        method: 'DELETE',

        headers: {
            'Content-Type': 'application/json'  
        },

        body: JSON.stringify({
            fileID: fileID
        })
    })
    .then(() => {

        let id = 'file_' + fileID + '_block';
        document.getElementById(id).innerHTML = '';
        document.getElementById(id).remove();

        if (document.querySelector('#fileslist').children.length === 0) {
            document.querySelector('#fileslist').innerHTML += `
                <div class="text-center">
                    You don't have any file saved. 
                </div>
            `
        }

    });
}

function renameFile(fileID, newName) {
    fetch('/home', {
        method: "POST",

        headers: {
            "Content-Type": 'application/json'
        },

        body: JSON.stringify({
            type: 'rename',
            fileID: fileID,
            new_Name: newName
        })
    })
    .then(() => {
        let id = '#file_' + fileID + '_block p';
        document.querySelector(id).innerHTML = newName;
    })
}

document.addEventListener('DOMContentLoaded', () => {
    insertFiles();
});

function addDeleteEvent() {

    let fileID;
    let fileName;
    let deleteButton = document.querySelector('#delete_modal');

    document.querySelectorAll('.delete').forEach(element => {

        element.addEventListener('click', e => {

            fileID = element.getAttribute('data-file');
            fileName = element.getAttribute('data-fileName');
            document.querySelector('#delete_name').innerHTML = element.getAttribute('data-fileName');
    
        });
    
    });

    deleteButton.addEventListener('click', e => {

        deleteFile(fileID);
        // window.alert(fileName + " is deleted");

    });
    
}

function addRenameEvent() {

    let fileID;
    let fileName;
    let renameButton = document.querySelector('#rename_button');

    document.querySelectorAll('.rename').forEach(element => {

        element.addEventListener('click', e => {

            fileID = element.getAttribute('data-file');
            fileName = element.getAttribute('data-fileName');
            document.querySelector('#rename_fileName').innerHTML = fileName;

        });

    });

    renameButton.addEventListener('click', e => {

        let newName = document.querySelector('#rename_file').value;
        renameFile(fileID, newName);

    });

}

function addOpenEvent() {

    let fileLabel = document.querySelector('#file_name');
    let closeButton = document.querySelector('#close_open_file')

    document.querySelectorAll('.open').forEach(element => {

        element.addEventListener('click', e => {

            let fileName = element.getAttribute('data-fileName');
            let fileID = element.getAttribute('data-file');
            let lastUpdated = element.getAttribute('data-last-open');

            getFile(fileID)
            .then(fileContent => {

                fileLabel.innerHTML = fileName;
                CodeEditor.setValue(fileContent.content);

                file_is_open = true;
                open_fileID = fileID;
                open_fileName = fileName;

                let extension = fileName.split('.');
                extension = extension[extension.length - 1];

                switch (extension) {
                    case 'c':
                        language.selectedIndex = 0;
                        break;

                    case 'cpp':
                        language.selectedIndex = 1;
                        break;

                    case 'java':
                        language.selectedIndex = 2;
                        break;

                    case 'py':
                        language.selectedIndex = 3;
                        break;

                    case 'js':
                        language.selectedIndex = 4;
                        break;

                }

                fileLabel.style.display = 'block';
                fileLabel.setAttribute('data-bs-original-title', 'Last-updated ' + lastUpdated);
                closeButton.style.display = 'block';

            });

        });

    });

    
    closeButton.addEventListener('click', e => {

        file_is_open = false;
        open_fileID = NaN;
        open_fileName = '';

        CodeEditor.setValue('');

        fileLabel.style.display = 'none';
        closeButton.style.display = 'none';

    });
    
}
