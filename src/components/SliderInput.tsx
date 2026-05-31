import HelpTip from './HelpTip';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatDisplay?: (value: number) => string;
  helpText?: string;
  id: string;
}

export default function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatDisplay,
  helpText,
  id,
}: SliderInputProps) {
  const display = formatDisplay ? formatDisplay(value) : String(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center">
          {label}
          {helpText && <HelpTip text={helpText} />}
        </label>
        <span className="text-sm font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md min-w-[60px] text-center">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 accent-violet-600"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{formatDisplay ? formatDisplay(min) : min}</span>
        <span>{formatDisplay ? formatDisplay(max) : max}</span>
      </div>
    </div>
  );
}
