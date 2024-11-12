"use client";

import React, { FC } from "react";

import { Provider } from "jotai";
import WalletProviders from "./walletProviders";

export const JotaiProviders: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return <Provider>{children}</Provider>;
};

const Providers: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<JotaiProviders>
			<WalletProviders>{children}</WalletProviders>
		</JotaiProviders>
	);
};

export default Providers;
