import { CSSProperties } from 'react';

interface PlaceholderProps {
  width: number | string;
  height: number | string;
  text?: string;
  bgColor?: string;
  textColor?: string;
  style?: CSSProperties;
  className?: string;
}

export default function Placeholder({
  width,
  height,
  text = 'Placeholder',
  bgColor = '#1F2937',
  textColor = '#9CA3AF',
  style,
  className,
  ...props
}: PlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        ...style,
      }}
      {...props}
    >
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}