import { useState, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

interface HelpTipProps {
  text: string;
}

export default function HelpTip({ text }: HelpTipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const tooltipId = `tooltip-${id.replace(/:/g, '')}`;

  function show() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8 + window.scrollY,
        left: Math.min(
          rect.left + window.scrollX,
          window.innerWidth - 264
        ),
      });
    }
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Help"
        aria-describedby={visible ? tooltipId : undefined}
        className="inline-flex items-center justify-center text-slate-400 hover:text-violet-500 focus:text-violet-500 focus:outline-none transition-colors ml-1"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        <HelpCircle size={15} />
      </button>

      {visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top - window.scrollY,
              left: pos.left,
              zIndex: 9999,
              maxWidth: 256,
            }}
            className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none leading-relaxed"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}
