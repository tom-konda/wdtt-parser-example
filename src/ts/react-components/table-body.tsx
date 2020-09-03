import * as React from "react";
import styled from "@emotion/styled";
import { FC, Fragment } from "react";
import { TableRemarks } from "./table-remarks";
import { calcGridRepeat, getRepeatUnits } from "./lib/table-calc";
import { TrainsColumns } from "../declaration/wdtt-viewer";

const LandscapeTableBodyBase: FC<{className?:string, timetable: timetable, remarks: remarks, destinations: destination[], trainServices: trainService[], trainHours: Map<number, number>, direction: string, trains: TrainsColumns[]}> = ({className, timetable, remarks, destinations, trainServices, trainHours, direction, trains}) => {
  const {cell, trainsPerHour} = timetable;
  return <section className={className}>
    <LandscapeTableBodyCells cell={cell} trainHours={trainHours} destinations={destinations} trainServices={trainServices} trainsPerHour={trainsPerHour} trains={trains} />
    <TableRemarks remarks={remarks} direction={direction} />
  </section>
}

export const LandscapeTableBody = styled(LandscapeTableBodyBase)`
  grid-area: 'body';
  display: grid;
  position: relative;
  grid-template-rows: ${({timetable}) => timetable.cell.height * timetable.trainsPerHour}px;
  grid-template-columns: ${({timetable, trainHours}) => calcGridRepeat(timetable.cell.width, getRepeatUnits(trainHours, timetable.trainsPerHour))};
`;

const TableBodyCellWrapperBase: FC<{className?: string}> = ({className, children}) => {
  return <div className={className}>{children}</div>
}

const LandscapeTableBodyCells: FC<{cell: cell, destinations: destination[], trainServices: trainService[], trainHours: Map<number, number>, trainsPerHour: number, trains: TrainsColumns[]}> = ({cell, destinations, trainServices, trainHours, trainsPerHour, trains}) => {
  const {width, height} = cell;
  const bodyCells: JSX.Element[] = [];
  let lastTrainIndex = 0;
  const bodyCellHeight = height * trainsPerHour;
  for (const [hour, trainsCount] of trainHours) {
    const demandWidth = Math.ceil(trainsCount / trainsPerHour);
    const {hourTrains, nextLastTrainIndex} = getHourTrains(hour, trains, lastTrainIndex, cell, destinations, trainServices);
    const Cell = styled(TableBodyCellWrapperBase)`
      border-left: 1px solid black;
      border-top: 1px solid black;
      width: ${width * demandWidth}px;
      text-align: 'center';
      background: white;
      box-sizing: border-box;
      height: ${bodyCellHeight}px;
      display: grid;
      grid-template-rows: repeat(${trainsPerHour}, ${height}px);
      grid-template-columns: repeat(${demandWidth}, ${width}px);
      grid-auto-flow: column;
    `
    bodyCells.push(<Cell key={`body-${hour}`} >{hourTrains}</Cell>);
    lastTrainIndex = nextLastTrainIndex;
  }
  return <Fragment>{bodyCells}</Fragment>
}
const PortraitTableBodyBase: FC<{className?:string, timetable: timetable, remarks: remarks, destinations: destination[], trainServices: trainService[], trainHours: Map<number, number>, direction: string, trains: TrainsColumns[]}> = ({className, timetable, remarks: remark, destinations, trainServices, trainHours, direction, trains}) => {
  const {cell, trainsPerHour} = timetable;
  return <section className={className}>
    <PortraitTableBodyCells cell={cell} trainHours={trainHours} destinations={destinations} trainServices={trainServices} trainsPerHour={trainsPerHour} trains={trains} />
    <TableRemarks remarks={remark} direction={direction} />
  </section>
}
export const PortraitTableBody = styled(PortraitTableBodyBase)`
  grid-area: 'body';
  display: grid;
  position: relative;
  grid-template-rows: ${({timetable, trainHours}) => calcGridRepeat(timetable.cell.height, getRepeatUnits(trainHours, timetable.trainsPerHour))};
  grid-template-columns: ${({timetable}) => timetable.cell.width * timetable.trainsPerHour}px;
`;

const PortraitTableBodyCells: FC<{cell: cell, destinations: destination[], trainServices: trainService[], trainHours: Map<number, number>, trainsPerHour: number, trains: TrainsColumns[]}> = ({cell, destinations, trainServices, trainHours, trainsPerHour, trains}) => {
  const {width, height} = cell;
  const bodyCells: JSX.Element[] = [];
  let lastTrainIndex = 0;
  const bodyCellWidth = width * trainsPerHour;
  for (const [hour, trainsCount] of trainHours) {
    const demandHeight = Math.ceil(trainsCount / trainsPerHour);
    const {hourTrains, nextLastTrainIndex} = getHourTrains(hour, trains, lastTrainIndex, cell, destinations, trainServices);
    const Cell = styled(TableBodyCellWrapperBase)`
      border-left: 1px solid black;
      border-top: 1px solid black;
      height: ${height * demandHeight}px;
      text-align: 'center';
      background: white;
      box-sizing: border-box;
      width: ${bodyCellWidth}px;
      display: grid;
      grid-template-rows: repeat(${demandHeight}, ${height}px);
      grid-template-columns: repeat(${trainsPerHour}, ${width}px);
    `
    bodyCells.push(<Cell key={`body-${hour}`} >{hourTrains}</Cell>);
    lastTrainIndex = nextLastTrainIndex;
  }
  return <Fragment>{bodyCells}</Fragment>
}

const getHourTrains = (hour: number, trains: TrainsColumns[], lastTrainIndex: number, cell: cell, destinations: destination[], trainServices: trainService[]) => {
  let index = lastTrainIndex;
  const hourTrains: JSX.Element[] = [];
  const {time, destination: cellDestination, service} = cell;
  for (; index < trains.length && hour === trains[index].departureHour; index++) {
    const train = trains[index];
    const {departureMinute, destination, serviceType} = train;
    const currentService = trainServices[serviceType];
    const TrainCell = styled(TrainCellBase)`
      position: relative;
    `
    const Minute = styled(CellTextBase)`
      color: ${currentService.timetableColor};
      font-family: ${time.fontFamily};
      font-size: ${time.fontSize}px;
      font-style: ${time.isItalic ? 'oblique' : 'normal'};
      font-weight: ${time.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${time.y}px;
      left: ${time.x}px;
    `
    const Destination = styled(CellTextBase)`
      color: ${currentService.timetableColor};
      font-family: "${cellDestination.fontFamily}";
      font-size: ${cellDestination.fontSize}px;
      font-style: ${cellDestination.isItalic ? 'oblique' : 'normal'};
      font-weight: ${cellDestination.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${cellDestination.y}px;
      left: ${cellDestination.x}px;
    `
    const TrainService = styled(CellTextBase)`
      color: ${currentService.timetableColor};
      font-family: "${service.fontFamily}";
      font-size: ${service.fontSize}px;
      font-style: ${service.isItalic ? 'oblique' : 'normal'};
      font-weight: ${service.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${service.y}px;
      left: ${service.x}px;
    `

    hourTrains.push(
      <TrainCell className="timetable__train" key={`${hour}-${departureMinute}-${serviceType}-${destination}`}>
        <Minute>{departureMinute}</Minute>
        {cellDestination.display ? <Destination>{destinations[destination].displayText}</Destination> : undefined}
        {service.display ? <TrainService>{currentService.serviceAbbr}</TrainService> : undefined}
      </TrainCell>
    );
  }
  return {nextLastTrainIndex: index, hourTrains}
}

const TrainCellBase:FC<{className ?: string}> = ({className, children}) => {
  return <div className={className}>{children}</div>
}

const CellTextBase:FC<{className ?: string}> = ({className, children}) => {
  return <span className={className}>{children}</span>
}