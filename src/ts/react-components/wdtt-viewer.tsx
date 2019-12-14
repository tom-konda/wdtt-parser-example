import * as React from "react";
import { workerOutput, TrainsColumns } from "../declaration/wdtt-viewer";
import { WdttMainTitle, WdttSubTitleSection } from "./wdtt-title";
import { timeTableTable as getTimetable } from "./timetable";
import { calcTableWidth } from "./lib/table-calc";
import styled from "@emotion/styled";

const WdttViewerBase : React.FC<{className?:string, wdtt?: workerOutput, direction: string, day: string, qualifiedTrains: {
  trains: TrainsColumns[];
  hourTrainsCount: Map<number, number>;
}}> = ({className, wdtt, direction, day, qualifiedTrains}) => {
  if (wdtt && qualifiedTrains.trains.length) {
    const {timetable} = wdtt;
    const {mainTitle, subtitles, color} = timetable.titles;

    const tableWidth = calcTableWidth(timetable, qualifiedTrains.hourTrainsCount);
    const {hourTrainsCount, trains} = qualifiedTrains;

    const Timetable = getTimetable(wdtt, direction, day, hourTrainsCount, trains);

    return <section className={`wdtt-viewer ${className}`}>
      <WdttMainTitle className="wdtt-viewer__title" color={color} mainTitle={mainTitle} width={tableWidth} />
      <WdttSubTitleSection className="wdtt-viewer__subtitle" color={color} title={subtitles} width={tableWidth} />
      <Timetable />
    </section>
  }
  else {
    return <section className={className}>データがありません</section>
  }
}

export const WdttViewer = styled(WdttViewerBase)`
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
`;