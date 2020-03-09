
const IPFS = require('ipfs')
const Repo = require('ipfs-repo')
const os = require('os')
const Path = require('path')
const { globSource } = IPFS

const IDatastore = require('interface-datastore')
const sortAll = IDatastore.utils.sortAll
const Key = IDatastore.Key
const Errors = IDatastore.Errors
const fsLock = require('ipfs-repo/src/lock')
const Crypto = require('crypto')

// Create our custom options
const customRepositoryOptions = {

    /**
     * IPFS nodes store different information in separate storageBackends, or datastores.
     * Each storage backend can use the same type of datastore or a different one — you
     * could store your keys in a levelDB database while everything else is in files,
     * for example. (See https://github.com/ipfs/interface-datastore for more about datastores.)
     */
    storageBackends: {
        root: require('datastore-fs'), // version and config data will be saved here
        blocks: require("./SkynetDatastore"),
        keys: require('datastore-fs'),
        datastore: require('datastore-fs')
    },

    /**
     * Storage Backend Options will get passed into the instantiation of their counterpart
     * in `storageBackends`. If you create a custom datastore, this is where you can pass in
     * custom constructor arguments. You can see an S3 datastore example at:
     * https://github.com/ipfs/js-datastore-s3/tree/master/examples/full-s3-repo
     *
     * NOTE: The following options are being overriden for demonstration purposes only.
     * In most instances you can simply use the default options, by not passing in any
     * overrides, which is recommended if you have no need to override.
     */
    storageBackendOptions: {
        root: {
            extension: '.ipfsroot', // Defaults to ''. Used by datastore-fs; Appended to all files
            errorIfExists: false, // Used by datastore-fs; If the datastore exists, don't throw an error
            createIfMissing: true // Used by datastore-fs; If the datastore doesn't exist yet, create it
        },
        blocks: {
            sharding: false, // Used by IPFSRepo Blockstore to determine sharding; Ignored by datastore-fs
            extension: '.ipfsblock', // Defaults to '.data'.
            errorIfExists: false,
            createIfMissing: true, 
            "url": "https://sialoop.net/"
        },
        keys: {
            extension: '.ipfskey', // No extension by default
            errorIfExists: false,
            createIfMissing: true
        },
        datastore: {
            extension: '.ipfsds', // No extension by default
            errorIfExists: false,
            createIfMissing: true
        }
    },

    /**
     * A custom lock can be added here. Or the build in Repo `fs` or `memory` locks can be used.
     * See https://github.com/ipfs/js-ipfs-repo for more details on setting the lock.
     */
    lock: fsLock
};
(async () => {
    var repo = new Repo("./ipfs", customRepositoryOptions)
    let node = await IPFS.create({
        repo
    })
    
    var ag = node.add(Crypto.randomBytes(2048*1024), {
        blockWriteConcurrency: 30
    });
    for await(var e of ag) {
        console.log(e.cid.toString())
    }
    //for await (var out of node.cat("QmQqBNJwgKF514Uwn5fsF7v3RU7q7EwxyWqHNZg8Pn1dKt")) {
        //console.log(out.length)
    //}

})()
