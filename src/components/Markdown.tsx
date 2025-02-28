import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  text: string;
}

const Markdown: React.FC<MarkdownProps> = ({ text }) => {
  return <ReactMarkdown>{text}</ReactMarkdown>;
};

export default Markdown;
