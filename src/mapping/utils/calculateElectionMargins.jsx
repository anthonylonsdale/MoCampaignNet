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
        const intersection = turf.intersect(districtFeature.geometry, precinctFeature.geometry)
        if (intersection) {
          const intersectionArea = turf.area(intersection)
          const precinctArea = turf.area(precinctFeature.geometry)
          const areaRatio = intersectionArea / precinctArea

          const properties = precinctFeature.properties

          electoralFields.forEach((field) => {
            const electionCode = field.content.substring(mapping[2].start, mapping[2].end)
            const candidateCode = field.content.substring(mapping[4].start, mapping[4].end)
            const partyCode = field.content.substring(mapping[3].start, mapping[3].end) // Extracting party code

            const votes = properties[field.content]
            const proportionalVotes = Math.round(votes * areaRatio) // Multiply votes by area ratio and round

            if (!districtResults[districtId]) {
              districtResults[districtId] = {}
            }
            if (!districtResults[districtId][electionCode]) {
              districtResults[districtId][electionCode] = {}
            }
            if (!districtResults[districtId][electionCode][partyCode]) {
              districtResults[districtId][electionCode][partyCode] = { totalVotes: 0, candidate: candidateCode }
            }

            districtResults[districtId][electionCode][partyCode].totalVotes += proportionalVotes
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
  let previousRaceTotalVotes = 0 // Initialize with zero for the first race

  Object.keys(districtResults[districtId]).forEach((electionCode, index) => {
    const election = districtResults[districtId][electionCode]
    const totalDistrictVotes = Object.values(election).reduce((sum, { totalVotes }) => sum + totalVotes, 0)
    const sortedCandidates = Object.entries(election).sort((a, b) => b[1].totalVotes - a[1].totalVotes)

    let dropoff = 0
    if (index > 0) { // Skip dropoff calculation for the first race
      dropoff = previousRaceTotalVotes - totalDistrictVotes
    }
    previousRaceTotalVotes = totalDistrictVotes // Update for the next race

    const dropoffFormatted = dropoff >= 0 ? `<span style="color: green;">+${dropoff.toLocaleString()}</span>` :
                                               `<span style="color: red;">-${Math.abs(dropoff).toLocaleString()}</span>`

    content += `<div><strong>Election ${electionCode}</strong> ${index > 0 ? dropoffFormatted : ''}</div>`
    content += `<div style="display: flex; flex-direction: column; margin-bottom: 10px; width: 100%;">`

    sortedCandidates.forEach(([partyCode, { totalVotes: partyVotes }]) => {
      const votePercentage = (partyVotes / totalDistrictVotes) * 100
      const color = partyCode === 'R' ? '#ff4c4c' : partyCode === 'D' ? '#4c6eff' : '#cccccc'

      content += `<div style="display: flex; align-items: center; margin-bottom: 4px; width: 100%;">`
      content += `<div style="flex-grow: 1; height: 20px; background-color: ${color}; width: ${votePercentage}%;"></div>`
      content += `<div style="width: 50px; text-align: right; padding-left: 5px;">${partyVotes.toLocaleString()}</div>`
      content += `</div>`
    })

    content += `</div>`
  })

  return content
}
