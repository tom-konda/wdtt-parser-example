import * as React from "react";
import styled from "@emotion/styled";
import {LandscapeTableHeader, PortraitTableHeader, PortraitTableHoursColumn} from "./table-header";
import { TrainsColumns, workerOutput } from "../declaration/wdtt-viewer";
import { LandscapeTableBody, PortraitTableBody } from "./table-body";
import { calcTableWidth, getPortraitTableFirstColumnWidth } from "./lib/table-calc";
import { FC } from "react";

const TableWrapper: FC<{className?:string}> = ({className, children}) => {
  return <section className={`timetable__table ${className}`}>{children}</section>
}

export const timeTableTable = (wdtt: workerOutput, direction: string, day: string, trainHours: Map<number, number>, trains: TrainsColumns[]) => {
  const {timetable, remarks, destinations, trainServices} = wdtt;
  const {header, trainsPerHour, cell, orientation} = timetable;

  if (orientation === 0) {
    const firstColumnWidth = getPortraitTableFirstColumnWidth(header.hourFontStyle);
    const PortraitTable: FC<{className?:string}> = ({className}) => {
      return <TableWrapper className={className}>
        <PortraitTableHeader timetable={timetable} direction={direction} day={day} />
        <PortraitTableHoursColumn header={timetable.header} trainHours={trainHours} day={day} trainsPerHour={trainsPerHour} cellHeight={timetable.cell.height} />
        <PortraitTableBody className="timetable__body" timetable={timetable} remarks={remarks} destinations={destinations} trainServices={trainServices} trainHours={trainHours} direction={direction} trains={trains}/>
      </TableWrapper>
    }
    return styled(PortraitTable)`
      line-height: 1;
      display:grid;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      grid-template-areas: 
        'hour-text header'
        'hour-col body';
      grid-template-rows: ${header.directionFontStyle.fontSize * 4 / 3}px;
      grid-template-columns: ${firstColumnWidth}px ${trainsPerHour * cell.width}px;
      width: ${firstColumnWidth + trainsPerHour * cell.width}px;
    `;
  }
  else {
    const LandscapeTable: FC<{className?:string}> = ({className}) => {
      return <TableWrapper className={className}>
        <LandscapeTableHeader className="timetable__header" timetable={timetable} trainHours={trainHours} direction={direction} day={day} />
        <LandscapeTableBody className="timetable__body" timetable={timetable} remarks={remarks} destinations={destinations} trainServices={trainServices} trainHours={trainHours} direction={direction} trains={trains}/>
      </TableWrapper>
    }
    const tableWidth = calcTableWidth(timetable, trainHours);
    return styled(LandscapeTable)`
      line-height: 1;
      display:grid;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      grid-template-areas: 
        'header'
        'body';
      grid-template-rows: ${header.directionFontStyle.fontSize * 4 / 3 + header.hourFontStyle.fontSize * 5 / 3}px ${trainsPerHour * cell.height}px;
      grid-template-columns: ${tableWidth}px;
      width: ${tableWidth}px;
    `;
  }
};
