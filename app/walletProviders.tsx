"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
	ConnectionProvider,
	WalletProvider,
	useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import React, { FC, useEffect, useMemo, useState } from "react";

import { NotificationContextProvider } from "./notifications";
import { useAtom } from "jotai";
import { rpcEndpointAtom } from "./state";

const WalletProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
	const [rpcEndpoint] = useAtom(rpcEndpointAtom);
	const network = WalletAdapterNetwork.Devnet;

	// You can also provide a custom RPC endpoint.
	const endpoint = useMemo(() => rpcEndpoint || clusterApiUrl(network), [
		network,
		rpcEndpoint,
	]);

	const wallets = useMemo(() => [], [network]);

	return (
		<NotificationContextProvider>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<WalletModalProvider>{children}</WalletModalProvider>
				</WalletProvider>
			</ConnectionProvider>
		</NotificationContextProvider>
	);
};

export default WalletProviders;
