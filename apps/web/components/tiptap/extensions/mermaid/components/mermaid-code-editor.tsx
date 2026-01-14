import { EMPTY_CODE_PLACEHOLDER } from "./constants";

interface MermaidCodeEditorProps {
  code: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function MermaidCodeEditor({
  code,
  onChange,
}: MermaidCodeEditorProps) {
  return (
    <div className="code-editor">
      <textarea
        value={code}
        onChange={onChange}
        placeholder={EMPTY_CODE_PLACEHOLDER}
        className="mermaid-textarea"
        spellCheck={false}
      />
    </div>
  );
}
