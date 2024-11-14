import * as anchor from "@coral-xyz/anchor";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Mainnet ID's
export const ON_DEMAND_MAINNET_PID = new anchor.web3.PublicKey(
	"SBondMDrcV3K4kxZR1HNVT7osZxAHVHgYXL5Ze1oMUv",
);
export const ON_DEMAND_MAINNET_GUARDIAN_QUEUE = new anchor.web3.PublicKey(
	"B7WgdyAgzK7yGoxfsBaNnY6d41bTybTzEh4ZuQosnvLK",
);
export const ON_DEMAND_MAINNET_QUEUE = new anchor.web3.PublicKey(
	"A43DyUGA7s8eXPxqEjJY6EBu1KKbNgfxF8h17VAHn13w",
);
export const ON_DEMAND_MAINNET_RPC = "https://api.mainnet-beta.solana.com";
// Devnet ID's
export const ON_DEMAND_DEVNET_PID = new anchor.web3.PublicKey(
	"Aio4gaXjXzJNVLtzwtNVmSqGKpANtXhybbkhtAC94ji2",
);
export const ON_DEMAND_DEVNET_GUARDIAN_QUEUE = new anchor.web3.PublicKey(
	"BeZ4tU4HNe2fGQGUzJmNS2UU2TcZdMUUgnCH6RPg4Dpi",
);
export const ON_DEMAND_DEVNET_QUEUE = new anchor.web3.PublicKey(
	"EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7",
);
export const ON_DEMAND_DEVNET_RPC =
	"https://devnet.helius-rpc.com/?api-key=fa5df62b-6ab8-427e-bfc7-0e3739b771d5";
export const isMainNet = false;

/** Merge classes with tailwind-merge with clsx full feature */
export function clx(...classes: ClassValue[]) {
	return twMerge(clsx(...classes));
}

export function formatDateTime(timestamp: string): string {
	const date = new Date(parseInt(timestamp) * 1000);

	const year: number = date.getFullYear();
	const month: string = String(date.getMonth() + 1).padStart(2, "0");
	const day: string = String(date.getDate()).padStart(2, "0");

	const hours: string = String(date.getHours()).padStart(2, "0");
	const minutes: string = String(date.getMinutes()).padStart(2, "0");
	const seconds: string = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const generateRandomString = (length: number): string => {
	const chars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

export function isValidSolanaAddress(address: string) {
	try {
		const pubkey = new anchor.web3.PublicKey(address);
		return anchor.web3.PublicKey.isOnCurve(pubkey);
	} catch (error) {
		console.log(error);
		return false;
	}
}

export function getSolanaExplore(
	url: string | null,
	tx: string | null,
): string {
	if (!url || !tx) return `https://solscan.io`;

	url = url.toLowerCase();

	if (url.includes("mainnet")) {
		return `https://solscan.io/tx/${tx}`;
	}
	if (url.includes("devnet")) {
		return `https://solscan.io/tx/${tx}?cluster=devnet`;
	}
	if (url.includes("testnet")) {
		return `https://solscan.io/tx/${tx}?cluster=testnet`;
	}

	return `https://solscan.io`; // Add default return
}

/**
 * Specific for token amount formatting
 */
// export const formatTokenAmount = (
//   amount: number | bigint,
//   compact = true,
//   options = {}
// ) => {
//   const formattedAmount = amount.toString().slice(0, 7); // 截取前7位，不进行四舍五入
//   return Intl.NumberFormat("en-US", {
//     notation: compact && amount > Math.pow(10, 4) ? "compact" : "standard",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 5,
//     ...options,
//   }).format(parseFloat(formattedAmount));
// };

export function formatAmount(amount: anchor.BN): anchor.BN {
	if (!amount) return new anchor.BN(0);
	const PRECISION = 6; // Use constant for magic number
	const base = new anchor.BN(10).pow(new anchor.BN(PRECISION));
	return amount.div(base);
}

export function u16ToToLEBuffer(value: number): Buffer {
	const buffer = Buffer.alloc(2); // 2 bytes for u16
	buffer.writeUInt16LE(value, 0); // Write the number as little-endian
	return buffer;
}

export function u32ToToLEBuffer(value: number): Buffer {
	const buffer = Buffer.alloc(4); // 2 bytes for u16
	buffer.writeUInt16LE(value, 0); // Write the number as little-endian
	return buffer;
}

type ProbabilityPoint = {
	amount: number;
	probability: number;
};

export function baseWinRate(purchaseAmount: number): number {
	// Handle the case where purchaseAmount is less than 100
	if (purchaseAmount < 100) {
		return 0;
	}
	// Handle the case where purchaseAmount is 20000 or greater
	if (purchaseAmount >= 20000) {
		return 9900; // 100.00%
	}

	const probabilityPoints: ProbabilityPoint[] = [
		{ amount: 100, probability: 200 }, // 2.00%
		{ amount: 500, probability: 1500 }, // 15.00%
		{ amount: 1000, probability: 2000 }, // 20.00%
		{ amount: 2000, probability: 3000 }, // 30.00%
		{ amount: 5000, probability: 6000 }, // 60.00%
		{ amount: 10000, probability: 9000 }, // 90.00%
		{ amount: 20000, probability: 9900 }, // 100.00%
	];

	const { lower, upper } = probabilityPoints
		.map((point, index) => ({
			lower: point,
			upper: probabilityPoints[index + 1],
		}))
		.find(
			({ lower, upper }) =>
				lower.amount <= purchaseAmount && purchaseAmount < upper.amount,
		) || {
		lower: probabilityPoints[probabilityPoints.length - 2],
		upper: probabilityPoints[probabilityPoints.length - 1],
	};

	if (purchaseAmount <= lower.amount) {
		return lower.probability;
	}
	if (purchaseAmount >= upper.amount) {
		return upper.probability;
	}

	const slope =
		(upper.probability - lower.probability) / (upper.amount - lower.amount);
	const interpolated =
		lower.probability + slope * (purchaseAmount - lower.amount);

	return Math.round(interpolated);
}

export const discountRate = (score: anchor.BN) => {
	let discount;
	let level = 0;

	const precision = 6;
	const base = new anchor.BN(10).pow(new anchor.BN(precision));
	const _score = score.isZero() ? new anchor.BN(0) : score.div(base);

	if (_score.lte(new anchor.BN(100000))) {
		level = 0;
	} else {
		const ratio = _score.div(new anchor.BN(100000));
		// const newLevel = ratio.ltn(1) ? 0 : ratio.bitLength() - 1;
		const newLevel = ratio.lte(new anchor.BN(1)) ? 0 : ratio.bitLength() - 1;
		level = newLevel + 1;

		if (level > 10) {
			level = 10;
		}
	}

	switch (level) {
		case 1:
			discount = 99;
			break;
		case 2:
			discount = 98;
			break;
		case 3:
			discount = 97;
			break;
		case 4:
			discount = 96;
			break;
		case 5:
			discount = 95;
			break;
		case 6:
			discount = 94;
			break;
		case 7:
			discount = 93;
			break;
		case 8:
			discount = 92;
			break;
		case 9:
			discount = 91;
			break;
		case 10:
			discount = 88;
			break;
		default:
			discount = 100;
			break;
	}

	return { level, discount };
};

// export const discountRate = (score: number | bigint) => {
//   if (score > 10_000) {
//     return 80;
//   } else if (score > 1_000) {
//     return 90;
//   } else if (score > 100) {
//     return 99;
//   } else {
//     return 100;
//   }
// };

export const formatTokenAmount = (
	amount: number | anchor.BN,
	minimumFractionDigits?: number,
	compact = true,
	options = {},
) => {
	if (new anchor.BN(amount).isZero()) {
		return 0;
	}

	const formattedAmount = Number(amount).toFixed(5);
	const parsedAmount = parseFloat(formattedAmount);

	return Intl.NumberFormat("en-US", {
		notation: compact && parsedAmount > 10000000 ? "compact" : "standard",
		minimumFractionDigits: minimumFractionDigits ?? 2,
		maximumFractionDigits: 5,
		...options,
	}).format(parsedAmount);
};

export const formatAddress = (
	address: string,
	first?: number,
	last?: number,
) => {
	if (!address) return null;

	const first6 = address.slice(0, first ?? 6);
	const last4 = address.slice(last ?? -4);

	return first6 + "..." + last4;
};

export const copyToClipboard = (text: string) => {
	if (navigator.clipboard && window.isSecureContext) {
		// Navigator Clipboard API method'
		return navigator.clipboard.writeText(text).then(
			function () {
				/* clipboard successfully set */
				return true;
			},
			function () {
				/* clipboard write failed */
				return false;
			},
		);
	} else {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		try {
			return document.execCommand("copy");
		} catch (err) {
			console.log(err);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
};
