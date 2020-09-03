(function () {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var wdttParser_cjs = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	/**
	 * WDTT parser ver 2.0.5
	 * Copyright (C) 2018-2020 Tom Konda
	 * Released under the MIT license
	 */
	const wdttParse = (() => {
	    const getSectionText = (str = '', start, end = '') => {
	        let regexp;
	        if (end.length) {
	            regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)\\s+\\[${end}`);
	        }
	        else {
	            regexp = new RegExp(`\\[${start}\\]\\s+([\\s\\S]+)$`);
	        }
	        const match = str.match(regexp);
	        return match === null ? '' : match[1].trim();
	    };
	    return (wtt = '') => {
	        wtt = wtt.replace(/\r/g, '');
	        const title = getSectionText(wtt, 'WinDIATimeTable', '表示');
	        const [timetableTitleText, timetableValidDate, timetableSupervisor, timetableOutboundTitle, timetableInboundTitle, timetableStyle, cellStyle, colorStyle, ...fontStyle] = getSectionText(wtt, '表示', '凡例').split('\n');
	        const [timetableOrientation, trainsPerHour] = timetableStyle.split(',').map(Number);
	        const [cellWidth, cellHeight, cellTimePosX, cellTimePosY, cellTrainServicePosX, cellTrainServicePosY, destinationPosX, destinationPosY, trainServiceDisplayFlag, destinationDisplayFlag] = cellStyle.split(',').map(Number);
	        const [titleColor, weekdayColor, weekdayBackground, saturdayColor, saturdayBackground, holidayColor, holidayBackground] = colorStyle.split(',');
	        const [titleFontStyle, subtitleFontStyle, headerDirectionFontStyle, headerHourFontStyle, cellTimeFontStyle, cellTrainServiceFontStyle, cellTrainDestinationFontStyle, remarkFontStyle] = fontStyle.map(styles => {
	            const [fontFamily, fontSize, isBold, isItalic] = styles.split(',');
	            return { fontFamily, fontSize: Number(fontSize), isBold: isBold === '1', isItalic: isItalic === '1' };
	        });
	        const remarkSectionText = getSectionText(wtt, '凡例', '種別');
	        const remarks = remarkSectionText.match(/Remark[01]=[0-9]+,[0-9]+,[0-9]+,[0-9A-F]+,(.|\n(?=\t))+/g) || [];
	        const remarkTexts = remarks.map((remarkRow) => {
	            const [, isInbound, xPos, yPos, isVertical, textColor, content] = remarkRow.match(/Remark([01])=([0-9]+),([0-9]+),([0-9]+),([0-9A-F]+),([\S\s]+)/);
	            return {
	                isInbound: isInbound === '1',
	                x: Number(xPos), y: Number(yPos),
	                isVertical: isVertical === '1',
	                textColor: `#${textColor}`,
	                content: content.replace(/\t/g, ''),
	            };
	        });
	        const trainServices = getSectionText(wtt, '種別', '行先').split('\n').map((value) => {
	            const [, trainServiceData] = value.split('=');
	            const [serviceType, serviceAbbr, timetableColorText] = trainServiceData.split(',');
	            return { serviceType, serviceAbbr, timetableColor: `#${timetableColorText}` };
	        });
	        const destinations = getSectionText(wtt, '行先', '下り').split('\n').map((value) => {
	            const [, destinationData] = value.split('=');
	            const [destination, displayText] = destinationData.split(',');
	            return { destination, displayText };
	        });
	        const getTrainData = (trainText) => {
	            const [serviceType, trainID, trainServiceName, trainServiceNumber, departureTime, destination, operationDate] = trainText.split(',');
	            return {
	                serviceType: Number(serviceType),
	                trainID, trainServiceName,
	                trainServiceNumber: trainServiceNumber === '' ? null : Number(trainServiceNumber),
	                departureTime,
	                destination: Number(destination),
	                operationDate: Number(operationDate)
	            };
	        };
	        const outboundTrainsSectionText = getSectionText(wtt, '下り', '上り');
	        const outboundTrains = outboundTrainsSectionText.length ? outboundTrainsSectionText.split('\n').map(getTrainData) : [];
	        const inboundTrainsSectionText = getSectionText(wtt, '上り');
	        const inboundTrains = inboundTrainsSectionText.length ? inboundTrainsSectionText.split('\n').map(getTrainData) : [];
	        return {
	            title,
	            remarks: {
	                ...remarkFontStyle,
	                ...{
	                    texts: remarkTexts,
	                },
	            },
	            timetable: {
	                orientation: timetableOrientation,
	                trainsPerHour,
	                titles: {
	                    color: `#${titleColor}`,
	                    mainTitle: {
	                        ...titleFontStyle,
	                        ...{
	                            text: timetableTitleText,
	                        }
	                    },
	                    subtitles: {
	                        ...subtitleFontStyle,
	                        ...{
	                            texts: [
	                                timetableSupervisor,
	                                timetableValidDate,
	                            ],
	                        },
	                    },
	                },
	                header: {
	                    outboundTitle: timetableOutboundTitle,
	                    inboundTitle: timetableInboundTitle,
	                    directionFontStyle: headerDirectionFontStyle,
	                    hourFontStyle: headerHourFontStyle,
	                    weekdayColor: `#${weekdayColor}`,
	                    weekdayBackground: `#${weekdayBackground}`,
	                    saturdayColor: `#${saturdayColor}`,
	                    saturdayBackground: `#${saturdayBackground}`,
	                    holidayColor: `#${holidayColor}`,
	                    holidayBackground: `#${holidayBackground}`,
	                },
	                cell: {
	                    width: cellWidth,
	                    height: cellHeight,
	                    time: {
	                        ...cellTimeFontStyle,
	                        ...{
	                            x: cellTimePosX,
	                            y: cellTimePosY,
	                        },
	                    },
	                    service: {
	                        ...cellTrainServiceFontStyle,
	                        ...{
	                            x: cellTrainServicePosX,
	                            y: cellTrainServicePosY,
	                            display: trainServiceDisplayFlag === 1,
	                        }
	                    },
	                    destination: {
	                        ...cellTrainDestinationFontStyle,
	                        ...{
	                            x: destinationPosX,
	                            y: destinationPosY,
	                            display: destinationDisplayFlag === 1,
	                        }
	                    },
	                },
	            },
	            trainServices,
	            destinations,
	            outboundTrains,
	            inboundTrains,
	        };
	    };
	})();

	exports.wdttParse = wdttParse;
	});

	unwrapExports(wdttParser_cjs);
	var wdttParser_cjs_1 = wdttParser_cjs.wdttParse;

	self.addEventListener('message', async (event) => {
	    const { file } = event.data;
	    try {
	        const loadResult = await fileHandler(file);
	        const wdtt = wdttParser_cjs_1(loadResult);
	        const { inboundTrains, outboundTrains } = wdtt;
	        const trains = await addColumnsToAllTrains(inboundTrains, outboundTrains);
	        // const [inboundHours, outboundHours] = await trainHourCalc(inboundTrains, outboundTrains);
	        postMessage({ wdtt, trains });
	        close();
	    }
	    catch (error) {
	        console.error(error, 'パースエラー');
	        close();
	    }
	});
	const fileHandler = (file) => {
	    try {
	        const reader = new FileReader();
	        reader.readAsText(file, 'shift_jis');
	        return new Promise((resolve, reject) => {
	            reader.addEventListener('load', () => {
	                reader.result ? resolve(reader.result) : reject('Load failure.');
	            });
	            reader.addEventListener('error', () => {
	                reject('Load error.');
	            });
	        });
	    }
	    catch (error) {
	        console.error(error, 'File load error');
	        throw (error);
	    }
	};
	// const trainHourCalc = (inboundTrains: trainData[], outboundTrains: trainData[]) => {
	//   return Promise.all(
	//     [
	//       workerHandler(inboundTrains),
	//       workerHandler(outboundTrains),
	//     ]
	//   );
	// }
	const addColumnsToAllTrains = async (inboundTrains, outboundTrains) => {
	    const trains = await Promise.all([
	        addColumnsToDirectionTrains(0, outboundTrains),
	        addColumnsToDirectionTrains(1, inboundTrains)
	    ]);
	    return [...trains[0], ...trains[1]];
	};
	const addColumnsToDirectionTrains = (direction, directionTrains) => {
	    const directionObject = { direction };
	    const MIN_DEPARTURE_HOUR = 3;
	    return directionTrains.map((directionTrain, directionTrainIndex) => {
	        let departureHour = Number(directionTrain.departureTime.padStart(4, '0').substring(0, 2));
	        departureHour = departureHour >= MIN_DEPARTURE_HOUR ? departureHour : departureHour + 24;
	        const departureMinute = directionTrain.departureTime.slice(-2);
	        return {
	            ...directionObject,
	            ...directionTrain,
	            ...{ directionTrainIndex },
	            ...{ departureHour, departureMinute }
	        };
	    });
	};

}());
