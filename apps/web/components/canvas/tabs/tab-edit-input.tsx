import { useEffect, useRef, useState } from "react";
import { TabEditInputProps } from "./props";

export default function TabEditInput({
  initialValue,
  onConfirm,
  onCancel,
  className = "",
}: TabEditInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // 挂载后自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select(); // 选中原有文本，方便直接替换
  }, []);

  // 处理键盘事件：回车确认、ESC 取消
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onConfirm(value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onConfirm(value)} // 失焦自动确认
      className={className}
      aria-label="编辑标签名称"
    />
  );
}
