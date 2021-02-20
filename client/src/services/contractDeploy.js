// import getWeb3 from "../getWeb3";
import compiled from "../contracts/Test.json";
//import Web3 from "web3";

//const web3 = new Web3("http://127.0.0.1:7545");
const abi = compiled.abi;
const bytecode = compiled.bytecode;

export const deploy = async function () {
  // const web3 = await getWeb3();
  const web3 = window.web3
  const ganacheAccounts = await web3.eth.getAccounts();
  // console.log("ganacheAccounts", ganacheAccounts);
  const instance = new web3.eth.Contract(abi);
  // const privKey =
  //   "21f3caf7552a1309cdc4aa745c001d480e76ef9c04a6fe410a9b9d04326364b5";

  //   const networkId = await web3.eth.net.getId()
  // const networkData = SocialNetwork.networks[networkId]

  instance
    .deploy({
      data: bytecode,
    })
    .send({
      from: ganacheAccounts[0],
    })
    .then((deployment) => {
      console.log("Contract was deployed at the following address:");
      console.log(deployment.options.address);
      call(ganacheAccounts[0], deployment.options.address);
    })
    .catch((err) => {
      console.error(err);
    });

  // const createTransaction = await web3.eth.accounts.signTransaction(
  //   {
  //     from: ganacheAccounts[0],
  //     data: tx.encodeABI(),
  //     gas: await tx.estimateGas(),
  //   },
  //   privKey
  // );
  // const createReceipt = await web3.eth.sendSignedTransaction(
  //   createTransaction.rawTransaction
  // );

  // console.log(`Contract deployed at address ${createReceipt.contractAddress}`);
};

const call = async (account, address) => {
  try {
    // Stores a given value, 5 by default.
    const web3 = window.web3
    const contract = new web3.eth.Contract(abi, address);
    const response = await contract.methods.test().call({ from: account });
    console.log(response);
    // Update state with the result.
  } catch (err) {
    console.log(err);
  }
};
