import React, { useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link } from "react-router-dom";

import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";

import { Trans } from "@lingui/macro";
import { getChainName, U2U_TESTNET } from "config/chains";
import { switchNetwork } from "lib/wallets";
import { useChainId } from "lib/chains";
import { getIcon } from "config/icons";
import { isHomeSite, getAccountUrl } from "lib/legacy";

import "./Header.css";

const NETWORK_OPTIONS = [
  {
    label: getChainName(U2U_TESTNET),
    value: U2U_TESTNET,
    icon: getIcon(U2U_TESTNET, "network"),
    color: "#E841424D",
  },
];

export function AppHeaderUser({
  openSettings,
  small,
  setWalletModalVisible,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
}) {
  const { chainId } = useChainId();
  const { active, account } = useWeb3React();
  const showConnectionOptions = !isHomeSite();

  useEffect(() => {
    if (active) {
      setWalletModalVisible(false);
    }
  }, [active, setWalletModalVisible]);

  const onNetworkSelect = useCallback(
    (option) => {
      if (option.value === chainId) {
        return;
      }
      return switchNetwork(option.value, active);
    },
    [chainId, active]
  );

  const selectorLabel = getChainName(chainId);

  if (!active || !account) {
    return (
      <div className="App-header-user style-button-connect">
        <NetworkDropdown
          small={small}
          networkOptions={NETWORK_OPTIONS}
          selectorLabel={selectorLabel}
          onNetworkSelect={onNetworkSelect}
          openSettings={openSettings}
        />
        <ConnectWalletButton onClick={() => setWalletModalVisible(true)}>
          {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
        </ConnectWalletButton>

        {/* Login and Signup buttons */}
        <Link to="/login" className="header-btn login-btn">
          Login
        </Link>
        <Link to="/signup" className="header-btn signup-btn">
          Signup
        </Link>
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user style-button-connect">
      {showConnectionOptions ? (
        <>
          <NetworkDropdown
            small={small}
            networkOptions={NETWORK_OPTIONS}
            selectorLabel={selectorLabel}
            onNetworkSelect={onNetworkSelect}
            openSettings={openSettings}
          />
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
