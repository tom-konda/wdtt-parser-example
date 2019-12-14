export const calcTableWidth = (timetable: timetable, hourTrains: Map<number, number>) => {
  const {header, trainsPerHour, cell, orientation} = timetable;
  const {width: cellWidth} = cell;
  let widthSum = 0;
  if (orientation === 0) {
    widthSum += getPortraitTableFirstColumnWidth(header.hourFontStyle);
    widthSum += cell.width * trainsPerHour;
  }
  else {
    for (const [, trainsCount] of hourTrains) {
      widthSum += cellWidth * Math.ceil(trainsCount / trainsPerHour);
    }
  }
  return widthSum;
}

export const getPortraitTableFirstColumnWidth = (hourFontStyle: fontStyle) => {
  const {isBold, isItalic, fontFamily, fontSize} = hourFontStyle
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const boldFormat = isBold ? 'bold' : '';
  const italicFormat = isItalic ? 'italic' : '';
  context.font = `${boldFormat} ${italicFormat} ${fontSize}px ${fontFamily}`;
  return context.measureText('23').width
}

export const calcGridRepeat = (size: number, repeatUnits: number[][]) => {
  const repeat = repeatUnits.map(
    (unit) => {
      const actualSize = size * unit[0];
      if (unit[1] === 1) {
        return `${actualSize}px`
      }
      else {
        return `repeat(${unit[1]}, ${actualSize}px)`
      }
    }
  ).join(' ')
  return repeat
}

export const getRepeatUnits = (trainHours: Map<number, number>, trainsPerHour: number) => {
  let prevHourSize = 0;
  let repeatUnits = [];
  for (const [, trainCount] of trainHours.entries()) {
    const demandSize = Math.ceil(trainCount / trainsPerHour);
    if (prevHourSize !== demandSize) {
      prevHourSize = demandSize;
      repeatUnits.push([demandSize, 1])
    }
    else {
      repeatUnits[repeatUnits.length - 1][1]++;
    }
  }
  return repeatUnits;
}