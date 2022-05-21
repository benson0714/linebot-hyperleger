/**
 * ConnectionProfile: getway profile of fabric network
 * CAServerName: ca server name of fabric network
 * WalletPath: identity directory path of fabric network
 * ChannelName: channel name of fabric network
 * ContractName: smart contract name of fabric network
 * DiscoveryEnabled: getway discovery enable or not
 * DiscoveryAsLocalhost: getway discovery as localhost or not
 * OrgDept: affiliation of identity at fabric network organization 
 * OrgMSPID: MSP id of OrgDept
 * OrgAdmin: organization admin identity of fabric network
 * BlockedAccounts: the list of can't be registered account on 
 */

 module.exports = {
    /**
     * Development environment 
     */
    ConnectionProfile: "1Org1PeerV142Org1GatewayConnection.json",
    CAServerName: "org1ca-api.127-0-0-1.nip.io:8084",
    WalletPath: "wallet_local/Org1",
    ChannelName: "mychannel",
    ContractName: "erc1155token",
    DiscoveryEnabled: true,
    DiscoveryAsLocalhost: true,
    OrgDept: "org1.department2",
    OrgMSPID: "Org1MSP",
    OrgAdmin: "admin"
    //BlockedAccounts: ["admin", "org1admin"],
    //TokenOwner: "tyadmin",
    //TokenSupply: "100000"

    /**
     * Production environment 
     */
    // ConnectionProfile: "connection.json",
    // CAServerName: "ca.taiyuan.com.tw",
    // WalletPath: "wallet",
    // ChannelName: "taiyuanchannel",
    // ContractName: "taiyuantoken",
    // DiscoveryEnabled: false,
    // DiscoveryAsLocalhost: false,
    // OrgDept: "org5.department1",
    // OrgMSPID: "Org5MSP"
}