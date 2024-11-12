import * as anchor from "@coral-xyz/anchor";

import { u16ToToLEBuffer, u32ToToLEBuffer } from "@/app/utils/helpers";

export const findSquadNumberPDA = (
	squadNumber: number,
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("squad"), u32ToToLEBuffer(squadNumber)],
		programId,
	)[0];
};

export const findGamePDA = (
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("game")],
		programId,
	)[0];
};

export const findConfigPDA = (
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("config")],
		programId,
	)[0];
};

// export const findRoundPDA = (
//   currentRound: number,
//   programId: anchor.web3.PublicKey
// ): anchor.web3.PublicKey => {
//   return anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("round"), u16ToToLEBuffer(currentRound)],
//     programId
//   )[0];
// };

// export const findPlayerGamePDA = (
//   publicKey: anchor.web3.PublicKey,
//   programId: anchor.web3.PublicKey
// ): anchor.web3.PublicKey => {
//   return anchor.web3.PublicKey.findProgramAddressSync(
//     [Buffer.from("player_game"), publicKey.toBuffer()],
//     programId
//   )[0];
// };

export const findPeriodPDA = (
	currentRound: anchor.web3.PublicKey,
	currentPeriod: number,
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[
			Buffer.from("period"),
			currentRound.toBuffer(),
			u16ToToLEBuffer(currentPeriod),
		],
		programId,
	)[0];
};

export const findOrderPDA = (
	orderNumber: number,
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("order"), u16ToToLEBuffer(orderNumber)],
		programId,
	)[0];
};

export const findPlayerDataPDA = (
	publicKey: anchor.web3.PublicKey,
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("player_data"), publicKey.toBuffer()],
		programId,
	)[0];
};

// export const findPlayerRoundPDA = (
// 	// roundPDA: anchor.web3.PublicKey,
// 	publicKey: anchor.web3.PublicKey,
// 	programId: anchor.web3.PublicKey,
// ): anchor.web3.PublicKey => {
// 	return anchor.web3.PublicKey.findProgramAddressSync(
// 		[Buffer.from("player_round"), publicKey.toBuffer()],
// 		programId,
// 	)[0];
// };

export const findVoucherMintPDA = (
	programId: anchor.web3.PublicKey,
): anchor.web3.PublicKey => {
	return anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from("voucher_mint")],
		programId,
	)[0];
};
