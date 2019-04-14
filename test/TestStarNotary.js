const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;
var lastStarId;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    let starNotary = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let user1 = accounts[1];
    let starId = 6;
    lastStarId = starId;
    let starName = 'star 6';
    await  starNotary.createStar('test star', starId, {from: user1});
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    assert.equal(await starNotary.name.call(), 'Star Token');
    assert.equal(await starNotary.symbol.call(), 'STT');
});

it('lets 2 users exchange stars', async() => {
    let starNotary = await StarNotary.deployed();
    // 1. create 2 Stars with different tokenId
    let user1 = accounts[1];
    let starId1 = lastStarId + 1;
    lastStarId = starId1;
    let starName1 = 'star 1';
    await  starNotary.createStar(starName1, starId1, {from: user1});

    let user2 = accounts[2];
    let starId2 = lastStarId + 1;
    lastStarId = starId2;
    let starName2 = 'star 2';
    await  starNotary.createStar(starName2, starId2, {from: user2});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await starNotary.exchangeStars(starId1, starId2, {from: user1});
    // 3. Verify that the owners changed
    assert.equal(await starNotary.ownerOf(starId1), user2);
    assert.equal(await starNotary.ownerOf(starId2), user1);
});

it('lets a user transfer a star', async() => {
    let starNotary = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let user1 = accounts[1];
    let starId1 = lastStarId + 1;
    lastStarId = starId1;
    let starName1 = 'star 1';
    await  starNotary.createStar(starName1, starId1, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    let user2 = accounts[2];
    await starNotary.transferStar(user2, starId1, {from: user1});
    // 3. Verify the star owner changed.
    assert.equal(await starNotary.ownerOf(starId1), user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    let starNotary = await StarNotary.deployed();
    // 1. create a Star with different tokenId
    let user1 = accounts[1];
    let starId1 = lastStarId + 1;
    lastStarId = starId1;
    let starName1 = 'star 1';
    await  starNotary.createStar(starName1, starId1, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    let star = await starNotary.lookUptokenIdToStarInfo(starId1);
    // 3. Verify if you Star name is the same
    assert.equal(star, starName1);
});