import * as React from "react";
import styled from "@emotion/styled";
import { FC, Fragment } from "react";

const LandscapeTableHeaderBase:FC<{className?: string, timetable: timetable, trainHours: Map<number, number>, direction: string, day: string}> = ({className, timetable, trainHours, direction, day}) => {
  const {header, cell, trainsPerHour} = timetable;
  return <section className={className}>
    <LandscapeTableCaption header={header} direction={direction} day={day} trainHours={trainHours} />
    <LandscapeTableHourCells header={header} cellWidth={cell.width} day={day} trainHours={trainHours} trainsPerHour={trainsPerHour} />
  </section>
}

export const LandscapeTableHeader = styled(LandscapeTableHeaderBase)`
  grid-area: 'head';
  display: grid;
  box-sizing: border-box;
`

const getTableHeaderText = (direction: string, header: Pick<timetable, 'header'>['header']) => {
  if (direction === '0') {
    return header.outboundTitle;
  }
  else if (direction === '1') {
    return header.inboundTitle;
  }
  return '';
}

export const LandscapeTableCaption: FC<{header: Pick<timetable, 'header'>['header'], direction: string, day: string, trainHours: Map<number, number>, className?: string}> = ({header, direction, day, trainHours}) => {
  const colors = {
    background: header[`${day}Background` as keyof Pick<timetable, 'header'>['header']],
    color: header[`${day}Color` as keyof Pick<timetable, 'header'>['header']]
  }
  const LandscapeTableCaptionSection = styled(TableHeaderCaptionWrapper)`
    background: ${colors.background};
    color: ${colors.color};
    grid-row: 1;
    grid-column: 1 / calc(1 + ${trainHours.size});
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    border-top: solid 1px black;
    border-left: solid 1px black;
    box-sizing: border-box;
    height: ${Math.ceil(header.directionFontStyle.fontSize * 4 / 3)}px;
    line-height: 133.333333%;
  `
  return <LandscapeTableCaptionSection className="timetable__caption">{getTableHeaderText(direction, header)}</LandscapeTableCaptionSection>
}

export const LandscapeTableHourCells: FC<{header: Pick<timetable, 'header'>['header'], cellWidth: number, trainHours: Map<number, number>, day: string, trainsPerHour: number}> = ({header, cellWidth, day, trainHours, trainsPerHour}) => {
  let counter = 0;
  const cells: JSX.Element[] = [];
  const colors = {
    background: header[`${day}Background` as keyof Pick<timetable, 'header'>['header']],
    color: header[`${day}Color` as keyof Pick<timetable, 'header'>['header']]
  }
  for (const [hour, trainsCount] of trainHours) {
    const actualHour = hour >= 24 ? hour - 24 : hour;

    const demandWidth = Math.ceil(trainsCount / trainsPerHour);
    const Cell = styled(TableHourCellWrapperBase)`
      font-family: ${header.hourFontStyle.fontFamily};
      font-size: ${header.hourFontStyle.fontSize}px;
      font-style: ${header.hourFontStyle.isItalic ? 'oblique' : 'normal'};
      font-weight: ${header.hourFontStyle.isBold ? 'bold' : 'normal'};
      border-left: 1px solid ${counter ? colors.color : 'black'};
      border-top: 1px solid ${colors.color};
      width: ${cellWidth * demandWidth}px;
      background: ${colors.background};
      color: ${colors.color};
      box-sizing: border-box;
      line-height: 166.666666%;
      height: ${Math.floor(header.hourFontStyle.fontSize * 5 / 3)}px;
      text-align: center;
    `
    cells.push(<Cell key={`hour-${actualHour}`} >{actualHour}</Cell>);
    counter++;
  }
  return <Fragment>{cells}</Fragment>
}

const PortraitTableHeaderBase:FC<{timetable: timetable, direction: string, day: string}> = ({timetable, direction, day}) => {
  const {header} = timetable;
  const colors = {
    background: header[`${day}Background` as keyof Pick<timetable, 'header'>['header']],
    color: header[`${day}Color` as keyof Pick<timetable, 'header'>['header']]
  }

  const HourText = styled(({className}) => <div className={className}>時</div>)`
    grid-row: 1;
    grid-column: 1;
    background: ${colors.background};
    color: ${colors.color};
    border-top: solid 1px black;
    border-left: solid 1px black;
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    line-height: 133.333333%;
    grid-area: 'hour-text';
  `

  const PortraitTableCaptionSection = styled(TableHeaderCaptionWrapper)`
    background: ${colors.background};
    color: ${colors.color};
    grid-area: 'header';
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    border-top: solid 1px black;
    border-left: solid 1px ${colors.color};
    box-sizing: border-box;
    height: ${Math.ceil(header.directionFontStyle.fontSize * 4 / 3)}px;
    line-height: 133.333333%;
  `
  return <Fragment>
    <HourText />
    <PortraitTableCaptionSection className="timetable__caption">{getTableHeaderText(direction, header)}</PortraitTableCaptionSection>
  </Fragment>
}

export const PortraitTableHeader = styled(PortraitTableHeaderBase)`
  grid-area: 'head';
  grid-row: 1;
`

const PortraitTableHoursColumnBase: FC<{className?: string, header: Pick<timetable, 'header'>['header'], trainHours: Map<number, number>, day: string, trainsPerHour: number, cellHeight: number}> = ({className, header, trainHours, day, trainsPerHour, cellHeight}) => {
  const cells: JSX.Element[] = [];
  const colors = {
    background: header[`${day}Background` as keyof Pick<timetable, 'header'>['header']],
    color: header[`${day}Color` as keyof Pick<timetable, 'header'>['header']]
  }
  for (const [hour, trainsCount] of trainHours) {
    const actualHour = hour >= 24 ? hour - 24 : hour;

    const demandHeight = Math.ceil(trainsCount / trainsPerHour);
    const Cell = styled(TableHourCellWrapperBase)`
      font-family: ${header.hourFontStyle.fontFamily};
      font-size: ${header.hourFontStyle.fontSize}px;
      font-style: ${header.hourFontStyle.isItalic ? 'oblique' : 'normal'};
      font-weight: ${header.hourFontStyle.isBold ? 'bold' : 'normal'};
      border-left: 1px solid black;
      border-top: 1px solid ${colors.color};
      background: ${colors.background};
      color: ${colors.color};
      box-sizing: border-box;
      line-height: 166.666666%;
      height: ${cellHeight * demandHeight}px;
      text-align: center;
    `
    cells.push(<Cell key={`hour-${actualHour}`} >{actualHour}</Cell>);
  }
  return <div className={className}>{cells}</div>
}

export const PortraitTableHoursColumn = styled(PortraitTableHoursColumnBase)`
  grid-area: 'hour-col';
`

const TableHeaderCaptionWrapper: FC<{className?:string}> = ({className, children}) => {
  return <div className={className}>{children}</div>
}

const TableHourCellWrapperBase: FC<{className?: string, key: string}> = ({key, className, children}) => {
  return <div key={key} className={className}>{children}</div>
}

