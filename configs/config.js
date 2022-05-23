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
 */

 module.exports = {
    /**
     * Development environment 
     */
    // ConnectionProfile: "1OrgLocalFabricOrg1Connection.json",
    // CAServerName: "ca.taiyuan.com.tw",
    // WalletPath: "wallet_local/Org1",
    // ChannelName: "mychannel",
    // ContractName: "taiyuantoken",
    // DiscoveryEnabled: true,
    // DiscoveryAsLocalhost: true,
    // OrgDept: "org1.department2",
    // OrgMSPID: "Org1MSP"

    /**
     * Production environment 
     */
    ConnectionProfile: "connection.json",
    CAServerName: "ca.nchu.edu.tw",
    WalletPath: "wallet",
    ChannelName: "linebotchannel",
    ContractName: "erc1155token",
    DiscoveryEnabled: false,
    DiscoveryAsLocalhost: false,
    OrgDept: "org1.department2",
    OrgMSPID: "Org1MSP",
    OrgAdmin: "admin",
    BlockedAccounts: ["admin", "org1admin"],
    //TokenOwner: "tyadmin",
    //TokenSupply: "1000000"
}