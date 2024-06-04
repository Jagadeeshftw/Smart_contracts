const assert = require("assert");
const { Web3 } = require("web3");
const { abi, evm } = require("../compile");
const ganache = require("ganache");

const web3 = new Web3(ganache.provider({ port: 8545 }));

let INITIAL_STRING = 'Hi, There';
let accounts;

let txReceipt;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  //initialize contract
  const myContract = new web3.eth.Contract(abi);

  //create contract deployer
  const deployer = myContract.deploy({
    data: evm.bytecode.object, //bytecode must start with 0x
    arguments: [INITIAL_STRING], //starting number for the constructor in the contract
  });

  //send transaction to the network
  txReceipt = await deployer.send({ from: accounts[0], gas: "5000000" });
});

describe("Inbox", () => {
  it("deploy the contract", () => {
    //print deployed contract address
    assert.ok(txReceipt.options.address);
  });

  it("has a default string", async () => {
    //print deployed contract address
    const result = await txReceipt.methods.message().call();

    assert.equal(result, INITIAL_STRING);
  });

  it("can change a default string", async () => {
    //print deployed contract address
    await txReceipt.methods.setMessage('Bye there').send({ from: accounts[0] });
    const result = await txReceipt.methods.message().call();
    assert.equal(result, 'Bye there');
  });
});
