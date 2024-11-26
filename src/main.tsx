import ReactDOM from "react-dom/client";
import "./assets/fonts/fontinit.css";
import "./index.css";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./i18";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import Layout from "./components/Layout";
const projectId = "25b13b447fae3f9ebc44a23731bf9842";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { Suspense } from "react";
import ShuffleLoader from "./components/Loader";

const mainnet = {
  chainId: 43113,
  name: "FUJI",
  currency: "AVAX",
  explorerUrl: "",
  rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
};

const metadata = {
  name: "PROVIDENCE",
  description: "PROVIDENCE",
  url: "https://stake-vesting-panel.onrender.com/",
  icons: ["https://avatars.mywebsite.com/"],
};
const ethersConfig = defaultConfig({
  metadata,
  rpcUrl: mainnet.rpcUrl,
});

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Suspense fallback={<ShuffleLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>{" "}
      </Suspense>
    </Router>
  </Provider>
);
