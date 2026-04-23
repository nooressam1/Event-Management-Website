import React from "react";

// Splits a line on **bold** markers and returns mixed text/strong nodes
const renderInline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : part
  );

const PlanRenderer = ({ text, streaming }) => {
  if (!text && !streaming) return null;

  const lines = (text ?? "").split("\n");
  const elements = [];
  let listBuffer = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="space-y-1.5 pl-1">
        {listBuffer}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    const isBullet = /^[-*] /.test(line);
    if (!isBullet) flushList();

    if (/^## /.test(line)) {
      elements.push(
        <div key={i} className="pt-5 first:pt-0">
          <h3 className="text-xs font-bold text-MainBlue uppercase tracking-widest border-b border-LineBox pb-2 mb-3">
            {line.slice(3)}
          </h3>
        </div>
      );
    } else if (/^### /.test(line)) {
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-white mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h4>
      );
    } else if (isBullet) {
      listBuffer.push(
        <li key={i} className="flex gap-2.5 text-sm text-MainOffWhiteText leading-relaxed">
          <span className="text-MainBlue shrink-0 mt-0.5">›</span>
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-1" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-MainOffWhiteText leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList();

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-xl p-6 space-y-1">
      {elements}
      {streaming && (
        <span className="inline-block w-[6px] h-[14px] bg-MainBlue animate-pulse ml-0.5 align-middle rounded-sm" />
      )}
    </div>
  );
};

export default PlanRenderer;
