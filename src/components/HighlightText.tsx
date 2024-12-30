import React from 'react';

interface HighlightTextProps {
  text: string;
  highlight: string;
}

export default function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  try {
    // 转义特殊字符，避免正则表达式错误
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => {
          // 使用原始搜索词进行比较，而不是正则测试
          return part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          );
        })}
      </>
    );
  } catch (error) {
    return <>{text}</>;
  }
} 