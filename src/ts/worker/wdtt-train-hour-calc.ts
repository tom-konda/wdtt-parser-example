self.addEventListener(
  'message',
  async(event: MessageEvent) => {
    const MIN_DEPARTURE_HOUR = 3;
    const trainData = event.data as trainData[];
    let minHour = 26;
    let maxHour = MIN_DEPARTURE_HOUR;
    trainData.forEach(
      (train) => {
        const {departureTime} = train;
        let departureHour = Number(departureTime.padStart(4, '0').slice(0, 2));
        if (departureHour >= MIN_DEPARTURE_HOUR) {
          if (departureHour < minHour) {
            minHour = departureHour;
          }
          else if (departureHour > maxHour) {
            maxHour = departureHour;
          }
        }
        else {
          departureHour += 24;
          if (departureHour < minHour) {
            minHour = departureHour;
          }
          else if (departureHour > maxHour) {
            maxHour = departureHour;
          }
        }
      }
    );
    postMessage({minHour, maxHour});
  }
)