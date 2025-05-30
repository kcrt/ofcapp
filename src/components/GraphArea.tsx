import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Line, Text as SvgText, Circle } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width; // Keep this for default, but allow override

// Default visual parameters
const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_CHART_PADDING = 40;
const NUM_X_AXIS_LABELS = 5;
const NUM_Y_AXIS_LABELS = 4;

// Styling and layout constants
const STYLE_CONSTANTS = {
  AXIS_STROKE_WIDTH: '1',
  GRID_STROKE_COLOR: '#e0e0e0',
  GRID_STROKE_DASHARRAY: '3,3',
  X_AXIS_LABEL_Y_OFFSET: 15,
  X_AXIS_TITLE_Y_OFFSET: 30,
  Y_AXIS_LABEL_X_OFFSET: -2, // Offset from chartPadding for textAnchor="end"
  Y_AXIS_TITLE_X_OFFSET_ROTATED: -28, // Offset for rotated Y-axis title
  LABEL_FONT_SIZE_SMALL: 10,
  LABEL_FONT_SIZE_MEDIUM: 11,
  LABEL_FONT_SIZE_LARGE: 12,
  CURVE_STROKE_WIDTH: '2.5',
  CURVE_STROKE_COLOR: 'dodgerblue',
  HIGHLIGHT_POINT_RADIUS: 5,
  HIGHLIGHT_POINT_FILL_COLOR: 'red',
  TEXT_COLOR: 'black',
};

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

// Helper function to format X-axis label values (previously complex toFixed logic)
const formatXAxisLabelValue = (logValue: number): string => {
  const actualValue = Math.pow(10, logValue);
  if (logValue < 0) {
    return actualValue.toFixed(2); // e.g., 0.01, 0.10
  }
  if (logValue === 0) {
    return actualValue.toFixed(0); // e.g., 1
  }
  // logValue > 0
  if (logValue < 1) {
    return actualValue.toFixed(2); // e.g., 1.58, 3.16
  }
  return actualValue.toFixed(0); // e.g., 10, 100
};

export default function GraphArea({
  points,
  minXValue, // Changed
  maxXValue, // Changed
  xAxisLabel = "Value", // Default X-axis label
  chartHeight = DEFAULT_CHART_HEIGHT,
  chartPadding = DEFAULT_CHART_PADDING,
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
  const xAxisLabels: AxisLabel[] = [];
  for (let i = 0; i <= NUM_X_AXIS_LABELS; i++) {
    const xValue = minXValue + i * ((maxXValue - minXValue) / NUM_X_AXIS_LABELS);
    const { xPos } = convertDataPointToSvgPoint({ x: xValue, y: 0 }); // y is irrelevant for xPos
    xAxisLabels.push({
      value: formatXAxisLabelValue(xValue),
      x: xPos,
      y: chartHeight - chartPadding + STYLE_CONSTANTS.X_AXIS_LABEL_Y_OFFSET,
    });
  }

  // Y-axis labels (Probability %)
  const yAxisLabels: AxisLabel[] = [];
  for (let i = 0; i <= NUM_Y_AXIS_LABELS; i++) {
    const yValue = i / NUM_Y_AXIS_LABELS; // Probability value (0 to 1)
    const { yPos } = convertDataPointToSvgPoint({ x: 0, y: yValue }); // x is irrelevant for yPos
    yAxisLabels.push({
      value: `${(yValue * 100).toFixed(0)}%`,
      x: chartPadding + STYLE_CONSTANTS.Y_AXIS_LABEL_X_OFFSET,
      y: yPos,
    });
  }

  // Sub-component for Grid Lines
  function GridLines() {
    return (
      <>
        {/* Horizontal Grid lines based on Y-axis labels */}
      {yAxisLabels.map((label, index) => (
        (label.value !== '0%' || index === 0) && (label.value !== '100%' || index === NUM_Y_AXIS_LABELS) && (
          <Line
            key={`h-grid-${index}`}
            x1={chartPadding}
            y1={label.y}
            x2={chartPadding + chartUsableWidth}
            y2={label.y}
            stroke={STYLE_CONSTANTS.GRID_STROKE_COLOR}
            strokeDasharray={STYLE_CONSTANTS.GRID_STROKE_DASHARRAY}
          />
        )
      ))}
        {/* Vertical Grid lines based on X-axis labels */}
        {xAxisLabels.map((label, index) => (
          (index > 0 && index < NUM_X_AXIS_LABELS) && (
            <Line
              key={`v-grid-${index}`}
              x1={label.x}
              y1={chartPadding}
              x2={label.x}
              y2={chartPadding + chartUsableHeight}
              stroke={STYLE_CONSTANTS.GRID_STROKE_COLOR}
              strokeDasharray={STYLE_CONSTANTS.GRID_STROKE_DASHARRAY}
            />
          )
        ))}
      </>
    );
  }

  // Sub-component for X-Axis
  function XAxis() {
    return (
      <>
        <Line
          x1={chartPadding}
        y1={chartHeight - chartPadding}
        x2={chartPadding + chartUsableWidth}
        y2={chartHeight - chartPadding}
        stroke={STYLE_CONSTANTS.TEXT_COLOR}
        strokeWidth={STYLE_CONSTANTS.AXIS_STROKE_WIDTH}
      />
      {xAxisLabels.map((label, index) => (
        <SvgText
          key={`x-label-${index}`}
          x={label.x}
          y={label.y}
          fontSize={STYLE_CONSTANTS.LABEL_FONT_SIZE_LARGE}
          fill={STYLE_CONSTANTS.TEXT_COLOR}
          textAnchor="middle"
        >
          {label.value}
        </SvgText>
      ))}
      <SvgText
        x={chartPadding + chartUsableWidth / 2}
        y={chartHeight - chartPadding + STYLE_CONSTANTS.X_AXIS_TITLE_Y_OFFSET}
        fontSize={STYLE_CONSTANTS.LABEL_FONT_SIZE_MEDIUM}
        fill={STYLE_CONSTANTS.TEXT_COLOR}
        textAnchor="middle"
      >
          {xAxisLabel}
        </SvgText>
      </>
    );
  }

  // Sub-component for Y-Axis
  function YAxis() {
    return (
      <>
        <Line
          x1={chartPadding}
        y1={chartPadding}
        x2={chartPadding}
        y2={chartHeight - chartPadding}
        stroke={STYLE_CONSTANTS.TEXT_COLOR}
        strokeWidth={STYLE_CONSTANTS.AXIS_STROKE_WIDTH}
      />
      {yAxisLabels.map((label, index) => (
        <SvgText
          key={`y-label-${index}`}
          x={label.x}
          y={label.y}
          fontSize={STYLE_CONSTANTS.LABEL_FONT_SIZE_SMALL}
          fill={STYLE_CONSTANTS.TEXT_COLOR}
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {label.value}
        </SvgText>
      ))}
      <SvgText
        x={chartPadding + STYLE_CONSTANTS.Y_AXIS_TITLE_X_OFFSET_ROTATED}
        y={chartPadding + chartUsableHeight / 2}
        fontSize={STYLE_CONSTANTS.LABEL_FONT_SIZE_MEDIUM}
        fill={STYLE_CONSTANTS.TEXT_COLOR}
        textAnchor="middle"
        transform={`rotate(-90, ${chartPadding + STYLE_CONSTANTS.Y_AXIS_TITLE_X_OFFSET_ROTATED}, ${chartPadding + chartUsableHeight / 2})`}
      >
          Probability (%)
        </SvgText>
      </>
    );
  }

  // Sub-component for Probability Curve
  function ProbabilityCurve() {
    if (!pathData) {
      return null;
    }
    return (
      <Path
        d={pathData}
        stroke={STYLE_CONSTANTS.CURVE_STROKE_COLOR}
        strokeWidth={STYLE_CONSTANTS.CURVE_STROKE_WIDTH}
        fill="none"
      />
    );
  }

  // Sub-component for Highlighted Point
  function HighlightedPointMarker() {
    if (!highlightPoint || !Number.isFinite(highlightPoint.x) || !Number.isFinite(highlightPoint.y)) {
      return null;
    }
    const { xPos, yPos } = convertDataPointToSvgPoint(highlightPoint);
    return (
      <Circle
        cx={xPos}
        cy={yPos}
        r={STYLE_CONSTANTS.HIGHLIGHT_POINT_RADIUS.toString()}
        fill={STYLE_CONSTANTS.HIGHLIGHT_POINT_FILL_COLOR}
      />
    );
  }

  return (
    <Svg height={chartHeight} width={propScreenWidth} viewBox={`0 0 ${propScreenWidth} ${chartHeight}`}>
      <GridLines />
      <XAxis />
      <YAxis />
      <ProbabilityCurve />
      <HighlightedPointMarker />
    </Svg>
  );
}
