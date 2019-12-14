import { timetableState, workerOutput } from "../../declaration/wdtt-viewer";

const timetableReducer = (state: timetableState, action: any) => {
  switch (action.type) {
    case 'wdttChange': {
      const wdtt = action.wdtt as workerOutput;
      return {...state, ...{timetable: wdtt, qualifiedTrains: action.qualifiedTrains}}
    }
    case 'changeDirection': {
      return {...state, ...{direction: action.direction, qualifiedTrains: action.qualifiedTrains}}
    }
    case 'changeDay': {
      return {...state, ...{day: action.day, qualifiedTrains: action.qualifiedTrains}}
    }
    case 'changeBooleanCondition': {
      return {...state, ...{otherConditions: action.otherConditions, qualifiedTrains: action.qualifiedTrains}}
    }
    default: {
      return state;
    }
  }
}

export default timetableReducer;
