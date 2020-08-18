require('dotenv').config()
fs = require('fs')
const server = require('./server')
const db = require('./models')
const request = require('request')
const axios = require('axios')
var exec = require('exec')
const BNET_ID = process.env.BNET_ID
const BNET_SECRET = process.env.BNET_SECRET

const getToken = (cb) => {
    exec(`curl -u ${BNET_ID}:${BNET_SECRET} -d grant_type=client_credentials https://us.battle.net/oauth/token`
        , (error, result, metadata) => {
            results = JSON.parse(result)
            cb(results.access_token)
        });
}

const testAuctionMethod = () => {
    console.log("Running auction house grabbing")
    getToken(access_token => {
        db.connectedRealm.findAll()
            .then(connRealm => {
                // console.log(connRealm)
                connRealm.forEach(aConRealm => {
                    let auctionHouse = aConRealm.auctionHouse
                    axios.get(`${auctionHouse}&access_token=${access_token}`)
                        .then(async results => {
                            await fs.writeFile('auctionData.js', results.data.auctions, encoding = ('utf8'))
                            status = results.status
                            statusMessage = results.statusText
                            auctionData = results.data.auctions
                            if(status === 200) {
                                var readerStream = fs.createReadStream('auctionData.js'); //Create a readable stream
                                var data = '';
                                var chunk;

                                readerStream.on('readable', function() {
                                    while ((chunk=readerStream.read()) != null) {
                                        data += chunk;
                                    }
                                });

                                readerStream.on('end', function() {
                                    console.log(data)
                                });

                                fs.unlink('auctionData.js')
                                // console.log(auctionData.length)
                                // let insertData = (itemListing) => {
                                //     setTimeout(() => {
                                //         db.item.findOrCreate({
                                //             where: {
                                //                 id: itemListing.item.id
                                //             }
                                //         })
                                //             .then((wowItem, created) => {
                                //                 if (created) {
                                //                     console.log("New item added:", wowItem.id)
                                //                 }
                                //                 // console.log("Item Data:", itemListing)
                                //                 db.pricingData.create({
                                //                     unitPrice: itemListing.unit_price || itemListing.buyout,
                                //                     quantity: itemListing.quantity,
                                //                     itemId: itemListing.item.id
                                //                 })
                                //                     .then(pricingData => {
                                //                         pricingData.setConnectedRealm(aConRealm)
                                //                     })
                                //                     .catch(err => {
                                //                         console.log("ERROR:", err)
                                //                     })
                                //             })
                                //             .catch(err => {
                                //                 console.log("ERROR:", err)
                                //             })
                                //     }, 1000)
                                // }
                                // for(let i = 0; i <= auctionData.length; i += 100) {
                                //     let auctionSubData = auctionData.slice(0, 100)
                                //     // console.log("Subdata Length:", auctionSubData.length)
                                //     auctionSubData.forEach(itemListing => {
                                //         insertData(itemListing)
                                //     })
                                // }
                                // if (auctionData.length > 0) {
                                //     auctionData.forEach(itemListing => {
                                //         insertData(itemListing)
                                //     })
                                // }
                            } else {
                                console.log("Auction House Fetch Failed:", statusMessage)
                            }
                            // setInterval(testAuctionMethod, 1 * 60 * 60 * 1000)
                        })
                        .catch(err => {
                            console.log("ERROR:", err)
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })
    })
}

//Start Express
server
testAuctionMethod()