import React, {useRef, useState} from "react";

import Editor from "@monaco-editor/react";
import styles from './App.module.css';

const defaultCode = `
fn sumOfFirstNumbers(n) {
    if (n == 0) {
        return 0
    } else {
        return n + sumOfFirstNumbers(n - 1)
    }
}

println("Hello NAME")
println("Here is 1 + 2 + ... + 100")
println(sumOfFirstNumbers(100))
`;

function sendCodeToServer(code) {
    return fetch("https://jexlang.herokuapp.com", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: code,
    });
}

const Status = {
    IDLE: "IDLE",
    PENDING: "PENDING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
}

function App() {
    const editorRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [sendingCodeStatus, setSendingCodeStatus] = useState(Status.IDLE);
    const [statusText, setStatusText] = useState("");
    const [outputText, setOutputText] = useState("");


    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        setEditorLoaded(true);
    }

    async function onRun() {
        const editorText = editorRef.current.getValue();
        try {
            setSendingCodeStatus(Status.PENDING);
            const response = await sendCodeToServer(editorText);
            setOutputText(await response.text());
            if (response.status === 200) {
                setSendingCodeStatus(Status.SUCCESS);
                setStatusText("Run completed");
            } else {
                setSendingCodeStatus(Status.FAILURE);
                setStatusText("Error");
            }
        } catch (e) {
            setSendingCodeStatus(Status.FAILURE);
            setStatusText("Connection failure");
            setOutputText(e.message);
        }
    }

    const statusTextClassName = sendingCodeStatus == Status.FAILURE ? "statusText__error" : "statusText__normal"

    return (
        <div className={styles.App}>
            <div className={styles.editorContainer}>
                <Editor
                    height="90vh"
                    defaultLanguage="txt"
                    defaultValue={defaultCode}
                    onMount={handleEditorDidMount}
                />
            </div>
            <div className={styles.runnerContainer}>
                <button className={styles.runButton}
                        onClick={onRun}
                        disabled={sendingCodeStatus === Status.PENDING || !editorLoaded}>Run
                </button>
                <p className={styles[statusTextClassName]}>{statusText}</p>
                <code className={styles.outputText}>{outputText}</code>
            </div>
        </div>
    );
}

export default App;
