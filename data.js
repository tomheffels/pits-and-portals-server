let game = {
  id: 1,
  gameStart: false,
  currentPlayer: 1,
  gameEnd: false,
  winner: null,
  players: [
    {
      userName: 'Player1',
      clientId: 'kfjvncwijn76s8c6dfc',
      position: 1,
      active: true,
      avatar: 'http://api.adorable.io/avatars/200/Player1.png'
    },
    {
      userName: 'Player2',
      clientId: 'whfbkajfbek6574dacs',
      position: 1,
      active: true,
      avatar: 'http://api.adorable.io/avatars/200/Player2.png'
    },
    {
      userName: 'Player3',
      clientId: 'fwjhcvk765a64547acc',
      position: 1,
      active: true,
      avatar: 'http://api.adorable.io/avatars/200/Player3.png'
    },
    {
      userName: 'Player4',
      clientId: 'sfcjzgabdf7865867zsc',
      position: 1,
      active: true,
      avatar: 'http://api.adorable.io/avatars/200/Player4.png'
    },
  ],
  board: {
    pits: [],
    portals: [],
  }
}

const games = [
  // {
  //   id: 1, 
  //   gameStart: false,
  //   currentPlayer: 2,
  //   gameEnd: true,
  //   winner: 'HenkDeVries',
  //   players: [1, 2, 3],
  //   board: {
  //     pits: [],
  //     portals: [],
  //   }
  // },
  // {
  //   id: 2, 
  //   gameStart: true,
  //   currentPlayer: null,
  //   gameEnd: false,
  //   winner: null,
  //   players: [1, 2, 3],
  //   board: {
  //     pits: [],
  //     portals: [],
  //   }
  // },
  // {
  //   id: 3, 
  //   gameStart: false,
  //   currentPlayer: null,
  //   gameEnd: false,
  //   winner: null,
  //   players: [1, 2],
  //   board: {
  //     pits: [],
  //     portals: [],
  //   }
  // }
]

const newGame = { 
  id: 0,
  gameStart: false,
  currentPlayer: null,
  gameEnd: false,
  winner: null,
  players: [],
  board: {
    pits: [],
    portals: []
  }
}

module.exports = {game, games}