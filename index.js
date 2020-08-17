const server = require('./server')
const db = require('./models')

const testAuctionMethod = () => {
    db.connectedRealms.findAll()
        .then(connRealm => {
            connRealm.forEach(aConRealm => {
                console.log(aConRealm.auctionHouse)
            })
        })
}

//Start Express
server

//Run console.log every 5 mintes
setInterval(testAuctionMethod, 5000)