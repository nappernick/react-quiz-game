// src/components/CodeEditor.tsx
import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { CodeEditorProps } from '../core/domain/UI';

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value,
  onChange,
  height = '100%',
  readOnly = false,
  className = ''
}) => {
  return (
    <div className={`code-editor-container ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        readOnly={readOnly}
        style={{ flex: 1 }}
      basicSetup={{
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
      }}
      />
    </div>
  );
};

export default CodeEditor;
