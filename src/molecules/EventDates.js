import React from 'react'
import Moment from 'react-moment'

import { rhythm, scale } from '../utils/typography'

const EventDates = ({ start, end, locale, altColor }) => {
  const [startDate, startTime] = start.split('T')
  const [endDate, endTime] = end.split('T')

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
            css: {
              ...scale(-0.2),
              lineHeight: rhythm(1 / 2),
              marginBottom: rhythm(1 / 2),
              // padding: rhythm(1 / 2),
            },
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
              css: {
                ...scale(-0.2),
                lineHeight: rhythm(1 / 2),
                marginBottom: rhythm(1 / 2),
                // padding: rhythm(1 / 2),
                ...altColor,
              },
            }}
          >
            {start}
          </Moment>
        </>
      )}
      {start && (showEnd || showEndTime) && (
        <span {...{ css: { ...altColor } }}>{` > `}</span>
      )}
      {showEnd && (
        <Moment
          {...{
            locale,
            format: 'Do MMM YYYY',
            css: {
              ...scale(-0.2),
              lineHeight: rhythm(1 / 2),
              marginBottom: rhythm(1 / 2),
              // padding: rhythm(1 / 2),
            },
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
              css: {
                ...scale(-0.2),
                lineHeight: rhythm(1 / 2),
                marginBottom: rhythm(1 / 2),
                // padding: rhythm(1 / 2),
                ...altColor,
              },
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
