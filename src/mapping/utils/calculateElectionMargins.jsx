import * as turf from '@turf/turf'
import chroma from 'chroma-js'


export const calcPartisanAdvantage = (shapefileShapes, precinctShapes, electoralFields, mapping) => {
  const districtResults = {}
  const districtMargins = {}
  const districtTooltips = {}

  console.log(shapefileShapes)

  shapefileShapes.forEach((districtFeature) => {
    const districtId = districtFeature.properties.ID

    precinctShapes.forEach((precinctFeature) => {
      try {
        if (turf.intersect(districtFeature.geometry, precinctFeature.geometry)) {
          const properties = precinctFeature.properties

          electoralFields.forEach((field) => {
            const electionCode = field.content.substring(mapping[2].start, mapping[2].end)
            const candidateCode = field.content.substring(mapping[4].start, mapping[4].end)
            const partyCode = field.content.substring(mapping[3].start, mapping[3].end) // Extracting party code

            const votes = properties[field.content]

            if (!districtResults[districtId]) {
              districtResults[districtId] = {}
            }
            if (!districtResults[districtId][electionCode]) {
              districtResults[districtId][electionCode] = {}
            }
            if (!districtResults[districtId][electionCode][partyCode]) {
              districtResults[districtId][electionCode][partyCode] = { totalVotes: 0, candidate: candidateCode }
            }

            districtResults[districtId][electionCode][partyCode].totalVotes += votes
          })
        }
      } catch (error) {
        console.error('Error processing feature:', error)
      }
    })

    Object.keys(districtResults[districtId]).forEach((electionCode) => {
      const parties = districtResults[districtId][electionCode]
      const sortedParties = Object.entries(parties).sort((a, b) => b[1].totalVotes - a[1].totalVotes)
      const winningMargin = ((sortedParties[0][1].totalVotes - sortedParties[1][1].totalVotes) / sortedParties[0][1].totalVotes) * 100
      const winningParty = sortedParties[0][0]

      const colorScale = chroma.scale([
        winningParty === 'R' ? '#c37884' : '#3434c0',
        'white',
      ]).domain([15, 0])

      let color
      if (winningMargin > 15) {
        color = winningParty === 'R' ? '#c37884' : '#3434c0'
      } else {
        color = colorScale(winningMargin).hex()
      }

      districtMargins[districtId] = color
      districtTooltips[districtId] = createTooltipContent(districtResults, districtId)
    })
  })
  return { districtMargins, districtTooltips, districtResults }
}

function createTooltipContent(districtResults, districtId) {
  let content = `<h4>District ${districtId}</h4>`

  Object.keys(districtResults[districtId]).forEach((electionCode) => {
    const election = districtResults[districtId][electionCode]
    const totalDistrictVotes = Object.values(election).reduce((sum, { totalVotes }) => sum + totalVotes, 0)

    content += `<div><strong>Election ${electionCode}</strong></div>`
    content += `<div style="display: flex; height: 20px; background-color: lightgray;">`

    Object.entries(election).forEach(([partyCode, { totalVotes: partyVotes }]) => {
      const votePercentage = (partyVotes / totalDistrictVotes) * 100
      const color = partyCode === 'R' ? 'Red' : partyCode === 'D' ? 'Blue' : 'Grey'
      content += `<div style="width: ${votePercentage}%; background-color: ${color};"></div>`
    })
    content += `</div>`
  })

  return content
}
