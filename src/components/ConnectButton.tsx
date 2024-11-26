import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import CornerDots from "./CornerDots";

const ConnectButton: React.FC = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useWeb3ModalAccount();

  return (
    <>
      {isConnected ? (
        <w3m-account-button />
      ) : (
        <button
          onClick={() => open()}
          className="relative flex items-center justify-center px-6 py-2 text-xs tracking-widest text-white/80 transition-all duration-300 bg-[#7042f88b]/5 border border-[#7042f88b]/20 hover:bg-[#7042f88b]/10 hover:border-[#7042f88b]/30 hover:text-white focus:outline-none uppercase"
        >
          <span className="relative z-10">Connect Wallet</span>
          <CornerDots />
        </button>
      )}
    </>
  );
};

export default ConnectButton;
