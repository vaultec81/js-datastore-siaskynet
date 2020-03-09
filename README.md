# Siacoin Skynet datastore
This is data store that folllows `interface-datastore` specifications, built to store data on Siacoin's skynet platform. Bin.js will start an IPFS node to test out the functionality of the datastore. Currently this is a Proof of Concept
Process:
`
Put
datastore.put("key", "Large value here") --> [Upload to skynet] --> Skynet link stored in secondary keyValue store under the original key.
Get
datastore.get("key") --> [Skynet Link] --> Fetch data from skynet
`
# License
MIT Vaultec81