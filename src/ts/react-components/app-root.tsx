import * as React from "react";
import { createContext, useReducer, Dispatch, useContext, useEffect } from 'react';
import * as ReactDOM from "react-dom";
import timetableReducer from './reducers/timetable-reducers';
import { timetableState, workerOutput } from "../declaration/wdtt-viewer";
import {WdttViewer} from "./wdtt-viewer";

const WDTTContext = createContext<timetableState>(undefined as any);
const DispatchContext = createContext<Dispatch<any>>(null as any);
const dexieWorker = new Worker('./js/worker/dexie.js');

const App = () => {
  useEffect(() => {
    dbWorkerHandler(dexieWorker, { type: 'init' })
  }, []);
  const defaultState = {
    timetable: undefined,
    direction: '0',
    day: 'weekday',
    dbWorker: dexieWorker,
    otherConditions: {
      extra: false,
      seasonal: false,
      irregular: false,
    },
    qualifiedTrains: {
      trains: [],
      hourTrainsCount: new Map(),
    }
  }
  const [state, dispatch] = useReducer(timetableReducer, defaultState);
  return (
    <WDTTContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Layout />
      </DispatchContext.Provider>
    </WDTTContext.Provider>
  );
}

const Layout: React.FC<{}> = () => {
  const state = useContext(WDTTContext);
  const dispatch = useContext(DispatchContext);

  const setWdttEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file && file[0]) {
      try {
        const { wdtt, trains } = await wdttFileWorkerHandler(file[0]) as any;
        await dbWorkerHandler(state.dbWorker, { type: 'load', trains });
        const qualifiedTrains = await dbWorkerHandler(
          state.dbWorker,
          {
            type: 'search',
            condition: {
              direction: state.direction,
              day: state.day,
              otherConditions: state.otherConditions
            }
          }
        )
        dispatch({ type: 'wdttChange', wdtt, qualifiedTrains })
      }
      catch (e) {
        console.error(e);
      }
    }
  }
  console.log(state, 'ステート')

  const selectFormTrainCondition = async (event: React.ChangeEvent<HTMLSelectElement>, form: string) => {
    let qualifiedTrains: unknown
    switch (form) {
      case 'direction':
        qualifiedTrains = await dbWorkerHandler(
          state.dbWorker,
          {
            type: 'search',
            condition: {
              direction: event.target.value,
              day: state.day,
              otherConditions: state.otherConditions,
            }
          }
        );
        dispatch({ type: 'changeDirection', direction: event.target.value , qualifiedTrains})
        break;
      case 'day':
        qualifiedTrains = await dbWorkerHandler(
          state.dbWorker,
          {
            type: 'search',
            condition: {
              direction: state.direction,
              day: event.target.value,
              otherConditions: state.otherConditions,
            }
          }
        );
        dispatch({ type: 'changeDay', day: event.target.value, qualifiedTrains })
        break;
    }
  }

  const inputFormTrainCondition = async (event: React.ChangeEvent<HTMLInputElement>, form: string) => {
    switch (form) {
      case 'extra':
      case 'seasonal':
      case 'irregular':
        const changedCondition: {[key: string] : boolean} | [] = {};
        changedCondition[form] = event.target.checked;
        const nextOtherConditions = {...state.otherConditions, ...changedCondition};
        const qualifiedTrains = await dbWorkerHandler(
          state.dbWorker,
          {
            type: 'search',
            condition: {
              direction: state.direction,
              day: state.day,
              otherConditions: nextOtherConditions
            }
          }
        );
        dispatch({type: 'changeBooleanCondition', otherConditions: nextOtherConditions, qualifiedTrains})
        break;
    }
  }

  return <section>
    <section>
      <input type="file" onChange={setWdttEvent} />
      <fieldset>
        <legend>表示条件</legend>
        <label>方向</label>
        <select disabled={!state.timetable} defaultValue={state.direction} onChange={
          (event) => {
            event.persist();
            selectFormTrainCondition(event, 'direction')
          }
        }>
          <option value="0">下り</option>
          <option value="1">上り</option>
        </select>
        <label>表示日</label>
        <select disabled={!state.timetable} defaultValue={state.day} onChange={
          (event) => {
            event.persist();
            selectFormTrainCondition(event, 'day')
          }
        }>
          <option value="weekday">平日</option>
          <option value="saturday">土曜</option>
          <option value="holiday">祝日</option>
        </select>
        <fieldset>
          <legend>不定期便</legend>
          <label>臨時列車</label>
          <input type="checkbox" disabled={!state.timetable} onChange={
            (event) => {
              event.persist();
              inputFormTrainCondition(event, 'extra')
            }
          } />
          <label>季節列車</label>
          <input type="checkbox" disabled={!state.timetable} onChange={
            (event) => {
              event.persist();
              inputFormTrainCondition(event, 'seasonal')
            }
          } />
          <label>不定期列車</label>
          <input type="checkbox" disabled={!state.timetable} onChange={
            (event) => {
              event.persist();
              inputFormTrainCondition(event, 'irregular')
            }
          } />
        </fieldset>
      </fieldset>
    </section>

    <WdttViewer wdtt={state.timetable} direction={state.direction} day={state.day} qualifiedTrains={state.qualifiedTrains} />
  </section>
}

const wdttFileWorkerHandler = (file: File) => {
  const wdttWorker = new Worker('./js/worker/wdtt-worker.js');
  wdttWorker.postMessage({ file });

  return new Promise(
    (resolve, reject) => {
      wdttWorker.addEventListener(
        'message',
        (event) => {
          const result = event.data as workerOutput;
          resolve(result);
        }
      );
      wdttWorker.addEventListener(
        'error',
        (event) => {
          reject(event.message);
        }
      );
    }
  );
}

const dbWorkerHandler = (dbWorker: Worker, data: unknown) => {
  return new Promise(
    (resolve, reject) => {
      dbWorker.addEventListener(
        'message',
        (event) => {
          const result = event.data;
          resolve(result);
        },
        { once: true }
      );
      dbWorker.addEventListener(
        'error',
        (event) => {
          reject(event.message);
        },
        { once: true }
      );
      dbWorker.postMessage(data);
    }
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#AppRoot')
)