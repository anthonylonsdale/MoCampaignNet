import { Collapse, List } from 'antd'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useState } from 'react'

const { Panel } = Collapse

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

    const formattedResults = Object.keys(results).map((election) => {
      const totalVotes = Object.values(results[election]).reduce((a, b) => a + b, 0)
      const data = Object.keys(results[election]).map((candidate) => {
        const votes = results[election][candidate]
        const percentage = ((votes / totalVotes) * 100).toFixed(2)
        return {
          name: candidate,
          y: votes,
          percentage: percentage,
        }
      })
      return { election, data, totalVotes }
    })

    setElectoralResults(formattedResults)
  }

  return (
    <Collapse>
      {electoralResults.map(({ election, data }, index) => (
        <Panel header={election} key={index}>
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions(data)}
          />
          <List
            size="small"
            header={<div><strong>Candidates and Vote Share</strong></div>}
            bordered
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                {item.name} - {item.percentage}% ({item.y.toLocaleString()} votes)
              </List.Item>
            )}
          />
        </Panel>
      ))}
    </Collapse>

  )
}

export default ElectoralResults
