const generateGame = (userName) => {
  const numbers = new Array(1000)
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = Math.floor((Math.random() * 98) + 2)
  }
  const filteredNumbers = numbers.filter((n, i) => numbers.indexOf(n) === i)
  const pairs = []
  for (let i = 0; i < filteredNumbers.length; i += 2) {
    pairs.push(filteredNumbers.slice(i, i+2))
  } 
  const pits = pairs.filter(pair => pair[0] > (pair[1] + 4) && pair[0] - pair[1] < 65 && pair[0] % 2 === 0).slice(0, 7)
  const portals = pairs.filter(pair => pair[0] < (pair[1] - 4) && pair[1] - pair[0] < 65).slice(0, 7)
  console.log(`number of pits: ${pits.length}, number of portals: ${portals.length}`)
  
  return {pits: pits, portals: portals, createdBy: userName}
}

module.exports = generateGame