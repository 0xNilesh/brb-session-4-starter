import { useState } from "react";
import pushLogo from "./assets/push.svg";
import "./App.css";
import { ethers } from "ethers";

import counterAbi from "./abis/counterAbi.json";
const contractAddress = "0x312319c3f8311EbFca17392c7A5Fef674a48Fa72";

function App() {
  const [count, setCount] = useState(0);
  const [address, setAddress] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("MEtamask not detected, pls download it");
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setProvider(provider);
      setSigner(signer);
      setAddress(address);
    }
  };

  const disconnectWallet = async () => {
    await provider.send("wallet_revokePermissions", [{
      eth_accounts: {}
    }]);

    setProvider(null);
    setSigner(null);
    setAddress(null);
  };

  const switchChain = async (chainId) => { 
    try {
      if (provider) {
        const hexChainId = `0x${chainId.toString(16)}`;
        console.log(hexChainId);
        await provider.send("wallet_switchEthereumChain", [{chainId: hexChainId}]);
        console.log("Switched chains with chainid", chainId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCounter = async () => {
    try {
      if (provider) {
        const contract = new ethers.Contract(contractAddress, counterAbi, provider);
        const counter = await contract.counter();
        setCount(counter.toString());
        console.log("counter value updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const incrementCounter = async () => {
    try {
      if (signer) {
        const contract = new ethers.Contract(contractAddress, counterAbi, signer);
        const tx = await contract.incrementCounter();
        console.log("transaction sent, waiting for confirmation");
        console.log(tx);
        const receipt = await tx.wait();
        console.log("tx success", receipt);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const decrementCounter = async () => {
    try {
      if (signer) {
        const contract = new ethers.Contract(contractAddress, counterAbi, signer);
        const tx = await contract.decrementCounter();
        console.log("transaction sent, waiting for confirmation");
        console.log(tx);
        const receipt = await tx.wait();
        console.log("tx success", receipt);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <a href="https://push.org" target="_blank" rel="noopener noreferrer">
        <img src={pushLogo} className="logo" alt="Push logo" />
      </a>
      <h1>BRB Session 4</h1>
      <div className="wallet">
        {!address ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <button onClick={disconnectWallet}>Disconnect Wallet</button>
            <h3>Address: {address}</h3>
          </div>
        )}
      </div>
      <div className="flex-body">
        <button onClick={() => switchChain(1)}>Switch to Mainnet</button>
        <button onClick={() => switchChain(11155111)}>Switch to Sepolia</button>
      </div>

      <div className="card">
        <div>
          <button onClick={getCounter}>Get Counter Value</button>
          {count !== undefined && <h4>Counter Value: {count}</h4>}
        </div>
        <div className="flex-body">
          <button onClick={incrementCounter}>Increment Counter</button>
          <button onClick={decrementCounter}>Decrement Counter</button>
        </div>
      </div>
    </>
  );
}

export default App;
