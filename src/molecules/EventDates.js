import React from 'react'
import Moment from 'react-moment'

const EventDates = ({ start, end, locale }) => {
  const [startDate, startTime] = start?.split('T') || []
  const [endDate, endTime] = end?.split('T') || []

  const showEnd = endDate && endDate !== startDate
  const showStartTime = startTime && startTime !== '00:00'
  const showEndTime = endTime && endTime !== '00:00'

  return !start ? null : (
    <>
      {start && (
        <Moment
          {...{
            locale,
            format: 'Do MMM YYYY',
            className: `eventdates-date eventdates-start`,
          }}
        >
          {start}
        </Moment>
      )}
      {showStartTime && (
        <>
          <span>{` - `}</span>
          <Moment
            {...{
              locale,
              format: 'HH:mm',
              className: `eventdates-time eventdates-start`,
            }}
          >
            {start}
          </Moment>
        </>
      )}
      {start && (showEnd || showEndTime) && (
        <span {...{ className: `eventdates-chevron` }}>{` > `}</span>
      )}
      {showEnd && (
        <Moment
          {...{
            locale,
            format: 'Do MMM YYYY',
            className: `eventdates-date eventdates-end`,
          }}
        >
          {end}
        </Moment>
      )}
      {showEndTime && (
        <>
          {showEnd && <span>{` - `}</span>}
          <Moment
            {...{
              locale,
              format: 'HH:mm',
              className: `eventdates-time eventdates-end`,
            }}
          >
            {end}
          </Moment>
        </>
      )}
    </>
  )
}

export default EventDates
