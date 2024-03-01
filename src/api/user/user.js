const { Console } = require('console');
const express = require('express');
const router = express.Router();
const axios = require('axios')
const { Web3 } = require('web3');

var constants = require('../../constants');

router.post('/userInfo', async (req, res) => {

    try {
        var address = req.body.address

        if (address === undefined || address === "") {
            throw "Address must be set";
        }

        //given the address, call the PuzzleContract function of getUserInfo. 
        var web3 = new Web3(constants.GANACHE_URL);

        const ABI = require('../../contracts/PuzzleContract.json');
        console.log("ABI: " + ABI)
        const contractAddress = require('../../contracts/contracts.json')["PuzzleContract"];
        console.log("contractAddress: " + contractAddress)

        var contract = new web3.eth.Contract(ABI, contractAddress);
        // Get the current value of my number
        var result = undefined;
        try {
            result = await contract.methods.getUserInfo(address).call();
        } catch (e) {
            throw "Error during getUserInfo contract call with input address " + address + ": " + e
        }

        if (result === undefined)
            throw "User not found";
        if (result === '0' || result == 0) {
            res.json({})
        } else {
            var userJsonHash = result;  //web3.utils.hexToAscii(result.toString(16))

            //invoke post request to localhost:3000/api/ipfs/getPinnedJson
            await axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                hash: userJsonHash
            }).then((response) => {
                res.json(response.data)
            }).catch(function (error) {
                throw "Cannot read from IPFS: " + error.response.data;
            });

        }
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/register', async (req, res) => {
    try {

        var address = req.body.address;
        var username = req.body.username;
        if (address === undefined || address === "") {
            throw "Address must be set";

        }

        if (username === undefined || username === "") {
            throw "Username must be set";
        }

        //invoke post request to localhost:3000/api/ipfs/getFiles
        await axios.post("http://localhost:3000/api/ipfs/getFiles", { username: username, type: 'profile' }).then((response) => {
            if (response.data.count > 0)
                throw "Username already used";
        });


        //given the address, call the PuzzleContract function of getUserInfo. 
        var web3 = new Web3(constants.GANACHE_URL);

        const ABI = require('../../contracts/PuzzleContract.json');
        //console.log("ABI: " + ABI)
        const contractAddress = require('../../contracts/contracts.json')["PuzzleContract"];
        //console.log("contractAddress: " + contractAddress)

        var contract = new web3.eth.Contract(ABI, contractAddress);
        // Get the current value of my number
        var result = await contract.methods.getUserInfo(address).call();
        if (result != 0) {
            throw "User already registered";
        } else {

            var userJson = {
                "UserAddress": address,
                "Username": username,
                "PrimaryBalance": 0,
                "SecondaryBalance": 0,
                "Points": 0,
                "CurrentLevel": 0,
                "RunCompleted": 0,
                "AmethystNumber": 0,
                "GrimoireNumber": 0,
                "PotionNumber": 0
            }
            try {
                //invoke post request to localhost:3000/api/ipfs/pinJson
                axios.post("http://localhost:3000/api/ipfs/pinJson", {
                    jsonObject: userJson,
                    filename: username,
                    type: 'profile'
                }).then((response) => {
                    let ret = response.data;
                    console.log("User registered in IPFS with CID: " + ret);
                    res.json(ret);
                });

            } catch (error) {
                throw "Cannot read from IPFS: " + error.response.data;
            }
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/getDifficulty', async (req, res) => {
    try {

        var users;
        //invoke post request to localhost:3000/api/ipfs/getFiles
        await axios.post("http://localhost:3000/api/ipfs/getFiles", { type: 'profile' }).then((response) => {
            users = response.data.rows;
        });

        var totalScore = 0;

        for (var i = 0; i < users.length; i++) {

            await axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                hash: users[i].ipfs_pin_hash
            }).then((response) => {
                totalScore += response.data.Points
            }).catch(function (error) {
                throw "Cannot read from IPFS: " + error.response.data;
            });
        }

        var averageScore = totalScore / users.length;

        if (averageScore < constants.MIN_SCORE)
            res.json(0)
        else if (averageScore >= constants.MIN_SCORE && averageScore < constants.MAX_SCORE)
            res.json(1)
        else
            res.json(2)

    } catch (e) {
        res.status(500).send("Cannot get difficulty: " + e);
    }
});


router.post('/getUserProfiles', async (req, res) => {
    try {

        var users;
        //invoke post request to localhost:3000/api/ipfs/getFiles
        await axios.post("http://localhost:3000/api/ipfs/getFiles", { type: 'profile' }).then((response) => {
            users = response.data.rows;
        });

        var players = [];

        for (var i = 0; i < users.length; i++) {

            await axios.post("http://localhost:3000/api/ipfs/getPinnedJson", {
                hash: users[i].ipfs_pin_hash
            }).then((response) => {
                players.push(response.data)
            }).catch(function (error) {
                throw "Cannot read from IPFS: " + error.response.data;
            });
        }

        res.json(players)

    } catch (e) {
        res.status(500).send("Cannot get user profiles: " + e);
    }
});

router.post('/deleteUser', async (req, res) => {
    try {
        ipfsCid = req.body.ipfsCid;
        //invoke post request to localhost:3000/api/ipfs/getFiles
        await axios.post("http://localhost:3000/api/ipfs/unpinJson", { hash: ipfsCid }).then((response) => {
            console.log("User " + ipfsCid + " correctly unpinned: " + response.data);
            res.json(response.data)
        }).catch(error => {
            throw error.response.data;
        });

    } catch (e) {
        res.status(500).send("Cannot remove user: " + e);
    }
});

router.post('/updateUser', async (req, res) => {
    try {

        var userJson = req.body.userJson;
        var oldIpfsCid = undefined;
        try {
            //given the address, call the PuzzleContract function of getUserInfo. 
            var web3 = new Web3(constants.GANACHE_URL);
            const ABI = require('../../contracts/PuzzleContract.json');
            const contractAddress = require('../../contracts/contracts.json')["PuzzleContract"];
            var contract = new web3.eth.Contract(ABI, contractAddress);
            var oldIpfsCid = await contract.methods.getUserInfo(userJson.UserAddress).call();
        } catch (error) {
            throw "Cannot retrieve user ipfsCid: " + error;
        }

        if (oldIpfsCid === undefined || oldIpfsCid === "") {
            throw "User not found";
        }

        var newIpfsCid;
        //invoke post request to localhost:3000/api/ipfs/pinJson
        axios.post("http://localhost:3000/api/ipfs/pinJson", {
            jsonObject: userJson,
            filename: userJson.Username,
            type: 'profile'
        }).then(async function (response) {
            newIpfsCid = response.data;
            console.log("User updated in IPFS with CID: " + newIpfsCid);
            if (oldIpfsCid !== newIpfsCid) {

                await axios.post("http://localhost:3000/api/ipfs/unpinJson", { hash: oldIpfsCid }).then((response) => {
                    console.log("User " + oldIpfsCid + " correctly unpinned: " + response.data);
                }).catch(async function (error) {

                    console.log("Rolling back user")
                    await axios.post("http://localhost:3000/api/ipfs/unpinJson", { hash: newIpfsCid }).then((response) => {
                        console.log("User " + newIpfsCid + " correctly unpinned: " + response.data);
                    }).catch(err => {
                        throw "Cannot rollback: " + err.response.data;

                    });
                    console.log(error)
                    throw error.response.data + ": user rolled back";
                });
            }

            res.json({ Item1: newIpfsCid, Item2: oldIpfsCid, Item3: userJson.Username });

        }).catch(error => {
            throw error.response.data;
        });


    } catch (e) {
        res.status(500).send("Cannot update user: " + e);
    }
});

router.post('/pinUserByHash', async (req, res) => {
    try {
        ipfsCid = req.body.ipfsCid
        filename = req.body.username

        //invoke post request to localhost:3000/api/ipfs/pinByHash
        await axios.post("http://localhost:3000/api/ipfs/pinByHash", { hash: ipfsCid, filename: filename, type: 'profile' }).then((response) => {
            console.log("User " + ipfsCid + " correctly pinned: " + response.data);
            res.json(response.data)
        }).catch(error => {
            throw error.response.data;
        });

    } catch (e) {
        res.status(500).send("Cannot pin user by hash: " + e);
    }
});

// Export the router
module.exports = router;