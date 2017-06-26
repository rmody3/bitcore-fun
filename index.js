console.log('\n')
var bitcore = require('bitcore-lib')

var privateKeyWIF = 'cTYHcfV4oQ3ReJ6a4s8zEV3yxeABV8SojknGejkWhkXrG4MzCw8q'

var privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF)
var address = privateKey.toAddress()

console.log(address)

var value = new Buffer('this is a way to generate an address from a string')

var hash = bitcore.crypto.Hash.sha256(value)
var bn = bitcore.crypto.BN.fromBuffer(hash)
var address2 = new bitcore.PrivateKey(bn, 'testnet').toAddress()
console.log(address2)

var Insight = require('bitcore-explorers').Insight
var insight = new Insight('testnet')

insight.getUnspentUtxos(address, function(err, utxos) {
  if (err){

  } else {
    var tx = bitcore.Transaction()
    tx.from(utxos)
    tx.to(address2, 299950000)
    tx.change(address)
    tx.fee(50000)
    tx.sign(privateKey)
    tx.serialize()

    console.log(utxos)
    console.log(tx.toObject())

    insight.broadcast(tx, function(err, returnedTxId) {
      if (err) {

      } else {
        console.log('successful broadcast: ' + returnedTxId)
      }
    }) 
  }
})
