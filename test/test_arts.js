const AIArtFractionalNFT = artifacts.require("AIArtFractionalNFT");

contract("AIArtFractionalNFT", (accounts) => {
  let aiArtFractionalNFT;

  before(async () => {
    aiArtFractionalNFT = await AIArtFractionalNFT.deployed();
  });

  it("should mint a new AIArt and distribute fees to referenced artists", async () => {
    const artistAddresses = [accounts[1], accounts[2], accounts[3]];
    const ownershipPercentages = [30, 40, 30];
    const imageHash = "QmW4C4v4Kj7Yw1bGQ2Z7zjZLpXH1z8SfSCEYQYwDVC6mWm";

    const prevBalance1 = BigInt(await web3.eth.getBalance(artistAddresses[0]));
    const prevBalance2 = BigInt(await web3.eth.getBalance(artistAddresses[1]));
    const prevBalance3 = BigInt(await web3.eth.getBalance(artistAddresses[2]));
    const prevBalanceContractOwner = BigInt(await web3.eth.getBalance(accounts[0]));

    const fee = web3.utils.toWei("1", "ether");
    await aiArtFractionalNFT.mintAIArt(artistAddresses, ownershipPercentages, imageHash, { from: accounts[4], value: fee });

    const tokenId = await aiArtFractionalNFT.tokenOfOwnerByIndex(accounts[4], 0);
    const artistList = await aiArtFractionalNFT.getArtistList(tokenId);
    const ownershipPercentageList = await aiArtFractionalNFT.getOwnershipPercentageList(tokenId);
    const imageHashResult = await aiArtFractionalNFT.getImageHash(tokenId);

    assert.equal(artistList.length, 3, "Artist list length should be 3");
    assert.equal(ownershipPercentageList.length, 3, "Ownership percentage list length should be 3");
    assert.equal(imageHashResult, imageHash, "Image hash should match");

    const newBalance1 = BigInt(await web3.eth.getBalance(artistAddresses[0]));
    const newBalance2 = BigInt(await web3.eth.getBalance(artistAddresses[1]));
    const newBalance3 = BigInt(await web3.eth.getBalance(artistAddresses[2]));
    const newBalanceContractOwner = BigInt(await web3.eth.getBalance(accounts[0]));

    assert.equal(newBalance1 - prevBalance1, web3.utils.toWei("0.3", "ether"), "Artist 1 should receive 30% of fees");
    assert.equal(newBalance2 - prevBalance2, web3.utils.toWei("0.4", "ether"), "Artist 2 should receive 40% of fees");
    assert.equal(newBalance3 - prevBalance3, web3.utils.toWei("0.3", "ether"), "Artist 3 should receive 30% of fees");
    assert.equal(newBalanceContractOwner - prevBalanceContractOwner, web3.utils.toWei("0.1", "ether"), "Contract owner should receive 5% of fees");

    const ownedTokens = await aiArtFractionalNFT.tokensOf(accounts[4]);
    assert.equal(ownedTokens.length, 1, "Owner should have 1 owned token");

    const ownedTokens2 = await aiArtFractionalNFT.tokensOf(accounts[1]);
    assert.equal(ownedTokens2.length, 0, "Artist 1 should have 0 owned token");
  });
});