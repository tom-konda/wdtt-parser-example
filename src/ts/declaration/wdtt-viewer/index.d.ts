export interface TrainsColumns {
  directionTrainIndex: number
  serviceType: number;
  trainID: string;
  trainServiceName: string;
  trainServiceNumber: number | null;
  departureTime: string;
  departureHour: number;
  departureMinute: string;
  destination: number;
  operationDatePattern: number;
  direction: number;
}

export type wdttState = undefined | workerOutput

export type timetableState = {
  timetable?: workerOutput,
  dbWorker: Worker,
  direction: string,
  day: string,
  otherConditions: {
    extra: boolean,
    seasonal: boolean,
    irregular: boolean,
  }
  qualifiedTrains: {
    trains: TrainsColumns[],
    hourTrainsCount: Map<number, number>,
  }
}

export type workerOutput = wdttDefaultJSON

export type directionTrainHours = {minHour: number, maxHour: number}

export type TrainHours<K> = {K : {minHour: number, maxHour: number}}