import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Line, Text as SvgText, Circle } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width; // Keep this for default, but allow override
const defaultChartHeight = 300;
const defaultChartPadding = 40;

interface Point {
  x: number;
  y: number;
}

interface AxisLabel {
  value: string;
  x: number;
  y: number;
}

interface GraphAreaProps {
  points: Point[];
  minXValue: number; // Changed from minLogSIgE
  maxXValue: number; // Changed from maxLogSIgE
  xAxisLabel?: string; // New prop for dynamic x-axis label
  chartHeight?: number;
  chartPadding?: number;
  screenWidth?: number;
  highlightPoint?: Point | null;
}

export default function GraphArea({
  points,
  minXValue, // Changed
  maxXValue, // Changed
  xAxisLabel = "Value", // Default X-axis label
  chartHeight = defaultChartHeight,
  chartPadding = defaultChartPadding,
  screenWidth: propScreenWidth = screenWidth,
  highlightPoint = null,
}: GraphAreaProps) {
  const chartUsableWidth = propScreenWidth - 2 * chartPadding;
  const chartUsableHeight = chartHeight - 2 * chartPadding;

  // Helper function to convert data points to SVG coordinates
  const convertDataPointToSvgPoint = (point: Point): { xPos: number; yPos: number } => {
    const xPos = chartPadding + ((point.x - minXValue) / (maxXValue - minXValue)) * chartUsableWidth; // Changed
    const yPos = chartPadding + chartUsableHeight - point.y * chartUsableHeight;
    return { xPos, yPos };
  };

  // Convert data points to SVG path
  const pathData = points
    .map((p, index) => {
      const { xPos, yPos } = convertDataPointToSvgPoint(p);
      return `${index === 0 ? 'M' : 'L'} ${xPos.toFixed(2)} ${yPos.toFixed(2)}`;
    })
    .join(' ');

  // X-axis labels
  const numXLabels = 5;
  const xAxisLabels: AxisLabel[] = [];
  for (let i = 0; i <= numXLabels; i++) {
    const xValue = minXValue + i * ((maxXValue - minXValue) / numXLabels); // Changed
    // For x-axis labels, y-coordinate in data terms is irrelevant for xPos calculation.
    // We only need xPos from the conversion.
    const { xPos } = convertDataPointToSvgPoint({ x: xValue, y: 0 });
    xAxisLabels.push({
      value: Math.pow(10, xValue).toFixed(xValue >= 0 ? (xValue < 1 && xValue > -1 && xValue !== 0 ? 2 : 0) : 2), // Adjusted precision
      x: xPos,
      y: chartHeight - chartPadding + 15,
    });
  }

  // Y-axis labels (Probability %)
  const yAxisLabels: AxisLabel[] = [];
  const numYLabels = 4;
  for (let i = 0; i <= numYLabels; i++) {
    const yValue = i / numYLabels; // This is the probability value (0 to 1)
    // For y-axis labels, x-coordinate in data terms is irrelevant for yPos calculation.
    // We only need yPos from the conversion.
    const { yPos } = convertDataPointToSvgPoint({ x: 0, y: yValue });
    yAxisLabels.push({
      value: `${(yValue * 100).toFixed(0)}%`,
      x: chartPadding - 2,
      y: yPos,
    });
  }

  return (
    <Svg height={chartHeight} width={propScreenWidth} viewBox={`0 0 ${propScreenWidth} ${chartHeight}`}>
      {/* Grid lines */}
      {yAxisLabels.map((label, index) => (
        (label.value !== '0%' || index === 0) && (label.value !== '100%' || index === numYLabels) && (
          <Line
            key={`h-grid-${index}`}
            x1={chartPadding}
            y1={label.y}
            x2={chartPadding + chartUsableWidth}
            y2={label.y}
            stroke="#e0e0e0"
            strokeDasharray="3,3"
          />
        )
      ))}
      {xAxisLabels.map((label, index) => (
        (index > 0 && index < numXLabels) && (
          <Line
            key={`v-grid-${index}`}
            x1={label.x}
            y1={chartPadding}
            x2={label.x}
            y2={chartPadding + chartUsableHeight}
            stroke="#e0e0e0"
        strokeDasharray="3,3"
      />
    )
  ))}

  {/* X-axis */}
  <Line
    x1={chartPadding}
    y1={chartHeight - chartPadding}
    x2={chartPadding + chartUsableWidth}
    y2={chartHeight - chartPadding}
    stroke="black"
    strokeWidth="1"
  />
  {xAxisLabels.map((label, index) => (
    <SvgText
      key={`x-sigE-label-${index}`}
      x={label.x}
      y={label.y}
      fontSize="12"
      fill="black"
      textAnchor="middle"
    >
      {label.value}
    </SvgText>
  ))}
  <SvgText
    x={chartPadding + chartUsableWidth / 2}
    y={chartHeight - chartPadding + 30}
    fontSize="11"
    fill="black"
    textAnchor="middle"
  >
    {xAxisLabel}
  </SvgText>

  {/* Y-axis */}
  <Line
        x1={chartPadding}
        y1={chartPadding}
        x2={chartPadding}
        y2={chartHeight - chartPadding}
        stroke="black"
        strokeWidth="1"
      />
      {yAxisLabels.map((label, index) => (
        <SvgText
          key={`y-label-${index}`}
          x={label.x}
          y={label.y}
          fontSize="10"
          fill="black"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {label.value}
        </SvgText>
      ))}
      <SvgText
        x={chartPadding - 28}
        y={chartPadding + chartUsableHeight / 2}
        fontSize="11"
        fill="black"
        textAnchor="middle"
        transform={`rotate(-90, ${chartPadding - 28}, ${chartPadding + chartUsableHeight / 2})`}
      >
        Probability (%)
      </SvgText>

      {/* Probability Curve */}
      {pathData && <Path d={pathData} stroke="dodgerblue" strokeWidth="2.5" fill="none" />}

      {/* Highlighted Point */}
      {highlightPoint && Number.isFinite(highlightPoint.x) && Number.isFinite(highlightPoint.y) && (() => {
        const { xPos, yPos } = convertDataPointToSvgPoint(highlightPoint);
        return (
          <Circle
            cx={xPos}
            cy={yPos}
            r="5" // Radius of the circle
            fill="red" // Color of the circle
          />
        );
      })()}
    </Svg>
  );
}
