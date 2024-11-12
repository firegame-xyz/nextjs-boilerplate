import * as anchor from "@coral-xyz/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Game as GameIdl } from "@/idl/game";

type IDL = anchor.Program<GameIdl>;

type Config = {
	authority: anchor.web3.PublicKey;
	tokenMint: anchor.web3.PublicKey;
	voucherMint: anchor.web3.PublicKey;
	nonce: number;
	lastUpdated: anchor.BN;
};

type Game = {
	currentRound: anchor.web3.PublicKey;
	gameVault: anchor.web3.PublicKey;
	totalBalance: anchor.BN;
	constructionWorkerSalaryPoolBalance: anchor.BN;
	totalConstructionWorkerSalariesClaimed: anchor.BN;
	bonusSalaryPoolBalance: anchor.BN;
	totalBonusSalariesClaimed: anchor.BN;
	specialRewardPoolBalance: anchor.BN;
	totalSpecialRewardsClaimed: anchor.BN;
	developerPoolBalance: anchor.BN;
	totalDeveloperRewardsClaimed: anchor.BN;
	referrerRewardPoolBalance: anchor.BN;
	totalReferrerRewardsClaimed: anchor.BN;
	registrationRewardPoolBalance: anchor.BN;
	totalRegistrationRewardsClaimed: anchor.BN;
	singleRegistrationRewardAmount: anchor.BN;
	remainingRegistrationRewardSlots: anchor.BN;
	totalExitRewardsClaimed: anchor.BN;
	nonce: number;
	bump: number;
	defaultSquad: anchor.web3.PublicKey;
};

type Round = {
	roundNumber: number;
	currentPeriod: anchor.web3.PublicKey;
	roundVault: anchor.web3.PublicKey;
	startTime: anchor.BN;
	endTime: anchor.BN;
	lastCallSlot: anchor.BN;
	callCount: number;
	earningsPerOre: anchor.BN;
	soldOres: anchor.BN;
	activeOres: anchor.BN;
	grandPrizePoolBalance: anchor.BN;
	firstGrandPrizeAmount: anchor.BN;
	secondGrandPrizeAmount: anchor.BN;
	totalGrandPrizesDistributed: anchor.BN;
	lastActiveParticipants: anchor.web3.PublicKey[];
	grandPrizeDistributionIndex: number;
	isOver: boolean;
	isGrandPrizeDistributionCompleted: boolean;
	exitRewardsPerSecond: anchor.BN;
	lastClaimedExitRewardsTimestamp: anchor.BN;
	nonce: number;
};

export type Period = {
	periodNumber: number;
	startTime: anchor.BN;
	endTime: anchor.BN;
	periodVault: anchor.web3.PublicKey;
	topPlayers: TopPlayerAccount[];
	topSquads: TopSquadAccount[];
	squadRewardAmount: anchor.BN;
	squadFirstPlaceRewardAmount: anchor.BN;
	squadSecondPlaceRewardAmount: anchor.BN;
	squadThirdPlaceRewardAmount: anchor.BN;
	individualRewardAmount: anchor.BN;
	isDistributionCompleted: boolean;
};

export type TopPlayerAccount = {
	player: anchor.web3.PublicKey;
	purchaseQuantity: anchor.BN;
};

export type TopSquadAccount = {
	squad: anchor.web3.PublicKey;
	purchaseQuantity: anchor.BN;
};

// type Player = {
//     authority: anchor.web3.PublicKey;
//     tokenAccount: anchor.web3.PublicKey;
//     referrer: anchor.web3.PublicKey;
//     squad: anchor.web3.PublicKey;
//     nonce: number;
//     randomnessAccount: anchor.web3.PublicKey;
//     squadApplications: anchor.web3.PublicKey[];
//     lastSquadLeaveTime: anchor.BN;
//     pendingReferrerRewards: anchor.BN;
//     totalReferrerRewardsClaimed: anchor.BN;
//     createdAt: anchor.BN;
// };

type PlayerData = {
	player: anchor.web3.PublicKey;
	nonce: number;
	tokenAccount: anchor.web3.PublicKey;
	voucherAccount: anchor.web3.PublicKey;
	referrer: anchor.web3.PublicKey;
	referralCount: number;
	squad: anchor.web3.PublicKey;
	squadApplications: anchor.web3.PublicKey[];
	canApplySquadTimestamp: anchor.BN;
	pendingReferrerRewards: anchor.BN;
	totalReferrerRewardsClaimed: anchor.BN;
	currentRound: anchor.web3.PublicKey;
	currentPeriod: anchor.web3.PublicKey;
	earningsPerOre: anchor.BN;
	constructionWorkerSalaries: anchor.BN;
	oreAmount: anchor.BN;
	randomnessAccount: anchor.web3.PublicKey;
	randomnessCommitSlot: anchor.BN;
	randomnessProbability: number;
	randomnessRewardAmount: anchor.BN;
	totalPurchaseQuantity: anchor.BN;
	currentPeriodPurchaseQuantity: anchor.BN;
	autoReinvest: boolean;
	lastPurchaseTimestamp: anchor.BN;
	hasExited: boolean;
	createdAt: anchor.BN;
	totalExitRewardsClaimed: anchor.BN;
	pendingExitRewards: anchor.BN;
	// orderList: anchor.web3.PublicKey[];
	orderNumberList: number[];
};

export type SquadAll = {
	account: Squad;
	publicKey: anchor.web3.PublicKey;
};

export type Squad = {
	squadNumber: number;
	captain: anchor.web3.PublicKey;
	name: string | null;
	logoUrl: string | null;
	description: string | null;
	currentPeriod: anchor.web3.PublicKey;
	totalPurchaseQuantity: anchor.BN;
	currentPeriodPurchaseQuantity: anchor.BN;
	collectableSquadRewards: anchor.BN;
	totalSquadRewardsCollected: anchor.BN;
	memberList: anchor.web3.PublicKey[];
	managers: anchor.web3.PublicKey[];
	applicationList: anchor.web3.PublicKey[];
	lastUpdatedTimestamp: anchor.BN;
	createdAt: anchor.BN;
};

// type Voucher = {
//   voucherMint: anchor.web3.PublicKey;
//   voucherVault: anchor.web3.PublicKey;
//   mintedAmount: anchor.BN;
//   bump: number;
// };

// type Pool = {
//   /// Token mint address
//   tokenMint: anchor.web3.PublicKey;

//   /// Pool vault address
//   poolVault: anchor.web3.PublicKey;

//   /// Current balance of the pool
//   balance: anchor.BN;

//   /// Total amount of resources mined
//   totalMinedAmount: anchor.BN;

//   /// Bump seed for PDA derivation
//   bump: number;
// };

export type Order = {
	depositAmount: anchor.BN;
	minedAmount: anchor.BN;
	lockedAmount: anchor.BN;
	orderVault: anchor.web3.PublicKey;
	orderTimestamp: anchor.BN;
	withdrawableTimestamp: anchor.BN;
	annualPercentageRate: number;
	earlyUnlockApr: number;
	earlyUnlockRequested: boolean;
	earlyUnlockTimestamp: anchor.BN;
	bump: number;
};

// type Name = {
//   owner: anchor.web3.PublicKey | null;
// };

type Balance = {
	valueAmount: anchor.BN;
	amount: anchor.BN;
	decimals: number;
};

// 基础步骤类型
export type RandomnessStep = {
	isProcessing: boolean;
	error: string | null;
	txSignature?: string;
	blockTime?: number;
};

// 创建随机数的响应类型
export type CreateRandomnessResponse = {
	randomnessPubkey: string;
	tx: string;
	rngPublicKey: string;
};

// 提交的响应类型
export type CommitResponse = {
	commitIx: {
		keys: Array<{
			pubkey: string;
			isSigner: boolean;
			isWritable: boolean;
		}>;
		programId: string;
		data: number[];
	};
};

// 揭示的响应类型
export type RevealResponse = {
	revealIx: {
		keys: Array<{
			pubkey: string;
			isSigner: boolean;
			isWritable: boolean;
		}>;
		programId: string;
		data: number[];
	};
};

// 完整的随机数状态类型
type RandomnessState = {
	creating: RandomnessStep & {
		response: CreateRandomnessResponse | null;
	};
	committing: RandomnessStep & {
		response: CommitResponse | null;
	};
	revealing: RandomnessStep & {
		response: RevealResponse | null;
	};
};

// Define Jotai atoms
const randomnessAtom = atom<RandomnessState>({
	creating: {
		isProcessing: false,
		error: null,
		response: null,
		txSignature: undefined,
		blockTime: undefined,
	},
	committing: {
		isProcessing: false,
		error: null,
		response: null,
		txSignature: undefined,
		blockTime: undefined,
	},
	revealing: {
		isProcessing: false,
		error: null,
		response: null,
		txSignature: undefined,
		blockTime: undefined,
	},
});

const rpcEndpointAtom = atom<string>(
	clusterApiUrl(WalletAdapterNetwork.Devnet),
);
const providerAtom = atom<anchor.AnchorProvider | null>(null);
const programAtom = atom<IDL | null>(null);
const configAtom = atom<Config | null>(null);
const gameAtom = atom<Game | null>(null);
const roundAtom = atom<Round | null>(null);
const playerDataAtom = atom<PlayerData | null>(null);
const playerPDAAtom = atom<anchor.web3.PublicKey | null>(null);
const squadAtom = atom<Squad | null>(null);
const periodAtom = atom<Period | null>(null);
const lastPeriodAtom = atom<Period[] | []>([]);
const balanceAtom = atom<Balance | null>(null);
const voucherAccountAtom = atom<anchor.web3.PublicKey | null>(null);
const voucherBalanceAtom = atom<Balance | null>(null);
const registeredAtom = atom<boolean>(false);
const squadLoadingAtom = atom<boolean>(false);
const statePendingAtom = atom<boolean>(false);
const mySquadAtom = atomWithStorage("mySquad", null);

// Export individual atoms for use in other components
export {
	rpcEndpointAtom,
	randomnessAtom,
	providerAtom,
	programAtom,
	configAtom,
	gameAtom,
	roundAtom,
	playerDataAtom,
	playerPDAAtom,
	squadAtom,
	periodAtom,
	lastPeriodAtom,
	balanceAtom,
	voucherAccountAtom,
	voucherBalanceAtom,
	registeredAtom,
	squadLoadingAtom,
	statePendingAtom,
	mySquadAtom,
};
