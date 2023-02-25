import { useCallback, useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("");
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();

  const contractAddress = chainIdHex
    ? contractAddresses[parseInt(chainIdHex)][0]
    : null;

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumPlayers } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const handleEnterRaffle = async () => {
    await enterRaffle({
      onSuccess: async (tx) => {
        await tx.wait(1);
        dispatch({
          type: "info",
          message: "Transaction Complete!",
          title: "Tx Notification",
          position: "topR",
          icon: "bell",
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  const updateUI = useCallback(async () => {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayers(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }, [getEntranceFee, getNumPlayers, getRecentWinner]);

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, updateUI]);

  return (
    <div>
      Hi from LotteryEntrance
      {contractAddress ? (
        <div>
          <button onClick={handleEnterRaffle}>Enter Raffle</button>
          <div>
            Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number of Players: {numPlayers}</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}
