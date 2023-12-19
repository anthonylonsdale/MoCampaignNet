importScripts(
    'https://cdn.jsdelivr.net/npm/@turf/turf@6.5/turf.min.js',
    'https://cdn.jsdelivr.net/npm/chroma-js@2.1.1/chroma.min.js',
    'https://cdn.jsdelivr.net/npm/rbush@3.0/rbush.min.js',
)


self.onmessage = function(e) {
  const { shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName } = e.data

  const totalDistricts = shapefileShapes.length
  let processedDistricts = 0
  let processedPrecincts = 0

  const districtResults = {}
  const districtMargins = {}

  const checkedPrecincts = new Set()
  const tree = new RBush()
  const precinctAreas = new Map() // Store pre-calculated areas

  precinctShapes.forEach((precinct, index) => {
    const bbox = turf.bbox(precinct.geometry)
    const area = turf.area(precinct.geometry)
    precinctAreas.set(precinct.properties.NAME, area)

    tree.insert({
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
      id: index,
    })
  })

  shapefileShapes.forEach((districtFeature) => {
    const districtId = districtFeature.properties[idFieldName]
    processedDistricts++
    self.postMessage({ type: 'progress', processedDistricts, totalDistricts })

    const districtBbox = turf.bbox(districtFeature.geometry)
    const candidates = tree.search({
      minX: districtBbox[0],
      minY: districtBbox[1],
      maxX: districtBbox[2],
      maxY: districtBbox[3],
    })

    const totalPrecincts = candidates.length

    candidates.forEach((candidate) => {
      const precinctFeature = precinctShapes[candidate.id]
      const precinctId = precinctFeature.properties.NAME

      if (checkedPrecincts.has(precinctId)) return
      try {
        const intersection = turf.intersect(districtFeature.geometry, precinctFeature.geometry)
        if (intersection) {
          const intersectionArea = turf.area(intersection)
          const precinctArea = precinctAreas.get(precinctId)
          const areaRatio = intersectionArea / precinctArea

          const properties = precinctFeature.properties

          if (areaRatio >= 0.99) {
            checkedPrecincts.add(precinctId)
          }

          electoralFields.forEach((field) => {
            const electionCode = field.content.substring(mapping[2].start, mapping[2].end)
            const candidateCode = field.content.substring(mapping[4].start, mapping[4].end)
            const partyCode = field.content.substring(mapping[3].start, mapping[3].end) // Extracting party code

            const proportionalVotes = Math.round(properties[field.content] * areaRatio)

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

            processedPrecincts++
            self.postMessage({ type: 'progress2', processedPrecincts, totalPrecincts })
          })
        }
      } catch (error) {
        console.error('Error processing feature:', error)
      }
    })
  })

  Object.keys(districtResults).forEach((districtId) => {
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
    })
  })

  self.postMessage({ type: 'result', districtMargins, districtResults })
}
