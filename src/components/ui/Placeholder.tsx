import { CSSProperties } from 'react';

type PlaceholderProps = {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
  style?: CSSProperties;
  className?: string;
};

export default function Placeholder({
  width = 300,
  height = 300,
  text = 'Placeholder',
  bgColor = '#1F2937',
  textColor = '#9CA3AF',
  style,
  className,
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
    >
      <span className="text-lg font-medium">{text}</span>
    </div>
  );
}