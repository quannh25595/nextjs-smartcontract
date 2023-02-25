import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const {
    account,
    enableWeb3,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  const onConnect = async () => {
    await enableWeb3();
    localStorage.setItem("connected", "injected");
  };

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined" && localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, [enableWeb3, isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  return (
    <div>
      {!account ? (
        <button onClick={onConnect} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      ) : (
        <span>
          Connected to {account.slice(0, 6)} ...{" "}
          {account.slice(account.length - 4)}
        </span>
      )}
    </div>
  );
}
