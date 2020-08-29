import * as React from 'react';
import { useReducer, useEffect } from 'react';
import { render } from 'react-dom';
import timetableReducer from './reducers/timetable-reducers';
import {WdttViewer} from "./wdtt-viewer";
import { Form } from './form';
import { WDTTContext, DispatchContext } from './contexts/app-contexts';
import { dbWorkerHandler } from './lib/db-worker-handler';
import { wdttFileWorkerHandler } from './lib/wdtt-file-worker-handler';

const dexieWorker = new Worker('./js/worker/dexie.js');

// const initialize = () => {

//   const defaultState = {
//     timetable: undefined,
//     direction: '0',
//     day: 'weekday',
//     dbWorker: dexieWorker,
//     otherConditions: {
//       extra: false,
//       seasonal: false,
//       irregular: false,
//     },
//     qualifiedTrains: {
//       trains: [],
//       hourTrainsCount: new Map(),
//     }
//   };
//   const [state, dispatch] = useReducer(timetableReducer, defaultState);
//   // let timetable = undefined;
//   // let qualifiedTrains = {
//   //   trains: [],
//   //   hourTrainsCount: new Map(),
//   // } as unknown

//   useEffect(() => {
//     const fileLoad = async() => {
//       const request = await fetch('./fixtures/test2.wtt');
//       const wdttBlob = await request.blob();
//       const { wdtt, trains } = await wdttFileWorkerHandler(wdttBlob) as any;
//       // timetable = wdtt;

//       await dbWorkerHandler(dexieWorker, { type: 'load', trains });
//       const qualifiedTrains = await dbWorkerHandler(
//         dexieWorker,
//         {
//           type: 'search',
//           condition: {
//             direction: '0',
//             day: 'weekday',
//             otherConditions: {
//               extra: false,
//               seasonal: false,
//               irregular: false,
//             }
//           }
//         }
//       )
//       dispatch({ type: 'wdttChange', wdtt, qualifiedTrains })
//     }
//     dbWorkerHandler(dexieWorker, { type: 'init' });
//     fileLoad();

//   }, []);
//   return [state, dispatch];
// }

const App = () => {

  // const defaultState = {
  //   timetable,
  //   direction: '0',
  //   day: 'weekday',
  //   dbWorker: dexieWorker,
  //   otherConditions: {
  //     extra: false,
  //     seasonal: false,
  //     irregular: false,
  //   },
  //   qualifiedTrains
  // }


  // const defaultState = {
  //   timetable: undefined,
  //   direction: '0',
  //   day: 'weekday',
  //   dbWorker: dexieWorker,
  //   otherConditions: {
  //     extra: false,
  //     seasonal: false,
  //     irregular: false,
  //   },
  //   qualifiedTrains: {
  //     trains: [],
  //     hourTrainsCount: new Map(),
  //   }
  // };

  // const [state, dispatch] = useReducer(timetableReducer, defaultState);
  // const [state2, dispatch2] = initialize();


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
  };
  const [state, dispatch] = useReducer(timetableReducer, defaultState);
  // let timetable = undefined;
  // let qualifiedTrains = {
  //   trains: [],
  //   hourTrainsCount: new Map(),
  // } as unknown

  useEffect(() => {
    const fileLoad = async() => {
      const request = await fetch('./fixtures/test2.wtt');
      const wdttBlob = await request.blob();
      const { wdtt, trains } = await wdttFileWorkerHandler(wdttBlob) as any;
      // timetable = wdtt;

      await dbWorkerHandler(dexieWorker, { type: 'load', trains });
      const qualifiedTrains = await dbWorkerHandler(
        dexieWorker,
        {
          type: 'search',
          condition: {
            direction: '0',
            day: 'weekday',
            otherConditions: {
              extra: false,
              seasonal: false,
              irregular: false,
            }
          }
        }
      )
      dispatch({ type: 'wdttChange', wdtt, qualifiedTrains })
    }
    dbWorkerHandler(dexieWorker, { type: 'init' });
    fileLoad();

  }, []);

  return (
    <WDTTContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Form />
        <WdttViewer />
      </DispatchContext.Provider>
    </WDTTContext.Provider>
  );
}

render(
  <App />,
  document.querySelector('#AppRoot')
)