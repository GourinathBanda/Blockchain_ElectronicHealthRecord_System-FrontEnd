// import fs from 'fs';
import Web3 from 'web3';
import Test from '../contracts/Test.json';
const web3 = new Web3('http://localhost:7545');

// const bytecode = import('dmr-frontend/contracts/build/test_sol_Test.bin');
// const abi = JSON.parse(import('dmr-frontend/contracts/build/test_sol_Test.abi'));
console.log(Test);
const compiled = Test;
const abi = compiled.abi;
const bytecode = compiled.bytecode;

export const deploy = async function () {
    const ganacheAccounts = await web3.eth.getAccounts();

    const test = new web3.eth.Contract(abi);

    test.deploy({
        data: bytecode
    }).send({
        from: ganacheAccounts[0],
    }).then((deployment) => {
        console.log('Contract was deployed at the following address:');
        console.log(deployment.options.address);
    }).catch((err) => {
        console.error(err);
    });
};