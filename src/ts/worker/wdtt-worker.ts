import {wdttParse} from '@tom-konda/wdtt-parser';

self.addEventListener(
  'message',
  async(event: MessageEvent) => {
    const {file} = event.data as {file : File};
    try {
      const loadResult = await fileHandler(file);
      const wdtt = wdttParse(loadResult);
      const {inboundTrains, outboundTrains} = wdtt;
      const trains = await addColumnsToAllTrains(inboundTrains, outboundTrains);
      // const [inboundHours, outboundHours] = await trainHourCalc(inboundTrains, outboundTrains);
      postMessage({wdtt, trains});
      close();
    }
    catch(error) {
      console.error(error, 'パースエラー');
      close()
    }
  }
)


const fileHandler = (file: File) => {
  try {
    const reader = new FileReader();
    reader.readAsText(file, 'shift_jis');
    return new Promise(
      (resolve, reject) => {

        reader.addEventListener(
          'load',
          () => {
            reader.result ? resolve(reader.result as string) : reject('Load failure.');
          }
        )
        reader.addEventListener(
          'error',
          () => {
            reject('Load error.')
          }
        )
      }
    ) as Promise<string>
  }
  catch (error) {
    console.error(error, 'File load error')
    throw(error);
  }
}

// const trainHourCalc = (inboundTrains: trainData[], outboundTrains: trainData[]) => {
//   return Promise.all(
//     [
//       workerHandler(inboundTrains),
//       workerHandler(outboundTrains),
//     ]
//   );
// }

const addColumnsToAllTrains = async(inboundTrains: trainData[], outboundTrains: trainData[]) => {
  const trains = await Promise.all(
    [
      addColumnsToDirectionTrains(0, outboundTrains),
      addColumnsToDirectionTrains(1, inboundTrains)
    ]
  );
  return [...trains[0], ...trains[1]]
}

const addColumnsToDirectionTrains = (direction: number, directionTrains: trainData[]) => {
  const directionObject = {direction}
  const MIN_DEPARTURE_HOUR = 3;
  return directionTrains.map(
    (directionTrain, directionTrainIndex) => {
      let departureHour = Number(directionTrain.departureTime.padStart(4, '0').substring(0, 2));
      departureHour = departureHour >= MIN_DEPARTURE_HOUR ? departureHour : departureHour + 24;
      const departureMinute = directionTrain.departureTime.slice(-2);
      return {
        ...directionObject,
        ...directionTrain,
        ...{directionTrainIndex},
        ...{departureHour, departureMinute}
      } as TrainsColumns
    }
  )
}
