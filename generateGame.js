const generateGame = () => {
  const numbers = new Array(1000)
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] = Math.floor((Math.random() * 98) + 2)
  }
  
  const filteredNumbers = numbers.filter((n, i) => numbers.indexOf(n) === i)
  // console.log('numbers with duplicates filtered out: ', filteredNumbers)
  // console.log('amount of filtered numbers in array: ', filteredNumbers.length)
  
  const pairs = []
  for (let i = 0; i < filteredNumbers.length; i += 2) {
    pairs.push(filteredNumbers.slice(i, i+2))
  } 
  // console.log('pairs of numbers: ', pairs)
  // console.log('amount of pairs: ', pairs.length)
  
  const pits = pairs.filter(pair => pair[0] > (pair[1] + 4) && pair[0] - pair[1] < 65 && pair[0] % 2 === 0).slice(0, 7)
  const portals = pairs.filter(pair => pair[0] < (pair[1] - 4) && pair[1] - pair[0] < 65).slice(0, 7)
  // pits.map(pit => console.log(`pit at square ${pit[0]}, you fall down to square ${pit[1]}`)).slice(0, 7)
  // portals.map(portal => console.log(`portal at square ${portal[0]}, you get beamed up to square ${portal[1]}`)).slice(0, 7)
  console.log(`number of pits: ${pits.length}, number of portals: ${portals.length}`)
  
  return {pits: pits, portals: portals}
}

module.exports = generateGame