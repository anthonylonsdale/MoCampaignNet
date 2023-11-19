import { Collapse } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'

const { Panel } = Collapse

const ElectoralResults = ({ electoralFields, mapping, precinctData }) => {
  const [electoralResults, setElectoralResults] = useState([])

  useEffect(() => {
    if (electoralFields && mapping && precinctData) {
      processResults()
    }
  }, [electoralFields, mapping, precinctData])

  const processResults = () => {
    const results = {}
    const elections = {}

    electoralFields.forEach((field) => {
      const electionCode = field.content.substring(mapping[2].start, mapping[2].end)
      const candidateCode = field.content.substring(mapping[4].start, mapping[4].end)
      if (!elections[electionCode]) {
        elections[electionCode] = []
      }
      elections[electionCode].push(candidateCode)
    })

    // Tally votes for each candidate in each election
    precinctData.forEach(({ properties }) => {
      Object.entries(properties).forEach(([key, votes]) => {
        const electionCode = key.substring(mapping[2].start, mapping[2].end)
        const candidateCode = key.substring(mapping[4].start, mapping[4].end)
        if (elections[electionCode] && elections[electionCode].includes(candidateCode)) {
          if (!results[electionCode]) {
            results[electionCode] = {}
          }
          if (!results[electionCode][candidateCode]) {
            results[electionCode][candidateCode] = 0
          }
          results[electionCode][candidateCode] += votes
        }
      })
    })

    // Convert results to an array suitable for the pie chart
    const formattedResults = Object.keys(results).map((election) => {
      const data = Object.keys(results[election]).map((candidate) => {
        return [candidate, results[election][candidate]]
      })
      return { election, data }
    })

    setElectoralResults(formattedResults)
  }

  // Highcharts options
  const getChartOptions = (data) => ({
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Vote Share',
    },
    series: [{
      name: 'Votes',
      colorByPoint: true,
      data: data,
    }],
  })

  return (
    <Collapse>
      {electoralResults.map(({ election, data }, index) => (
        <Panel header={election} key={index}>
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions(data)}
          />
        </Panel>
      ))}
    </Collapse>
  )
}

export default ElectoralResults
