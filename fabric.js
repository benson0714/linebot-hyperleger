/**
 * Modify History:
 */

'use strict';

const path = require('path');
const { FileSystemWallet, Gateway } = require('fabric-network');
const { Decimal } = require('decimal.js');
const { FabricError, EndorsementError, ParameterError } = require('./customError');

//setup fabric config by environment variables
let fabricConfig;
if (process.env.NODE_ENV === "production") {
    fabricConfig = require('./configs/config');
} else {
    fabricConfig = require('./configs/config_dev');
}

// 採自行設定的Log紀錄，不使用fabric-sdk的log設定
const winston = require('winston');
// Load log settings
const logConfig = require('./configs/log-config.js');
//const { throws } = require('assert');
// The Logger Category (functional area)
const logLabel = path.basename(__filename);
const logConfiguration = logConfig(logLabel);
// Create the logger
const logger = winston.createLogger(logConfiguration);

// local fabric network
// const ccpPath = path.resolve(__dirname, '1OrgLocalFabricOrg1Connection.json');
// const walletPath = path.join(process.cwd(), 'wallet_local', 'Org1');
// const channelName = "mychannel";
// const contractName = "taiyuantoken";
// const discoveryEnabled = true;
// const discoveryAsLocalhost = true;

// production fabric network
// const ccpPath = path.resolve(__dirname, 'connection.json');
// const walletPath = path.join(process.cwd(), 'wallet');
// const channelName = "taiyuanchannel";
// const contractName = "taiyuantoken";
// const discoveryEnabled = false;
// const discoveryAsLocalhost = false;

// fabric network
const ccpPath = path.resolve(__dirname, fabricConfig.ConnectionProfile);
const walletPath = path.join(process.cwd(), fabricConfig.WalletPath);
const channelName = fabricConfig.ChannelName;
const contractName = fabricConfig.ContractName;
const discoveryEnabled = fabricConfig.DiscoveryEnabled;
const discoveryAsLocalhost = fabricConfig.DiscoveryAsLocalhost;
const orgAdmin = fabricConfig.OrgAdmin;

// Create a new gateway for connecting to our peer node.
const fabricGateway = new Gateway();

// Define zero address
const zeroAddress = "0x0000000000000000000000000000000000000000";

/**
 * setup Gateway by wallet identity
 * @returns {Gateway}
 */
async function setupGateway() {
    const logPrefix = 'setupGateway()';
    logger.info(`${logPrefix} prepare to connect blockchain network.`);

    try {
        const wallet = new FileSystemWallet(walletPath);
        //logger.info(`${logPrefix} Wallet path: ${walletPath}`);

        //const walletStr = orgAdmin;
        const walletStr = "lineadmin@nchu.edu.tw";
        //logger.info(`${logPrefix} walletStr: ${walletStr}`);

        const userExists = await wallet.exists(walletStr);

        if (!userExists) {
            throw new Error(`the identity of user "${walletStr}" does not exist in the wallet!`);
        }

        //Create a new gateway for connecting to our peer node.
        //const gateway = new Gateway();

        //若web service與節點分別部署在不同主機，discovery.enabled須設定為false
        //正式主機部署asLocalhost須設定為false
        //await gateway.connect(ccpPath, {
        await fabricGateway.connect(ccpPath, {
            wallet,
            identity: walletStr,
            discovery: {
                enabled: discoveryEnabled,
                asLocalhost: discoveryAsLocalhost
            }
        });

        return fabricGateway;
    } catch (error) {
        logger.error(`${logPrefix} prepeare connect fabric with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        //throw error;
        throw new FabricError(error.message);
    }
}

/**
 * get fabric network object by gateway
 * @returns {Network}
 */
async function getFabricNetwork() {
    const logPrefix = 'getFabricNetwork()';
    try {
        const fabricNetwork = await fabricGateway.getNetwork(channelName);
        return fabricNetwork;
    } catch (error) {
        logger.error(`${logPrefix} get fabric gateway with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        //throw error;
        throw new FabricError(error.message);
    }
}

/**
 * get fabric contract object by network
 * @param {Network} network 
 * @returns {Contract}
 */
async function getFabricContract(network) {
    const logPrefix = 'getFabricContract()';
    try {
        const fabricContract = await network.getContract(contractName);
        return fabricContract;
    } catch (error) {
        logger.error(`${logPrefix} get fabric gateway with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        //throw error;
        throw new FabricError(error.message);
    }
}

/**
 * execute contract function
 * @param {Contract} contract 
 * @param {String} funcName 
 * @param {String[]} content 
 * @returns {Promise<Buffer>} 
 */
async function contractExecHelp(contract, funcName, content) {
    const logPrefix = 'contractExecHelp()';
    let chaincodeFunctionName = "";

    try {
        //Submit the specified transaction.
        let result;
        logger.info(`${logPrefix} content: ${content.toString()}`)

        switch (funcName) {
            case "signup":
                chaincodeFunctionName = "Signup";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0]);
                break;

            case "isSignup":
                chaincodeFunctionName = "IsSignup";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "getAddress":
                chaincodeFunctionName = "AddressOf";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0]);
                break;

            case "mintToken":
                chaincodeFunctionName = "Mint";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2]);
                break;

            case "mintTokenBatch":
                chaincodeFunctionName = "MintBatch";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2]);
                break;

            case "burnToken":
                chaincodeFunctionName = "Burn";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2], content[3]);
                break;

            case "burnTokenBatch":
                chaincodeFunctionName = "BurnBatch";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2], content[3]);
                break;

            case "getBalance":
                chaincodeFunctionName = "BalanceOf";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "getBalanceBatch":
                chaincodeFunctionName = "BalanceOfBatch";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "getAllBalance":
                chaincodeFunctionName = "ClientAllBalance";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0]);
                break;

            case "getRecord":
                chaincodeFunctionName = "RecordOf";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "tokenIsExist":
                chaincodeFunctionName = "TokenIsExist";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0]);
                break;

            case "getTokenList":
                chaincodeFunctionName = "TokenList";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName);
                break;

            case "getTokenSupply":
                chaincodeFunctionName = "TokenSupply";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0]);
                break;

            case "transfer":
                chaincodeFunctionName = "TransferFrom";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2], content[3], content[4]);
                break;

            case "transferBatch":
                chaincodeFunctionName = "BatchTransferFrom";
                logger.info(`${logPrefix} submitTransaction for chaincode ${chaincodeFunctionName}`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2], content[3], content[4]);
                break;

            case "approval":
                chaincodeFunctionName = "SetApprovalForAll";
                logger.info(`${logPrefix} submitTransaction for chaincode SetApprovalForAll`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0], content[1], content[2], content[3]);
                break;

            case "isApproval":
                chaincodeFunctionName = "IsApprovedForAll";
                logger.info(`${logPrefix} evaluateTransaction for chaincode IsApprovedForAll`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "setURI":
                chaincodeFunctionName = "SetURI";
                logger.info(`${logPrefix} submitTransaction for chaincode SetURI`);

                result = await contract.submitTransaction(chaincodeFunctionName, content[0]);
                break;

            case "getURI":
                chaincodeFunctionName = "URI";
                logger.info(`${logPrefix} evaluateTransaction for chaincode URI`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0]);
                break;

            case "getBalanceHistory":
                chaincodeFunctionName = "BalanceHistory";
                logger.info(`${logPrefix} evaluateTransaction for chaincode BalanceHistory`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;

            case "getApprovalHistory":
                chaincodeFunctionName = "ApprovalHistory";
                logger.info(`${logPrefix} evaluateTransaction for chaincode ApprovalHistory`);

                result = await contract.evaluateTransaction(chaincodeFunctionName, content[0], content[1]);
                break;
        }

        logger.info(`${logPrefix} Transaction has been submitted.`);

        //result: {"status":200,"message":"","payload":{"type":"Buffer","data":[84,97,105,45,89,117,97,110,32,67,111,105,110]}}
        logger.info(`${logPrefix} result: ${result.toString('utf8')}`);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} function name: ${funcName} chaincode [${chaincodeFunctionName}] execute with error.`);
        //logger.info(`error: ${JSON.stringify(error)}`)

        // the error of fabric peer node endorsement fail 
        if (error.endorsements) {
            logger.error(error.endorsements[0].message);
            logger.error(error.endorsements[0].stack);
            throw new EndorsementError(error.message);
        }

        logger.error(error.message);
        logger.error(error.stack);
        throw new EndorsementError(error.message);
    }
}

/**
 * prepare to execute blockchain chaincode
 * @param {String} funcName 
 * @param {String[]} content 
 * @returns {Promise<String>}
 */
async function contractExec(funcName, content) {
    const logPrefix = 'contractExec()';
    logger.info(`${logPrefix} prepare to execute blockchain chaincode.`);

    try {
        await setupGateway();
        const fabricNetwork = await getFabricNetwork();
        const fabricContract = await getFabricContract(fabricNetwork);
        logger.info(`${logPrefix} blockchain network connected.`);

        // chaincode executed
        const result = await contractExecHelp(fabricContract, funcName, content);

        let payloadData = "";

        if (result.length > 0) {
            const chaincodeResponse = JSON.parse(result.toString('utf8'));
            payloadData = Buffer.from(chaincodeResponse.payload.data).toString('utf8');
            logger.info(`${logPrefix} payloadData: ${payloadData}`);
        }

        return payloadData;
    } catch (error) {
        logger.error(`${logPrefix} execute fabric chaincode with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        //Disconnect from the getway.            
        fabricGateway.disconnect();
        logger.info(`${logPrefix} Disconnect from Fabric gateway.`);
    }
}

/**
 * Private Function: 
 * check parameter string is empty or not.
 * @param {String} str 
 * @returns {boolean} true | false
 */
function _stringIsEmpty(str) {
    if (typeof str !== 'string' || str.trim().length === 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Private Function: 
 * return trim string if parameter is not empty.
 * @param {String} str 
 * @returns {String} trimed string
 */
function _parameterString(str) {
    const logPrefix = '_parameterString()';
    try {
        const strIsEmpty = _stringIsEmpty(str);
        if (strIsEmpty) {
            throw new ParameterError(`The str: ${str} is empty or not typeof string.`);
        }

        const newStr = str.toString().trim();

        return newStr;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * Private Function: 
 * check parameter number Regular Expression
 * @param {String} numStr 
 * @returns {String} trimed String and match regular expression 
 */
function _parameterNumber(numStr) {
    const logPrefix = '_parameterNumber()';
    //logger.info('============= START: _parameterNumber() ===========');
    try {
        const numStrIsEmpty = _stringIsEmpty(numStr);
        if (numStrIsEmpty) {
            throw new ParameterError(`The numStr: ${numStr} is empty or not typeof string.`);
        }

        const numberStr = numStr.toString().trim();

        // 正規表示式(正浮點數)
        // 符合：1、1.2
        // 不符合：1.、-1、.1
        // const regex = /^([0-9]+[.])?[0-9]+$/gm;

        // 正規表示式(正整數)
        // 符合：0、01、001、1、102
        // 不符合：1.、0.1、-1、.1、1.1、abd123、123asc
        const regex = /^\+?([1-9]\d*)$/gm;

        if (!regex.test(numberStr)) {
            throw new ParameterError(`The number: [${numberStr}] is not match regular expression.`);
        }

        const numberInt = Decimal(numberStr);
        if (numberInt.lessThanOrEqualTo(0)) {
            throw new ParameterError('The parameter must be a positive integer.');
        }

        return numberStr;

    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        //logger.info('============= E N D: _parameterNumber() ===========');
    }
}

/**
 * Private Function: 
 * return trim user id or user address string  
 * @param {String} user user id or user address 
 * @returns {String} trimed String and not zeroAddress
 */
function _parameterUser(user) {
    const logPrefix = '_parameterUser()';
    try {
        const userStr = _parameterString(user);

        if (userStr.toLowerCase() == zeroAddress) {
            throw new ParameterError(`The parameter user id is zero address.`);
        }

        return userStr;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * Private Function: 
 * check user address is match regular expression or not
 * @param {String} address user address
 * @returns {Boolean} true | false
 */
function _isMatchAddressReg(address) {
    const logPrefix = '_isMatchAddressReg()';
    try {
        const addressStr = _parameterString(address);

        // 正規表示式(0x + sha1 hex code)
        // 符合：0x2ecabe3d50ea01e08713df71a32b35f2ca338a51
        const regex = /\b0x([0-9a-f]{40})\b/gm;
        const isMatch = regex.test(addressStr);

        return isMatch;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * Private Function: 
 * check parameter user address is signup or not 
 * @param {String} address user address 
 * @returns {Promise<String>} signup user address
 */
async function _parameterUserAddress(address) {
    const logPrefix = '_parameterUserAddress()';
    //logger.info('============= START: _parameterUserAddress() ===========');
    try {
        const userAddressStr = _parameterUser(address);

        const isMatch = _isMatchAddressReg(userAddressStr);
        if (!isMatch) {
            throw new ParameterError(`The address: [${userAddressStr}] is not match regular expression.`);
        }

        const clientIsSignup = await _isSignupHelp("", userAddressStr);
        if (!clientIsSignup) {
            throw new ParameterError(`The client address: ${userAddressStr} does not exist.`);
        }

        return userAddressStr;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        //logger.info('============= E N D: _parameterUserAddress() ===========');
    }
}

/**
 * Private Function: 
 * check parameter token is exist or not 
 * @param {String} tokenId 
 * @returns {Promise<String>} minted token id 
 */
async function _parameterTokenId(tokenId) {
    const logPrefix = '_parameterTokenId()';
    //logger.info('============= START: _parameterTokenId() ===========');
    try {
        const tokenIdStr = _parameterNumber(tokenId);
        const isExist = await _tokenIsExist(tokenIdStr);
        if (!isExist) {
            throw new ParameterError(`the token ${tokenIdStr} does not exist.`);
        }

        return tokenIdStr;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        //logger.info('============= E N D: _parameterTokenId() ===========');
    }
}

/**
 * signup by user id
 * @param {String} userId 
 * @returns {Promise<String>} user address
 */
async function signup(userId) {
    const logPrefix = 'signup()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userIDStr = _parameterString(userId);
        const userIsSignup = await _isSignupHelp(userIDStr, "");
        if (userIsSignup) {
            throw new ParameterError(`the user ${userIDStr} has been signup.`);
        }

        const args = [userIDStr];
        const result = await contractExec("signup", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}
/**
 * check user is signup or not
 * @param {String} userId 
 * @param {String} address 
 * @returns {Promise<Boolean>} true | false
 */
async function isSignup(userId, address) {
    const logPrefix = 'isSignup()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const result = await _isSignupHelp(userId, address);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * Private Function: 
 * check user is signup or not
 * @param {String} userId 
 * @param {Sring} address 
 * @returns {Promise<Boolean>} true | false
 */
async function _isSignupHelp(userId, address) {
    const logPrefix = 'isSignupHelp()';
    try {
        const isUserIDEmpty = _stringIsEmpty(userId);
        const isAddressEmpty = _stringIsEmpty(address);

        if (isUserIDEmpty && isAddressEmpty) {
            throw new ParameterError(`the user id and address are empty or not typeof string.`);
        }

        const userIDStr = userId.toString().trim();
        const userAddressStr = address.toString().trim();

        if (userIDStr.toLowerCase() == zeroAddress) {
            throw new ParameterError(`The parameter user id is zero address.`);
        }

        if (userAddressStr.toLowerCase() == zeroAddress) {
            throw new ParameterError(`The parameter address is zero address.`);
        }

        if (userAddressStr != "") {
            const isMatch = _isMatchAddressReg(userAddressStr);
            if (!isMatch) {
                throw new ParameterError(`The address: [${userAddressStr}] is not match regular expression.`);
            }
        }

        const args = [userIDStr, userAddressStr];
        const result = await contractExec("isSignup", args);

        // convert to boolean
        const isSignup = (result === "true");
        logger.info(`${logPrefix} isSignup: ${isSignup}`);

        return isSignup;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * get user address
 * @param {String} userId 
 * @returns {Promise<String>} user address
 */
async function getAddress(userId) {
    const logPrefix = 'getAddress()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const result = await _addressHelp(userId);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * Private Function: 
 * get user address
 * @param {String} userId user id
 * @returns {Promise<String>} user address
 */
async function _addressHelp(userId) {
    const logPrefix = '_addressHelp()';

    try {
        const userIDStr = _parameterUser(userId);
        const isSignup = await _isSignupHelp(userIDStr, "");
        if (!isSignup) {
            throw new ParameterError(`The client user id: ${userIDStr} does not exist.`);
        }

        const args = [userIDStr];
        const result = await contractExec("getAddress", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * get user balance of specified token. 
 * return zero if does not own specified token.
 * @param {String} address user address
 * @param {String} tokenId token id
 * @returns {Promise<String>} balance
 */
async function getBalance(address, tokenId) {
    const logPrefix = 'getBalance()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userAddressStr = await _parameterUserAddress(address);
        const tokenIdStr = await _parameterTokenId(tokenId);
        const result = await _balanceHelp(userAddressStr, tokenIdStr);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * Private Function: 
 * get user balance of specified token. 
 * return zero if does not own specified token.
 * @param {String} address user address
 * @param {String} tokenId token id
 * @returns {Promise<String>} balance
 */
async function _balanceHelp(address, tokenId) {
    const logPrefix = 'balanceHelp()';

    try {
        //const userAddressStr = await _parameterUserAddress(address);
        //const tokenIdStr = await _parameterTokenId(tokenId);
        const args = [address, tokenId];
        const result = await contractExec("getBalance", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * return user all of owned token balance 
 * @param {String} address user address
 * @returns {Promise<Object[]>} [{tokenid, balance}...]
 */
async function getAllBalance(address) {
    const logPrefix = 'getAllBalance()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userAddressStr = await _parameterUserAddress(address);
        const args = [userAddressStr];
        const result = await contractExec("getAllBalance", args);

        // deserialize result
        const deserialResult = JSON.parse(result);

        return deserialResult;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * Private Function: 
 * check token is minted or not
 * @param {String} tokenId token id
 * @returns {Promise<Boolean>} true | false
 */
async function _tokenIsExist(tokenId) {
    const logPrefix = '_tokenIsExist()';
    try {
        const tokenID = _parameterNumber(tokenId);
        const args = [tokenID];
        const result = await contractExec("tokenIsExist", args);

        // convert to boolean
        const isExist = (result === "true");
        logger.info(`${logPrefix} isExist: ${isExist.toString()}`);

        return isExist;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    }
}

/**
 * return all minted token id list on fabric network.
 * @returns {String[]}
 */
async function getTokenList() {
    const logPrefix = 'getTokenList()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const args = [];
        const result = await contractExec("getTokenList", args);
        const tokenlist = result.split(",");
        logger.info(`${logPrefix} tokenlist: ${tokenlist.toString()}`);

        return tokenlist;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * return transfer record of specified token
 * @param {String} address user address
 * @param {String} tokenId token id
 * @returns {Promise<JSON[]>}
 */
async function getTxRecord(address, tokenId) {
    const logPrefix = 'getTxRecord()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userAddressStr = await _parameterUserAddress(address);
        const tokenIdStr = await _parameterTokenId(tokenId);
        const args = [userAddressStr, tokenIdStr];
        const result = await contractExec("getRecord", args);

        // deserialize result
        const deserialResult = JSON.parse(result);

        return deserialResult;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * mint token
 * @param {Strin} address user address of owner
 * @param {String} tokenId new token id
 * @param {String} amount token supply
 * @returns {String} return "true" with success, EndorsementError with failed. 
 */
async function mintToken(address, tokenId, amount) {
    const logPrefix = 'mintToken()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userAddressStr = await _parameterUserAddress(address);
        //const tokenIDStr = await _parameterTokenId(tokenId);
        const tokenIDStr = _parameterNumber(tokenId);
        const amountStr = _parameterNumber(amount);

        const isExist = await _tokenIsExist(tokenIDStr);
        if (isExist) {
            throw new ParameterError(`the token ${tokenIDStr} is exist.`);
        }

        const args = [userAddressStr, tokenIDStr, amountStr];
        const result = await contractExec("mintToken", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * batch mint token
 * @param {String} address user address of owner
 * @param {String[]} tokenIds new token id array
 * @param {String[]} amounts token supply array
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function mintTokenBatch(address, tokenIds, amounts) {
    const logPrefix = 'mintTokenBatch()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const userAddressStr = await _parameterUserAddress(address);

        if (!Array.isArray(tokenIds)) {
            throw new ParameterError('tokenIds must be an array');
        }

        if (!Array.isArray(amounts)) {
            throw new ParameterError('amounts must be an array');
        }

        const tokenObj = JSON.parse(JSON.stringify(tokenIds));
        const amountObj = JSON.parse(JSON.stringify(amounts));

        if (tokenObj.length != amountObj.length) {
            throw new ParameterError("token ID and amounts must have the same length.");
        }

        const tokenMap = new Map();
        for (let i = 0; i < tokenObj.length; i++) {
            tokenMap.set(tokenObj[i], amountObj[i]);
        }

        const tokenArray = [];
        const amountArray = [];
        for (const iterator of tokenMap) {
            //const tokenIDStr = await _parameterTokenId(iterator[0]);
            const tokenIDStr = _parameterNumber(iterator[0]);
            const tokenAmountStr = _parameterNumber(iterator[1]);

            const isExist = await _tokenIsExist(tokenIDStr);
            if (isExist) {
                throw new ParameterError(`the token ${tokenIDStr} is exist.`);
            }

            tokenArray.push(tokenIDStr);
            amountArray.push(tokenAmountStr);
        }

        const serialTokenIds = JSON.stringify(tokenArray);
        const serialAmounts = JSON.stringify(amountArray);
        //logger.info(`${logPrefix} serialTokenIds: ${serialTokenIds}`);
        //logger.info(`${logPrefix} serialAmounts: ${serialAmounts}`);

        const args = [userAddressStr, serialTokenIds, serialAmounts];
        const result = await contractExec("mintTokenBatch", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * burn token
 * @param {String} userId user id of executor
 * @param {String} address user address of owner
 * @param {String} tokenId token id
 * @param {String} amount amount to burn
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function burnToken(userId, address, tokenId, amount) {
    const logPrefix = 'burnToken()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const executorIDStr = _parameterUser(userId);
        const executorAddress = await _addressHelp(executorIDStr);
        const userAddressStr = await _parameterUserAddress(address);
        const tokenIDStr = await _parameterTokenId(tokenId);
        const amountStr = _parameterNumber(amount);

        if (executorAddress != userAddressStr) {
            throw new ParameterError(`the executor: ${executorIDStr} has no permissions can be implemented.`);
        }

        const currentBalance = await _balanceHelp(userAddressStr, tokenIDStr);
        const decimalBalance = new Decimal(currentBalance);
        const decimalAmount = new Decimal(amountStr);

        if (decimalBalance === 0 || decimalBalance.lessThan(decimalAmount)) {
            throw new ParameterError(`The token ${tokenIDStr} balance is not enough to burn.`);
        }

        const args = [executorIDStr, userAddressStr, tokenIDStr, amountStr];
        const result = await contractExec("burnToken", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * batch burn token
 * @param {String} userId user id of executor
 * @param {String} address user address of owner
 * @param {String[]} tokenId token id array
 * @param {String[]} amount amount array to burn
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function burnTokenBatch(userId, address, tokenIds, amounts) {
    const logPrefix = 'burnTokenBatch()';
    logger.info(`${logPrefix} ==== START ====`);

    try {
        const executorIDStr = _parameterUser(userId);
        const executorAddress = await _addressHelp(executorIDStr);
        const userAddressStr = await _parameterUserAddress(address);

        if (executorAddress != userAddressStr) {
            throw new ParameterError(`the executor: ${executorIDStr} has no permissions can be implemented.`);
        }

        if (!Array.isArray(tokenIds)) {
            throw new ParameterError('tokenIds must be an array');
        }

        if (!Array.isArray(amounts)) {
            throw new ParameterError('amounts must be an array');
        }

        const tokenObj = JSON.parse(JSON.stringify(tokenIds));
        const amountObj = JSON.parse(JSON.stringify(amounts));

        if (tokenObj.length != amountObj.length) {
            throw new ParameterError("token ID and amounts must have the same length.");
        }

        const tokenMap = new Map();
        for (let i = 0; i < tokenObj.length; i++) {
            tokenMap.set(tokenObj[i], amountObj[i]);
        }

        const tokenArray = [];
        const amountArray = [];
        for (const iterator of tokenMap) {
            const tokenIDStr = await _parameterTokenId(iterator[0]);
            const tokenAmountStr = _parameterNumber(iterator[1]);
            const currentBalance = await _balanceHelp(userAddressStr, tokenIDStr);
            const decimalBalance = new Decimal(currentBalance);
            const decimalAmount = new Decimal(tokenAmountStr);

            if (decimalBalance === 0 || decimalBalance.lessThan(decimalAmount)) {
                throw new ParameterError(`The token ${tokenIDStr} balance is not enough to burn.`);
            }

            tokenArray.push(tokenIDStr);
            amountArray.push(tokenAmountStr);
        }

        const serialTokenIds = JSON.stringify(tokenArray);
        const serialAmounts = JSON.stringify(amountArray);
        //logger.info(`${logPrefix} serialTokenIds: ${serialTokenIds}`);
        //logger.info(`${logPrefix} serialAmounts: ${serialAmounts}`);

        const args = [executorIDStr, userAddressStr, serialTokenIds, serialAmounts];
        const result = await contractExec("burnTokenBatch", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * transfer token
 * @param {String} userId user id of executor
 * @param {String} senderAddress user address of sender
 * @param {String} recipientAddress user address of recipient
 * @param {String} tokenId token id
 * @param {String} amount amount to trnasfer
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function transfer(userId, senderAddress, recipientAddress, tokenId, amount) {
    const logPrefix = 'transfer()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const executorIDStr = _parameterUser(userId);
        const executorAddress = await _addressHelp(executorIDStr);
        const senderAddressStr = await _parameterUserAddress(senderAddress);
        const recipientAddressStr = await _parameterUserAddress(recipientAddress);
        const tokenIDStr = await _parameterTokenId(tokenId);
        const amountStr = _parameterNumber(amount);

        if (senderAddressStr == recipientAddressStr) {
            throw new ParameterError(`Can't transfer to self.`);
        }

        //check isApproved
        if (executorAddress != senderAddressStr) {
            const isApproved = await _isApprovalHelp(senderAddressStr, executorAddress);
            if (isApproved === false) {
                throw new ParameterError(`executor: ${executorIDStr} is not owner nor is approved.`);
            }
        }

        const currentBalance = await _balanceHelp(senderAddressStr, tokenIDStr);
        const decimalBalance = new Decimal(currentBalance);
        const decimalAmount = new Decimal(amountStr);

        if (decimalBalance === 0 || decimalBalance.lessThan(decimalAmount)) {
            throw new ParameterError(`The token ${tokenIDStr} balance is not enough to transfer.`);
        }
        
        const args = [executorIDStr, senderAddressStr, recipientAddressStr, tokenIDStr, amountStr];
        const result = await contractExec("transfer", args);
        
        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * batch transfer token
 * @param {String} userId user id of executor
 * @param {String} senderAddress user address of sender
 * @param {String} recipientAddress user address of recipient
 * @param {String[]} tokenId token id array
 * @param {String[]} amount amount array to trnasfer
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function transferBatch(userId, senderAddress, recipientAddress, tokenIds, amounts) {
    const logPrefix = 'transfer()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const executorIDStr = _parameterUser(userId);
        const executorAddress = await _addressHelp(executorIDStr);
        const senderAddressStr = await _parameterUserAddress(senderAddress);
        const recipientAddressStr = await _parameterUserAddress(recipientAddress);

        if (senderAddressStr == recipientAddressStr) {
            throw new ParameterError(`Can't transfer to self.`);
        }

        //check isApproved
        if (executorAddress != senderAddressStr) {
            const isApproved = await _isApprovalHelp(senderAddressStr, executorAddress);
            if (isApproved === false) {
                throw new ParameterError(`executor: ${executorIDStr} is not owner nor is approved.`);
            }
        }

        if (!Array.isArray(tokenIds)) {
            throw new ParameterError('tokenIds must be an array');
        }

        if (!Array.isArray(amounts)) {
            throw new ParameterError('amounts must be an array');
        }

        const tokenObj = JSON.parse(JSON.stringify(tokenIds));
        const amountObj = JSON.parse(JSON.stringify(amounts));

        if (tokenObj.length != amountObj.length) {
            throw new ParameterError("token ID and amounts must have the same length.");
        }

        const tokenMap = new Map();
        for (let i = 0; i < tokenObj.length; i++) {
            tokenMap.set(tokenObj[i], amountObj[i]);
        }

        const tokenArray = [];
        const amountArray = [];
        for (const iterator of tokenMap) {
            const tokenIDStr = await _parameterTokenId(iterator[0]);
            const tokenAmountStr = _parameterNumber(iterator[1]);
            const currentBalance = await _balanceHelp(senderAddressStr, tokenIDStr);
            const decimalBalance = new Decimal(currentBalance);
            const decimalAmount = new Decimal(tokenAmountStr);

            if (decimalBalance === 0 || decimalBalance.lessThan(decimalAmount)) {
                throw new ParameterError(`The token ${tokenIDStr} balance is not enough to transfer.`);
            }

            tokenArray.push(tokenIDStr);
            amountArray.push(tokenAmountStr);
        }

        const serialTokenIds = JSON.stringify(tokenArray);
        const serialAmounts = JSON.stringify(amountArray);

        const args = [executorIDStr, senderAddressStr, recipientAddressStr, serialTokenIds, serialAmounts];
        const result = await contractExec("transferBatch", args);
        
        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}



/**
 * setup approval to other user
 * @param {String} userId user id of executor
 * @param {String} ownerAddress owner address
 * @param {String} operatorAddress operator address of be approved 
 * @param {String} isApproved true | false
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
 async function setApproval(userId, ownerAddress, operatorAddress, isApproved){
    const logPrefix = 'setApproval()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const executorIDStr = _parameterUser(userId);
        const executorAddress = await _addressHelp(executorIDStr);
        const ownerAddressStr = await _parameterUserAddress(ownerAddress);
        const operatorAddressStr = await _parameterUserAddress(operatorAddress);
        const approveStr = _parameterString(isApproved);

        if (executorAddress != ownerAddressStr) {
            throw new ParameterError(`the executor: ${executorIDStr} has no permissions can be implemented.`);
        }

        if (ownerAddressStr == operatorAddressStr) {
            throw new ParameterError(`can't setting approval status for self`);
        }

        if (approveStr.toLowerCase() != "true" && approveStr.toLowerCase() != "false") {
            throw new ParameterError(`isApproved must be boolean.`);
        }

        const args = [executorIDStr, ownerAddressStr, operatorAddressStr, approveStr.toLowerCase()];
        const result = await contractExec("approval", args);

        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * check operator is approved or not
 * @param {String} ownerAddress owner address
 * @param {String} operatorAddress operator address of be approved 
 * @returns {Promise<Boolean>} true | false
 */
async function isApproval(ownerAddress, operatorAddress) {
    const logPrefix = 'isApproval()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const ownerAddressStr = await _parameterUserAddress(ownerAddress);
        const operatorAddressStr = await _parameterUserAddress(operatorAddress);
        const result = await _isApprovalHelp(ownerAddressStr, operatorAddressStr);
        
        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * Private Function: 
 * check operator is approved or not
 * @param {String} ownerAddress owner address
 * @param {String} operatorAddress operator address of be approved 
 * @returns {Promise<Boolean>} true | false
 */
async function _isApprovalHelp(ownerAddress, operatorAddress) {
    const logPrefix = '_isApproval()';
    try {
        const args = [ownerAddress, operatorAddress];
        const result = await contractExec("isApproval", args);

        // convert to boolean
        const isApproved = (result === "true");
        logger.info(`${logPrefix} isApproved: ${isApproved}`);

        return isApproved;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
    }
}

/**
 * setup token URI
 * @param {String} uri 
 * @returns {String} return "true" with success, EndorsementError with failed.
 */
async function setURI(uri) {
    const logPrefix = 'setURI()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const uriStr = _parameterString(uri);

        if (!uriStr.includes("{id}")){
            throw new ParameterError(`uri should be contain '{id}'`);
        }

        const args = [uriStr];
        const result = await contractExec("setURI", args);
        
        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

/**
 * get the specified token uri 
 * @param {String} tokenId token id
 * @returns {Promise<String>} token uri
 */
async function getURI(tokenId) {
    const logPrefix = 'getURI()';
    logger.info(`${logPrefix} ==== START ====`);
    try {
        const tokenIDStr = await _parameterTokenId(tokenId);
        const args = [tokenIDStr];
        const result = await contractExec("getURI", args);
        
        return result;
    } catch (error) {
        logger.error(`${logPrefix} execute with error.`);
        logger.error(error.message);
        logger.error(error.stack);
        throw error;
    } finally {
        logger.info(`${logPrefix} ==== E N D ====`);
    }
}

module.exports = {
    getAddress: getAddress,
    signup: signup,
    isSignup: isSignup,
    getBalance: getBalance,
    getAllBalance: getAllBalance,
    getTokenList: getTokenList,
    getTxRecord: getTxRecord,
    mintToken: mintToken,
    mintTokenBatch: mintTokenBatch,
    burnToken: burnToken,
    burnTokenBatch: burnTokenBatch,
    transfer: transfer,
    transferBatch: transferBatch,
    setApproval: setApproval,
    isApproval: isApproval,
    setURI: setURI,
    getURI: getURI
}