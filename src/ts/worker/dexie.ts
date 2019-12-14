import Dexie from 'dexie';

class WdttFileDatabase extends Dexie {
          
  trains: Dexie.Table<TrainsColumns, number>;

  constructor() {
    super('WdttViewerDatabase');
    this.version(1).stores({
      trains: '&[direction+directionTrainIndex], direction',
    });
  }
}

let db: WdttFileDatabase;

self.addEventListener(
  'message', async (event: MessageEvent) => {
    const {type} = event.data;
    try {
      switch (type) {
        case 'init':
          db = new WdttFileDatabase();
          await db.trains.clear();
          postMessage('Successfully upgraded db');
        break;
        case 'load':
          await db.trains.clear();
          const {trains} = event.data;
          console.log(trains)
          db.trains.bulkAdd(trains);
          postMessage('Successfully added to db');
        break;
        case 'search':
          const {direction, day, otherConditions} = event.data.condition;
          let operationDatePattern:number[] = [];
          switch (day) {
            case 'weekday':
              operationDatePattern = [0, 2, 4, 6];
              break;
            case 'saturday':
              operationDatePattern = [0, 2, 3, 5];
              break;
            case 'holiday':
              operationDatePattern = [0, 1, 3, 6];
              break;
          }
          const {extra, seasonal, irregular} = otherConditions;
          if (extra) {
            operationDatePattern.push(7)
          }
          if (seasonal) {
            operationDatePattern.push(8)
          }
          if (irregular) {
            operationDatePattern.push(9)
          }
          const resultArray = await db.trains.where('direction').equals(Number(direction)).and(
            (x) => {
              return operationDatePattern.includes(x.operationDate)
            }
          ).toArray();
          let qualifiedTrains: TrainsColumns[] = [];
          // let hourTrainsCount: {[key: number] : number} = [];
          let hourTrainsCount = new Map();
          resultArray.forEach(
            (obj) => {
              qualifiedTrains.push(obj);
              const {departureHour} = obj;
              // hourTrainsCount[departureHour] = hourTrainsCount[departureHour] ? ++hourTrainsCount[departureHour] : 1;
              hourTrainsCount.has(departureHour) ?
                hourTrainsCount.set(departureHour, hourTrainsCount.get(departureHour) + 1) :
                hourTrainsCount.set(departureHour, 1);
            }
          )
          console.log(qualifiedTrains, '更新された')
          postMessage({trains: qualifiedTrains, hourTrainsCount});
        break;
        default:
          throw('Undefined type.');
      }
    } catch (error) {
      console.error(error, 'エラー')
      close();
    }
  }
)


self.addEventListener(
  'error',
  (event) => {
    console.error(event, 'エラーイベント引数')
    close();
  }
);