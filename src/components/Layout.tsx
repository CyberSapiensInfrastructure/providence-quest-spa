import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useDispatch, useSelector } from "react-redux";
import { ethers, providers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import {
  resetProvider,
  setProvider,
  setSigner,
} from "../app/slices/walletProvider";
import StackedNotifications from "./Notification";
import ShuffleLoader from "./Loader";
import CountdownTimer from "./CountdownTimer";
import {
  startTwitterAuth,
  checkTwitterLike,
  setAccessToken,
} from "../app/slices/twitterSlice";
import type { RootState } from "../app/store";
import type { AppDispatch } from "../app/store";
import { QUESTS } from "../constants/quests";
import QuestItem from "./QuestItem";
import { twitterService } from "../services/twitterService";
import axios from "axios";

const BackgroundCompiler = React.lazy(
  () => import("../components/BackgroundCompiler")
);

const DisconnectedMessage = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <div className="text-center px-6 py-16 w-full backdrop-blur-sm border-y border-[#7042f88b]/5">
      <div className="max-w-md mx-auto space-y-2 uppercase">
        <p className="text-2xl font-light tracking-tight">
          <span className="animate-pulse inline-block bg-gradient-to-r from-[#7042f88b] to-[#9f7aea] bg-clip-text text-transparent">
            Connect Wallet
          </span>
        </p>
        <p className="text-white/40 text-xs">to access providence</p>
      </div>
    </div>
  </div>
);

const Layout: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [formInputs, setFormInputs] = useState({
    twitter: "",
    telegram: "",
    discord: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const [isCopied, setIsCopied] = useState(false);
  const { hasLikedTargetTweet, loading, error } = useSelector(
    (state: RootState) => state.twitter
  );
  const [twitterUsername, setTwitterUsername] = useState("");
  const [isCheckingTwitter, setIsCheckingTwitter] = useState(false);

  useEffect(() => {
    const handleDisconnect = () => {
      dispatch(resetProvider());
      setWalletAddress("");
      setFormInputs({
        twitter: "",
        telegram: "",
        discord: "",
      });
    };

    if (walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(
        walletProvider as providers.ExternalProvider
      );
      dispatch(setProvider(web3Provider));
      const signer = web3Provider.getSigner();
      dispatch(setSigner(signer));

      if ("on" in walletProvider && "removeListener" in walletProvider) {
        (walletProvider as any).on("disconnect", handleDisconnect);
        return () => {
          (walletProvider as any).removeListener(
            "disconnect",
            handleDisconnect
          );
        };
      }
    } else {
      handleDisconnect();
    }
  }, [walletProvider, dispatch]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletProvider) {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider as providers.ExternalProvider
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      }
    };
    getAddress();
  }, [walletProvider]);

  const handleInputChange =
    (field: keyof typeof formInputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormInputs((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  useEffect(() => {
    const handleTwitterCallback = (event: MessageEvent) => {
      if (event.data.type === "TWITTER_AUTH_SUCCESS") {
        const { accessToken } = event.data;
        dispatch(setAccessToken(accessToken));
        if (twitterUsername) {
          dispatch(
            checkTwitterLike({ username: twitterUsername, accessToken })
          );
        }
      }
    };

    window.addEventListener("message", handleTwitterCallback);
    return () => window.removeEventListener("message", handleTwitterCallback);
  }, [dispatch, twitterUsername]);

  const handleTwitterCheck = async () => {
    if (!twitterUsername.trim()) return;

    setIsCheckingTwitter(true);
    try {
      console.log("Starting Twitter check for:", twitterUsername);

      // Auth URL'i al ve yeni pencerede aç
      const authUrl = await twitterService.startAuth();
      console.log("Opening auth URL:", authUrl);

      // Yeni pencere aç
      const authWindow = window.open(
        authUrl,
        "Twitter Auth",
        "width=600,height=600"
      );

      if (!authWindow) {
        console.error("Popup was blocked");
        return;
      }

      // Auth window kapatıldığında kontrol et
      const checkWindowClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindowClosed);
          console.log("Auth window closed");
          setIsCheckingTwitter(false);
        }
      }, 500);
    } catch (error) {
      console.error("Error during Twitter check:", error);
      setIsCheckingTwitter(false);
    }
  };

  // Auth callback listener'ı ekleyelim
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Origin kontrolü
      if (event.origin !== window.location.origin) {
        console.log("Ignoring message from unknown origin:", event.origin);
        return;
      }

      console.log("Received message:", event.data);

      if (event.data.type === "TWITTER_AUTH_SUCCESS") {
        console.log("Auth success, got token:", event.data.accessToken);

        try {
          setIsCheckingTwitter(true);

          // Like kontrolü yap
          const response = await axios.post(
            "http://localhost:3001/api/check-twitter-like",
            {
              username: twitterUsername,
              accessToken: event.data.accessToken,
            }
          );

          console.log("Like check response:", response.data);

          if (response.data.success && response.data.hasLiked) {
            // Quest'i tamamlandı olarak işaretle
            console.log("Quest completed!");
            dispatch(setAccessToken(event.data.accessToken));
            // Redux state'i güncelle
            dispatch({
              type: "twitter/setLikeStatus",
              payload: true,
            });
          } else {
            console.log("Tweet not liked yet");
          }
        } catch (error) {
          console.error("Error checking like:", error);
        } finally {
          setIsCheckingTwitter(false);
        }
      } else if (event.data.type === "TWITTER_AUTH_ERROR") {
        console.error("Auth error:", event.data.error);
        setIsCheckingTwitter(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch, twitterUsername]);

  // Örnek tarih - bunu istediğiniz tarihe ayarlayabilirsiniz
  const questEndDate = new Date("2024-12-31T23:59:59");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2 saniye sonra reset
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/90 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-['Inter']">
      <BackgroundCompiler />
      <ShuffleLoader />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto md:px-2 px-6 py-4 flex justify-between items-center">
          <a
            href="https://playprovidence.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.2em] hover:text-[#7042f88b] transition-all duration-300 group"
          >
            <div className="w-2 h-2 bg-[#7042f88b]/30 group-hover:bg-[#7042f88b] transition-all duration-300" />
            PLAYPROVIDENCE.IO
          </a>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="mt-16">
        <main className="flex-1 max-w-xl mx-auto w-full px-6 py-12 relative">
          {/* Slogan */}
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.2em] text-white/40 uppercase">
              Do it for Providence
            </p>
          </div>

          {!walletProvider && <DisconnectedMessage />}

          <div
            className={`${
              !walletProvider ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            {/* Timer Section */}
            <div className="mb-10">
              <CountdownTimer targetDate={questEndDate} />
            </div>

            {/* Wallet Address Display - Only show when connected */}
            {walletProvider && walletAddress && (
              <div className="mb-8">
                <div className="bg-[#7042f88b]/5 border border-[#7042f88b]/20 rounded px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                      Connected Wallet
                    </span>
                    <span className="text-[10px] text-[#7042f88b]">
                      Verified ✓
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="font-mono text-sm text-white/70 tracking-wider truncate">
                      {walletAddress}
                    </div>
                    <button
                      onClick={() => copyToClipboard(walletAddress)}
                      className="group relative flex items-center"
                    >
                      {isCopied ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#7042f88b] hover:text-[#9f7aea] transition-colors duration-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                      )}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {isCopied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Twitter Input with Check Button */}
              <div className="space-y-1">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    className="w-full bg-transparent py-1.5 text-sm font-light tracking-wider focus:outline-none text-white/80 placeholder:text-white/20 focus:text-[#9f7aea]"
                    placeholder="Twitter Username"
                    disabled={!walletProvider || isCheckingTwitter}
                  />
                  <button
                    onClick={handleTwitterCheck}
                    disabled={
                      !twitterUsername.trim() ||
                      isCheckingTwitter ||
                      !walletProvider
                    }
                    className="absolute right-0 px-3 py-1 text-xs text-white/60 hover:text-white/80 disabled:opacity-50 disabled:hover:text-white/60"
                  >
                    {isCheckingTwitter ? (
                      <span className="text-yellow-500">Checking...</span>
                    ) : hasLikedTargetTweet ? (
                      <span className="text-green-500">Verified ✓</span>
                    ) : (
                      "Check"
                    )}
                  </button>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7042f88b]/30 to-transparent" />
              </div>

              {/* Diğer input'lar */}
              {[
                { key: "telegram" as const, placeholder: "Telegram" },
                { key: "discord" as const, placeholder: "Discord" },
              ].map(({ key, placeholder }) => (
                <div key={key} className="space-y-1">
                  <input
                    type="text"
                    value={formInputs[key]}
                    onChange={handleInputChange(key)}
                    className="w-full bg-transparent py-1.5 text-sm font-light tracking-wider focus:outline-none text-white/80 placeholder:text-white/20 focus:text-[#9f7aea]"
                    placeholder={placeholder}
                    disabled={!walletProvider}
                  />
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7042f88b]/30 to-transparent" />
                </div>
              ))}
            </div>

            {/* Quest Section */}
            <div className="mt-12 space-y-4">
              <h2 className="text-xs tracking-widest text-[#7042f88b] uppercase">
                QUESTS
              </h2>
              <div className="space-y-3">
                <QuestItem
                  quest={QUESTS.TWITTER_LIKE}
                  isVerifying={loading}
                  isCompleted={hasLikedTargetTweet}
                />
                <QuestItem
                  quest={QUESTS.TWITTER_FOLLOW}
                  isVerifying={false}
                  isCompleted={false}
                />
                <QuestItem
                  quest={QUESTS.TELEGRAM}
                  isVerifying={false}
                  isCompleted={false}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex md:justify-end justify-center">
              <button
                className="md:w-fit w-full py-3 px-6 bg-[#7042f88b]/5 border border-[#7042f88b]/20 hover:bg-[#7042f88b]/10 hover:border-[#7042f88b]/30 disabled:opacity-50 disabled:hover:bg-[#7042f88b]/5 transition-all duration-300 ease-out text-xs tracking-widest"
                disabled={!walletProvider}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Gaming Company Footer */}
      <footer className="border-t border-[#7042f88b]/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#7042f88b]" />
                <span className="text-sm tracking-[0.2em] text-white/80">
                  PLAYPROVIDENCE.IO
                </span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-md">
                Experience the future of Web3 gaming. Providence brings you an
                immersive universe where gaming meets blockchain technology.
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col md:items-end space-y-4">
              <div className="flex items-center gap-6">
                {/* Social Links */}
                {[
                  { name: "Twitter", url: "#" },
                  { name: "Discord", url: "#" },
                  { name: "Telegram", url: "#" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/40 hover:text-[#7042f88b] transition-colors duration-300"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-[10px] text-white/30 tracking-wider">
                  POWERED BY CYBERSAPIENs
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#7042f88b]/40" />
                  <span className="text-[10px] text-white/20">
                    ALL RIGHTS RESERVED ©2024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-4 border-t border-[#7042f88b]/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30">
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-white/50 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white/50 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white/50 transition-colors">
                  Cookie Policy
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#7042f88b]/40" />
                <span className="uppercase">
                  Built with passion in CYBERSAPIENS Labs
                </span>
              </div>
            </div>
          </div>

          {/* Gradient Line */}
          <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7042f88b]/30 to-transparent" />
        </div>
      </footer>

      <StackedNotifications />
    </div>
  );
};

export default Layout;
