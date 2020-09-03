(function (React, reactDom, styled) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

    const timetableReducer = (state, action) => {
        switch (action.type) {
            case 'wdttChange': {
                const wdtt = action.wdtt;
                return { ...state, ...{ timetable: wdtt, qualifiedTrains: action.qualifiedTrains } };
            }
            case 'changeDirection': {
                return { ...state, ...{ direction: action.direction, qualifiedTrains: action.qualifiedTrains } };
            }
            case 'changeDay': {
                return { ...state, ...{ day: action.day, qualifiedTrains: action.qualifiedTrains } };
            }
            case 'changeBooleanCondition': {
                return { ...state, ...{ otherConditions: action.otherConditions, qualifiedTrains: action.qualifiedTrains } };
            }
            default: {
                return state;
            }
        }
    };

    const WdttMainTitleBase = ({ className, mainTitle }) => {
        return React.createElement("h1", { className: className }, mainTitle.text);
    };
    const WdttMainTitle = styled__default['default'](WdttMainTitleBase) `
  text-align: center;
  color: ${props => props.color};
  font-size: ${props => props.mainTitle.fontSize}px;
  font-family: ${props => props.mainTitle.fontFamily};
  font-style: ${props => props.mainTitle.isItalic ? 'oblique' : 'normal'};
  font-weight: ${props => props.mainTitle.isBold ? 'bold' : 'normal'};
  width: ${props => props.width}px;
`;
    const TimetableSubTitleText = ({ className, index, title }) => {
        return React.createElement("h2", { className: className }, title.texts[index]);
    };
    const TimetableSubTitle = styled__default['default'](TimetableSubTitleText) `
  color: ${props => props.color};
  font-size: ${props => props.title.fontSize}px;
  font-family: ${props => props.title.fontFamily};
  font-style: ${props => props.title.isItalic ? 'oblique' : 'normal'};
  font-weight: ${props => props.title.isBold ? 'bold' : 'normal'};
`;
    const WdttSubTitleSectionWrapper = ({ className, children }) => {
        return React.createElement("section", { className: className }, children);
    };
    const WdttSubTitleSectionBase = ({ className, color, title }) => {
        return React.createElement(WdttSubTitleSectionWrapper, { className: className },
            React.createElement(TimetableSubTitle, { className: "timetable__modify-date", color: color, title: title, index: 1 }),
            React.createElement(TimetableSubTitle, { className: "timetable__supervisor", color: color, title: title, index: 0 }));
    };
    const WdttSubTitleSection = styled__default['default'](WdttSubTitleSectionBase) `
  display: flex;
  justify-content: space-between;
  width: ${props => props.width}px;
`;

    const LandscapeTableHeaderBase = ({ className, timetable, trainHours, direction, day }) => {
        const { header, cell, trainsPerHour } = timetable;
        return React.createElement("section", { className: className },
            React.createElement(LandscapeTableCaption, { header: header, direction: direction, day: day, trainHours: trainHours }),
            React.createElement(LandscapeTableHourCells, { header: header, cellWidth: cell.width, day: day, trainHours: trainHours, trainsPerHour: trainsPerHour }));
    };
    const LandscapeTableHeader = styled__default['default'](LandscapeTableHeaderBase) `
  grid-area: 'head';
  display: grid;
  box-sizing: border-box;
`;
    const getTableHeaderText = (direction, header) => {
        if (direction === '0') {
            return header.outboundTitle;
        }
        else if (direction === '1') {
            return header.inboundTitle;
        }
        return '';
    };
    const LandscapeTableCaption = ({ header, direction, day, trainHours }) => {
        const colors = {
            background: header[`${day}Background`],
            color: header[`${day}Color`]
        };
        const LandscapeTableCaptionSection = styled__default['default'](TableHeaderCaptionWrapper) `
    background: ${colors.background};
    color: ${colors.color};
    grid-row: 1;
    grid-column: 1 / calc(1 + ${trainHours.size});
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    border-top: solid 1px black;
    border-left: solid 1px black;
    box-sizing: border-box;
    height: ${Math.ceil(header.directionFontStyle.fontSize * 4 / 3)}px;
    line-height: 133.333333%;
  `;
        return React.createElement(LandscapeTableCaptionSection, { className: "timetable__caption" }, getTableHeaderText(direction, header));
    };
    const LandscapeTableHourCells = ({ header, cellWidth, day, trainHours, trainsPerHour }) => {
        let counter = 0;
        const cells = [];
        const colors = {
            background: header[`${day}Background`],
            color: header[`${day}Color`]
        };
        for (const [hour, trainsCount] of trainHours) {
            const actualHour = hour >= 24 ? hour - 24 : hour;
            const demandWidth = Math.ceil(trainsCount / trainsPerHour);
            const Cell = styled__default['default'](TableHourCellWrapperBase) `
      font-family: ${header.hourFontStyle.fontFamily};
      font-size: ${header.hourFontStyle.fontSize}px;
      font-style: ${header.hourFontStyle.isItalic ? 'oblique' : 'normal'};
      font-weight: ${header.hourFontStyle.isBold ? 'bold' : 'normal'};
      border-left: 1px solid ${counter ? colors.color : 'black'};
      border-top: 1px solid ${colors.color};
      width: ${cellWidth * demandWidth}px;
      background: ${colors.background};
      color: ${colors.color};
      box-sizing: border-box;
      line-height: 166.666666%;
      height: ${Math.floor(header.hourFontStyle.fontSize * 5 / 3)}px;
      text-align: center;
    `;
            cells.push(React.createElement(Cell, { key: `hour-${actualHour}` }, actualHour));
            counter++;
        }
        return React.createElement(React.Fragment, null, cells);
    };
    const PortraitTableHeaderBase = ({ timetable, direction, day }) => {
        const { header } = timetable;
        const colors = {
            background: header[`${day}Background`],
            color: header[`${day}Color`]
        };
        const HourText = styled__default['default'](({ className }) => React.createElement("div", { className: className }, "\u6642")) `
    grid-row: 1;
    grid-column: 1;
    background: ${colors.background};
    color: ${colors.color};
    border-top: solid 1px black;
    border-left: solid 1px black;
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    line-height: 133.333333%;
    grid-area: 'hour-text';
  `;
        const PortraitTableCaptionSection = styled__default['default'](TableHeaderCaptionWrapper) `
    background: ${colors.background};
    color: ${colors.color};
    grid-area: 'header';
    font-family: ${header.directionFontStyle.fontFamily};
    font-size: ${header.directionFontStyle.fontSize}px;
    font-style: ${header.directionFontStyle.isItalic ? 'oblique' : 'normal'};
    font-weight: ${header.directionFontStyle.isBold ? 'bold' : 'normal'};
    text-align: center;
    border-top: solid 1px black;
    border-left: solid 1px ${colors.color};
    box-sizing: border-box;
    height: ${Math.ceil(header.directionFontStyle.fontSize * 4 / 3)}px;
    line-height: 133.333333%;
  `;
        return React.createElement(React.Fragment, null,
            React.createElement(HourText, null),
            React.createElement(PortraitTableCaptionSection, { className: "timetable__caption" }, getTableHeaderText(direction, header)));
    };
    const PortraitTableHeader = styled__default['default'](PortraitTableHeaderBase) `
  grid-area: 'head';
  grid-row: 1;
`;
    const PortraitTableHoursColumnBase = ({ className, header, trainHours, day, trainsPerHour, cellHeight }) => {
        const cells = [];
        const colors = {
            background: header[`${day}Background`],
            color: header[`${day}Color`]
        };
        for (const [hour, trainsCount] of trainHours) {
            const actualHour = hour >= 24 ? hour - 24 : hour;
            const demandHeight = Math.ceil(trainsCount / trainsPerHour);
            const Cell = styled__default['default'](TableHourCellWrapperBase) `
      font-family: ${header.hourFontStyle.fontFamily};
      font-size: ${header.hourFontStyle.fontSize}px;
      font-style: ${header.hourFontStyle.isItalic ? 'oblique' : 'normal'};
      font-weight: ${header.hourFontStyle.isBold ? 'bold' : 'normal'};
      border-left: 1px solid black;
      border-top: 1px solid ${colors.color};
      background: ${colors.background};
      color: ${colors.color};
      box-sizing: border-box;
      line-height: 166.666666%;
      height: ${cellHeight * demandHeight}px;
      text-align: center;
    `;
            cells.push(React.createElement(Cell, { key: `hour-${actualHour}` }, actualHour));
        }
        return React.createElement("div", { className: className }, cells);
    };
    const PortraitTableHoursColumn = styled__default['default'](PortraitTableHoursColumnBase) `
  grid-area: 'hour-col';
`;
    const TableHeaderCaptionWrapper = ({ className, children }) => {
        return React.createElement("div", { className: className }, children);
    };
    const TableHourCellWrapperBase = ({ key, className, children }) => {
        return React.createElement("div", { key: key, className: className }, children);
    };

    const TableRemarks = ({ remarks, direction }) => {
        const { texts, ...remarkStyle } = remarks;
        const RemarkElements = texts.filter((text) => {
            return text.isInbound && direction === '1' || text.isInbound === false && direction === '0';
        }).map((text, index) => {
            const RemarkText = styled__default['default'](RemarkBase) `
        background: white;
        color: ${text.textColor};
        white-space: pre;
        writing-mode: ${text.isVertical ? 'vertical-rl' : 'horizontal-tb'};
      `;
            const Remark = styled__default['default'](RemarkWrapper) `
        position: absolute;
        left: ${text.x}px;
        top: ${text.y}px;
        font-family: ${remarkStyle.fontFamily};
        font-size: ${remarkStyle.fontSize}px;
        font-style: ${remarkStyle.isItalic ? 'oblique' : 'normal'};
        font-weight: ${remarkStyle.isBold ? 'bold' : 'normal'};
        line-height: 130%;
      `;
            return React.createElement(Remark, { key: `remark-${index}` },
                React.createElement(RemarkText, null, text.content));
        });
        return React.createElement(React.Fragment, null, RemarkElements);
    };
    const RemarkWrapper = ({ children, className }) => {
        return React.createElement("div", { className: className }, children);
    };
    const RemarkBase = ({ children, className }) => {
        return React.createElement("span", { className: className }, children);
    };

    const calcTableWidth = (timetable, hourTrains) => {
        const { header, trainsPerHour, cell, orientation } = timetable;
        const { width: cellWidth } = cell;
        let widthSum = 0;
        if (orientation === 0) {
            widthSum += getPortraitTableFirstColumnWidth(header.hourFontStyle);
            widthSum += cell.width * trainsPerHour;
        }
        else {
            for (const [, trainsCount] of hourTrains) {
                widthSum += cellWidth * Math.ceil(trainsCount / trainsPerHour);
            }
        }
        return widthSum;
    };
    const getPortraitTableFirstColumnWidth = (hourFontStyle) => {
        const { isBold, isItalic, fontFamily, fontSize } = hourFontStyle;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const boldFormat = isBold ? 'bold' : '';
        const italicFormat = isItalic ? 'italic' : '';
        context.font = `${boldFormat} ${italicFormat} ${fontSize}px ${fontFamily}`;
        return context.measureText('23').width;
    };
    const calcGridRepeat = (size, repeatUnits) => {
        const repeat = repeatUnits.map((unit) => {
            const actualSize = size * unit[0];
            if (unit[1] === 1) {
                return `${actualSize}px`;
            }
            else {
                return `repeat(${unit[1]}, ${actualSize}px)`;
            }
        }).join(' ');
        return repeat;
    };
    const getRepeatUnits = (trainHours, trainsPerHour) => {
        let prevHourSize = 0;
        const repeatUnits = [];
        for (const [, trainCount] of trainHours.entries()) {
            const demandSize = Math.ceil(trainCount / trainsPerHour);
            if (prevHourSize !== demandSize) {
                prevHourSize = demandSize;
                repeatUnits.push([demandSize, 1]);
            }
            else {
                repeatUnits[repeatUnits.length - 1][1]++;
            }
        }
        return repeatUnits;
    };

    const LandscapeTableBodyBase = ({ className, timetable, remarks, destinations, trainServices, trainHours, direction, trains }) => {
        const { cell, trainsPerHour } = timetable;
        return React.createElement("section", { className: className },
            React.createElement(LandscapeTableBodyCells, { cell: cell, trainHours: trainHours, destinations: destinations, trainServices: trainServices, trainsPerHour: trainsPerHour, trains: trains }),
            React.createElement(TableRemarks, { remarks: remarks, direction: direction }));
    };
    const LandscapeTableBody = styled__default['default'](LandscapeTableBodyBase) `
  grid-area: 'body';
  display: grid;
  position: relative;
  grid-template-rows: ${({ timetable }) => timetable.cell.height * timetable.trainsPerHour}px;
  grid-template-columns: ${({ timetable, trainHours }) => calcGridRepeat(timetable.cell.width, getRepeatUnits(trainHours, timetable.trainsPerHour))};
`;
    const TableBodyCellWrapperBase = ({ className, children }) => {
        return React.createElement("div", { className: className }, children);
    };
    const LandscapeTableBodyCells = ({ cell, destinations, trainServices, trainHours, trainsPerHour, trains }) => {
        const { width, height } = cell;
        const bodyCells = [];
        let lastTrainIndex = 0;
        const bodyCellHeight = height * trainsPerHour;
        for (const [hour, trainsCount] of trainHours) {
            const demandWidth = Math.ceil(trainsCount / trainsPerHour);
            const { hourTrains, nextLastTrainIndex } = getHourTrains(hour, trains, lastTrainIndex, cell, destinations, trainServices);
            const Cell = styled__default['default'](TableBodyCellWrapperBase) `
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
    `;
            bodyCells.push(React.createElement(Cell, { key: `body-${hour}` }, hourTrains));
            lastTrainIndex = nextLastTrainIndex;
        }
        return React.createElement(React.Fragment, null, bodyCells);
    };
    const PortraitTableBodyBase = ({ className, timetable, remarks: remark, destinations, trainServices, trainHours, direction, trains }) => {
        const { cell, trainsPerHour } = timetable;
        return React.createElement("section", { className: className },
            React.createElement(PortraitTableBodyCells, { cell: cell, trainHours: trainHours, destinations: destinations, trainServices: trainServices, trainsPerHour: trainsPerHour, trains: trains }),
            React.createElement(TableRemarks, { remarks: remark, direction: direction }));
    };
    const PortraitTableBody = styled__default['default'](PortraitTableBodyBase) `
  grid-area: 'body';
  display: grid;
  position: relative;
  grid-template-rows: ${({ timetable, trainHours }) => calcGridRepeat(timetable.cell.height, getRepeatUnits(trainHours, timetable.trainsPerHour))};
  grid-template-columns: ${({ timetable }) => timetable.cell.width * timetable.trainsPerHour}px;
`;
    const PortraitTableBodyCells = ({ cell, destinations, trainServices, trainHours, trainsPerHour, trains }) => {
        const { width, height } = cell;
        const bodyCells = [];
        let lastTrainIndex = 0;
        const bodyCellWidth = width * trainsPerHour;
        for (const [hour, trainsCount] of trainHours) {
            const demandHeight = Math.ceil(trainsCount / trainsPerHour);
            const { hourTrains, nextLastTrainIndex } = getHourTrains(hour, trains, lastTrainIndex, cell, destinations, trainServices);
            const Cell = styled__default['default'](TableBodyCellWrapperBase) `
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
    `;
            bodyCells.push(React.createElement(Cell, { key: `body-${hour}` }, hourTrains));
            lastTrainIndex = nextLastTrainIndex;
        }
        return React.createElement(React.Fragment, null, bodyCells);
    };
    const getHourTrains = (hour, trains, lastTrainIndex, cell, destinations, trainServices) => {
        let index = lastTrainIndex;
        const hourTrains = [];
        const { time, destination: cellDestination, service } = cell;
        for (; index < trains.length && hour === trains[index].departureHour; index++) {
            const train = trains[index];
            const { departureMinute, destination, serviceType } = train;
            const currentService = trainServices[serviceType];
            const TrainCell = styled__default['default'](TrainCellBase) `
      position: relative;
    `;
            const Minute = styled__default['default'](CellTextBase) `
      color: ${currentService.timetableColor};
      font-family: ${time.fontFamily};
      font-size: ${time.fontSize}px;
      font-style: ${time.isItalic ? 'oblique' : 'normal'};
      font-weight: ${time.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${time.y}px;
      left: ${time.x}px;
    `;
            const Destination = styled__default['default'](CellTextBase) `
      color: ${currentService.timetableColor};
      font-family: "${cellDestination.fontFamily}";
      font-size: ${cellDestination.fontSize}px;
      font-style: ${cellDestination.isItalic ? 'oblique' : 'normal'};
      font-weight: ${cellDestination.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${cellDestination.y}px;
      left: ${cellDestination.x}px;
    `;
            const TrainService = styled__default['default'](CellTextBase) `
      color: ${currentService.timetableColor};
      font-family: "${service.fontFamily}";
      font-size: ${service.fontSize}px;
      font-style: ${service.isItalic ? 'oblique' : 'normal'};
      font-weight: ${service.isBold ? 'bold' : 'normal'};
      position: absolute;
      top: ${service.y}px;
      left: ${service.x}px;
    `;
            hourTrains.push(React.createElement(TrainCell, { className: "timetable__train", key: `${hour}-${departureMinute}-${serviceType}-${destination}` },
                React.createElement(Minute, null, departureMinute),
                cellDestination.display ? React.createElement(Destination, null, destinations[destination].displayText) : undefined,
                service.display ? React.createElement(TrainService, null, currentService.serviceAbbr) : undefined));
        }
        return { nextLastTrainIndex: index, hourTrains };
    };
    const TrainCellBase = ({ className, children }) => {
        return React.createElement("div", { className: className }, children);
    };
    const CellTextBase = ({ className, children }) => {
        return React.createElement("span", { className: className }, children);
    };

    const TableWrapper = ({ className, children }) => {
        return React.createElement("section", { className: `timetable__table ${className}` }, children);
    };
    const timeTableTable = (wdtt, direction, day, trainHours, trains) => {
        const { timetable, remarks, destinations, trainServices } = wdtt;
        const { header, trainsPerHour, cell, orientation } = timetable;
        if (orientation === 0) {
            const firstColumnWidth = getPortraitTableFirstColumnWidth(header.hourFontStyle);
            const PortraitTable = ({ className }) => {
                return React.createElement(TableWrapper, { className: className },
                    React.createElement(PortraitTableHeader, { timetable: timetable, direction: direction, day: day }),
                    React.createElement(PortraitTableHoursColumn, { header: timetable.header, trainHours: trainHours, day: day, trainsPerHour: trainsPerHour, cellHeight: timetable.cell.height }),
                    React.createElement(PortraitTableBody, { className: "timetable__body", timetable: timetable, remarks: remarks, destinations: destinations, trainServices: trainServices, trainHours: trainHours, direction: direction, trains: trains }));
            };
            return styled__default['default'](PortraitTable) `
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
            const LandscapeTable = ({ className }) => {
                return React.createElement(TableWrapper, { className: className },
                    React.createElement(LandscapeTableHeader, { className: "timetable__header", timetable: timetable, trainHours: trainHours, direction: direction, day: day }),
                    React.createElement(LandscapeTableBody, { className: "timetable__body", timetable: timetable, remarks: remarks, destinations: destinations, trainServices: trainServices, trainHours: trainHours, direction: direction, trains: trains }));
            };
            const tableWidth = calcTableWidth(timetable, trainHours);
            return styled__default['default'](LandscapeTable) `
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

    const WDTTContext = React.createContext(undefined);
    const DispatchContext = React.createContext(null);

    const WdttViewerBase = ({ className }) => {
        const state = React.useContext(WDTTContext);
        const { timetable: wdtt, direction, day, qualifiedTrains } = state;
        if (wdtt && qualifiedTrains.trains.length) {
            const { timetable } = wdtt;
            const { mainTitle, subtitles, color } = timetable.titles;
            const tableWidth = calcTableWidth(timetable, qualifiedTrains.hourTrainsCount);
            const { hourTrainsCount, trains } = qualifiedTrains;
            const Timetable = timeTableTable(wdtt, direction, day, hourTrainsCount, trains);
            return React.createElement("section", { className: `wdtt-viewer ${className}` },
                React.createElement(WdttMainTitle, { className: "wdtt-viewer__title", color: color, mainTitle: mainTitle, width: tableWidth }),
                React.createElement(WdttSubTitleSection, { className: "wdtt-viewer__subtitle", color: color, title: subtitles, width: tableWidth }),
                React.createElement(Timetable, null));
        }
        else {
            return React.createElement("section", { className: className }, "\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093");
        }
    };
    const WdttViewer = styled__default['default'](WdttViewerBase) `
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
`;

    const dbWorkerHandler = (dbWorker, data) => {
        return new Promise((resolve, reject) => {
            dbWorker.addEventListener('message', (event) => {
                const result = event.data;
                resolve(result);
            }, { once: true });
            dbWorker.addEventListener('error', (event) => {
                reject(event.message);
            }, { once: true });
            dbWorker.postMessage(data);
        });
    };

    const wdttFileWorkerHandler = (file) => {
        const wdttWorker = new Worker('./js/worker/wdtt-worker.js');
        wdttWorker.postMessage({ file });
        return new Promise((resolve, reject) => {
            wdttWorker.addEventListener('message', (event) => {
                const result = event.data;
                resolve(result);
            });
            wdttWorker.addEventListener('error', (event) => {
                reject(event.message);
            });
        });
    };

    const Form = () => {
        const state = React.useContext(WDTTContext);
        const dispatch = React.useContext(DispatchContext);
        const setWdttEvent = async (event) => {
            const file = event.target.files;
            if (file && file[0]) {
                try {
                    const { wdtt, trains } = await wdttFileWorkerHandler(file[0]);
                    await dbWorkerHandler(state.dbWorker, { type: 'load', trains });
                    const qualifiedTrains = await dbWorkerHandler(state.dbWorker, {
                        type: 'search',
                        condition: {
                            direction: state.direction,
                            day: state.day,
                            otherConditions: state.otherConditions
                        }
                    });
                    dispatch({ type: 'wdttChange', wdtt, qualifiedTrains });
                }
                catch (e) {
                    console.error(e);
                }
            }
        };
        const selectFormTrainCondition = async (event, form) => {
            let qualifiedTrains;
            switch (form) {
                case 'direction':
                    qualifiedTrains = await dbWorkerHandler(state.dbWorker, {
                        type: 'search',
                        condition: {
                            direction: event.target.value,
                            day: state.day,
                            otherConditions: state.otherConditions,
                        }
                    });
                    dispatch({ type: 'changeDirection', direction: event.target.value, qualifiedTrains });
                    break;
                case 'day':
                    qualifiedTrains = await dbWorkerHandler(state.dbWorker, {
                        type: 'search',
                        condition: {
                            direction: state.direction,
                            day: event.target.value,
                            otherConditions: state.otherConditions,
                        }
                    });
                    dispatch({ type: 'changeDay', day: event.target.value, qualifiedTrains });
                    break;
            }
        };
        const inputFormTrainCondition = async (event, form) => {
            switch (form) {
                case 'extra':
                case 'seasonal':
                case 'irregular': {
                    const changedCondition = {};
                    changedCondition[form] = event.target.checked;
                    const nextOtherConditions = { ...state.otherConditions, ...changedCondition };
                    const qualifiedTrains = await dbWorkerHandler(state.dbWorker, {
                        type: 'search',
                        condition: {
                            direction: state.direction,
                            day: state.day,
                            otherConditions: nextOtherConditions
                        }
                    });
                    dispatch({ type: 'changeBooleanCondition', otherConditions: nextOtherConditions, qualifiedTrains });
                    break;
                }
            }
        };
        // const wdttFileWorkerHandler = (file: File) => {
        //   const wdttWorker = new Worker('./js/worker/wdtt-worker.js');
        //   wdttWorker.postMessage({ file });
        //   return new Promise(
        //     (resolve, reject) => {
        //       wdttWorker.addEventListener(
        //         'message',
        //         (event) => {
        //           const result = event.data as workerOutput;
        //           resolve(result);
        //         }
        //       );
        //       wdttWorker.addEventListener(
        //         'error',
        //         (event) => {
        //           reject(event.message);
        //         }
        //       );
        //     }
        //   );
        // }
        return React.createElement("section", null,
            React.createElement("input", { type: "file", onChange: setWdttEvent }),
            React.createElement("fieldset", null,
                React.createElement("legend", null, "\u8868\u793A\u6761\u4EF6"),
                React.createElement("label", null, "\u65B9\u5411"),
                React.createElement("select", { disabled: !state.timetable, defaultValue: state.direction, onChange: (event) => {
                        event.persist();
                        selectFormTrainCondition(event, 'direction');
                    } },
                    React.createElement("option", { value: "0" }, "\u4E0B\u308A"),
                    React.createElement("option", { value: "1" }, "\u4E0A\u308A")),
                React.createElement("label", null, "\u8868\u793A\u65E5"),
                React.createElement("select", { disabled: !state.timetable, defaultValue: state.day, onChange: (event) => {
                        event.persist();
                        selectFormTrainCondition(event, 'day');
                    } },
                    React.createElement("option", { value: "weekday" }, "\u5E73\u65E5"),
                    React.createElement("option", { value: "saturday" }, "\u571F\u66DC"),
                    React.createElement("option", { value: "holiday" }, "\u795D\u65E5")),
                React.createElement("fieldset", null,
                    React.createElement("legend", null, "\u4E0D\u5B9A\u671F\u4FBF"),
                    React.createElement("label", null, "\u81E8\u6642\u5217\u8ECA"),
                    React.createElement("input", { type: "checkbox", disabled: !state.timetable, onChange: (event) => {
                            event.persist();
                            inputFormTrainCondition(event, 'extra');
                        } }),
                    React.createElement("label", null, "\u5B63\u7BC0\u5217\u8ECA"),
                    React.createElement("input", { type: "checkbox", disabled: !state.timetable, onChange: (event) => {
                            event.persist();
                            inputFormTrainCondition(event, 'seasonal');
                        } }),
                    React.createElement("label", null, "\u4E0D\u5B9A\u671F\u5217\u8ECA"),
                    React.createElement("input", { type: "checkbox", disabled: !state.timetable, onChange: (event) => {
                            event.persist();
                            inputFormTrainCondition(event, 'irregular');
                        } }))));
    };

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
        const [state, dispatch] = React.useReducer(timetableReducer, defaultState);
        // let timetable = undefined;
        // let qualifiedTrains = {
        //   trains: [],
        //   hourTrainsCount: new Map(),
        // } as unknown
        React.useEffect(() => {
            const fileLoad = async () => {
                const request = await fetch('./fixtures/test2.wtt');
                const wdttBlob = await request.blob();
                const { wdtt, trains } = await wdttFileWorkerHandler(wdttBlob);
                // timetable = wdtt;
                await dbWorkerHandler(dexieWorker, { type: 'load', trains });
                const qualifiedTrains = await dbWorkerHandler(dexieWorker, {
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
                });
                dispatch({ type: 'wdttChange', wdtt, qualifiedTrains });
            };
            dbWorkerHandler(dexieWorker, { type: 'init' });
            fileLoad();
        }, []);
        return (React.createElement(WDTTContext.Provider, { value: state },
            React.createElement(DispatchContext.Provider, { value: dispatch },
                React.createElement(Form, null),
                React.createElement(WdttViewer, null))));
    };
    reactDom.render(React.createElement(App, null), document.querySelector('#AppRoot'));

}(React, ReactDOM, emotionStyled));
