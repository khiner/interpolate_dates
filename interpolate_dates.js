import csv from 'csv-parser'
import fs from 'fs'
import { interpolateDate } from 'd3-interpolate'

const interpolateDates = (dates) => {
    const presentDatesAndIndices = dates.map((date, i) => ({ date, i })).filter(({ date }) => date)
    console.log('%: ', (presentDatesAndIndices.length / dates.length) * 100)
    const pairs = presentDatesAndIndices.reduce((result, value, index, array) => {
        if (index < presentDatesAndIndices.length - 1) result.push(array.slice(index, index + 2))
        return result;
    }, []);
    const interpolatedDates = []
    pairs.forEach(([{ i: iA, date: dateA }, { i: iB, date: dateB }]) => {
        const interp = interpolateDate(dateA, dateB);
        for (let i = iA; i < iB; i++) {
            const ratio = (i - iA) / (iB - iA)
            const interpolatedDate = new Date(interp(ratio))
            interpolatedDates.push(interpolatedDate)
        }
    })
    interpolatedDates.push(presentDatesAndIndices[presentDatesAndIndices.length - 1].date)
    return interpolatedDates
}

const datesFilePath = process.argv[2] || 'dates.csv'
const dates = []
fs.createReadStream(datesFilePath)
    .pipe(csv())
    .on('data', (data) => {
        const watchDateString = data['Date']
        dates.push(watchDateString ? new Date(watchDateString) : undefined);
    })
    .on('end', () => {
        const formatDate = (date) => date && date.toISOString().split('T')[0]
        const interpolatedDates = interpolateDates(dates)
        console.log(interpolatedDates.map(formatDate).join('\n'))
    })
