/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/game.json`.
 */
export type Game = {
	address: "5v9RRwYa4NnS4FhV5S1v1tJLZRqX55zeF8gVHguALPBh";
	metadata: {
		name: "game";
		version: "0.1.0";
		spec: "0.1.0";
		description: "Created with Anchor";
	};
	instructions: [
		{
			name: "acceptSquadApplication";
			discriminator: [34, 95, 186, 138, 30, 207, 105, 206];
			accounts: [
				{
					name: "acceptor";
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					writable: true;
					relations: ["acceptorPlayerData"];
				},
				{
					name: "acceptorPlayerData";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "acceptor";
							},
						];
					};
				},
				{
					name: "applicantPlayerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "applicant";
							},
						];
					};
				},
			];
			args: [
				{
					name: "applicant";
					type: "pubkey";
				},
			];
		},
		{
			name: "applyToJoinSquad";
			discriminator: [68, 39, 156, 14, 119, 23, 28, 230];
			accounts: [
				{
					name: "squad";
					writable: true;
				},
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
			];
			args: [];
		},
		{
			name: "autoReinvest";
			discriminator: [220, 119, 143, 176, 145, 160, 83, 160];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account", "权限账户"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["Current round account", "当前轮次账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "currentPeriod";
					docs: ["Current period account", "当前周期账户"];
					writable: true;
					relations: ["currentRound"];
				},
				{
					name: "playerData";
					docs: ["Player data account", "玩家数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "player";
							},
						];
					};
				},
				{
					name: "squad";
					docs: ["Squad account", "战队账户"];
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "referrerData";
					docs: ["Referrer player data account", "推荐人玩家数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player_data.referrer";
								account: "playerData";
							},
						];
					};
				},
			];
			args: [
				{
					name: "player";
					type: "pubkey";
				},
			];
		},
		{
			name: "cancelAutoReinvest";
			discriminator: [116, 255, 17, 198, 82, 194, 199, 132];
			accounts: [
				{
					name: "player";
					docs: [
						"The player account (signer) canceling auto-reinvest",
						"取消自动再投资的玩家账户（签名者）",
					];
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					docs: ["The player's data account", "玩家的数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account", "游戏账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["The current round account", "当前回合账户"];
					writable: true;
					relations: ["game"];
				},
			];
			args: [];
		},
		{
			name: "collateralExchange";
			discriminator: [113, 248, 87, 210, 125, 27, 52, 57];
			accounts: [
				{
					name: "player";
					docs: [
						"The player account (signer) performing the collateral exchange",
						"执行抵押品交换的玩家账户（签名者）",
					];
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					docs: ["The player's data account", "玩家的数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "config";
					docs: ["The global configuration account", "全局配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "tokenAccount";
					docs: ["The player's token account", "玩家的代币账户"];
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "voucherAccount";
					docs: ["The player's voucher account", "玩家的凭证账户"];
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "voucher";
					docs: ["The voucher account", "凭证账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [118, 111, 117, 99, 104, 101, 114];
							},
						];
					};
				},
				{
					name: "voucherVault";
					docs: ["The voucher vault account", "凭证金库账户"];
					writable: true;
					relations: ["voucher"];
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "voucherMint";
					docs: ["The voucher mint account", "凭证铸造账户"];
					writable: true;
					relations: ["config"];
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "amount";
					type: "u64";
				},
			];
		},
		{
			name: "collectDeveloperRewards";
			discriminator: [162, 124, 33, 222, 98, 204, 230, 170];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "gameVault";
					docs: ["Game vault token account", "游戏金库代币账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					docs: ["Authority's token account", "权限账户的代币账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "authority";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "collectReferrerRewards";
			discriminator: [25, 189, 56, 237, 243, 29, 163, 197];
			accounts: [
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "createSquad";
			discriminator: [5, 221, 149, 143, 156, 81, 164, 46];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "squad";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [115, 113, 117, 97, 100];
							},
							{
								kind: "account";
								path: "config.nonce";
								account: "config";
							},
						];
					};
				},
				{
					name: "config";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "deposit";
			discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
			accounts: [
				{
					name: "player";
					docs: [
						"The player account (signer) making the deposit",
						"进行存款的玩家账户（签名者）",
					];
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					docs: ["The player's data account", "玩家的数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					docs: ["The player's token account", "玩家的代币账户"];
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "pool";
					docs: ["The pool account", "池账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 111, 111, 108];
							},
						];
					};
				},
				{
					name: "poolVault";
					docs: ["The pool's token vault", "池的代币金库"];
					writable: true;
					relations: ["pool"];
				},
				{
					name: "order";
					docs: ["The order account to be initialized", "要初始化的订单账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [111, 114, 100, 101, 114];
							},
							{
								kind: "account";
								path: "pool.nonce";
								account: "pool";
							},
						];
					};
				},
				{
					name: "orderVault";
					docs: ["The order's token vault", "订单的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "order";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["pool"];
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "amount";
					type: "u64";
				},
			];
		},
		{
			name: "distributeGrandPrizes";
			discriminator: [107, 24, 238, 49, 60, 155, 117, 72];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["Current round account", "当前轮次账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "playerData";
					docs: ["Player data account", "玩家数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "current_round.last_active_participants\n[current_round.grand_prize_distribution_index as usize]";
								account: "round";
							},
						];
					};
				},
				{
					name: "gameVault";
					docs: ["Game vault token account", "游戏金库代币账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "tokenAccount";
					docs: ["Player's token account", "玩家的代币账户"];
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "distributeLeaderboardRewards";
			discriminator: [7, 77, 66, 190, 243, 30, 121, 36];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "period";
					docs: ["Period account", "周期账户"];
					writable: true;
				},
				{
					name: "squadFirst";
					docs: ["First place squad account", "第一名团队账户"];
					writable: true;
				},
				{
					name: "squadSecond";
					docs: ["Second place squad account", "第二名团队账户"];
					writable: true;
				},
				{
					name: "squadThird";
					docs: ["Third place squad account", "第三名团队账户"];
					writable: true;
				},
				{
					name: "gameVault";
					docs: ["Game vault token account", "游戏金库代币账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "playerLeaderboardWinner";
					docs: [
						"Leaderboard winner player data account",
						"排行榜冠军玩家数据账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [115, 113, 117, 97, 100];
							},
							{
								kind: "account";
								path: "period.top_players [0].player";
								account: "period";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					docs: ["Winner's token account", "冠军的代币账户"];
					writable: true;
					relations: ["playerLeaderboardWinner"];
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "distributeSquadRewards";
			discriminator: [206, 0, 124, 119, 238, 243, 171, 138];
			accounts: [
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "squad";
					writable: true;
					relations: ["captainData"];
				},
				{
					name: "captain";
					writable: true;
					signer: true;
					relations: ["squad"];
				},
				{
					name: "captainData";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "captain";
							},
						];
					};
				},
				{
					name: "memberPlayerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "member";
							},
						];
					};
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["memberPlayerData"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [
				{
					name: "member";
					type: "pubkey";
				},
				{
					name: "rewardAmount";
					type: "u64";
				},
			];
		},
		{
			name: "exit";
			discriminator: [234, 32, 12, 71, 126, 5, 219, 160];
			accounts: [
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "currentRound";
					writable: true;
					relations: ["game"];
				},
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "grantManagerPrivileges";
			discriminator: [186, 147, 175, 135, 153, 31, 133, 65];
			accounts: [
				{
					name: "captain";
					docs: [
						"The squad captain who is granting manager privileges",
						"授予管理员权限的队长",
					];
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					docs: [
						"The squad account that is being modified",
						"正在被修改的小队账户",
					];
					writable: true;
					relations: ["captainData"];
				},
				{
					name: "captainData";
					docs: ["The captain's player data account", "队长的玩家数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "captain";
							},
						];
					};
				},
				{
					name: "memberData";
					docs: [
						"The member's player data account who is being granted manager privileges",
						"被授予管理员权限的成员的玩家数据账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "member";
							},
						];
					};
				},
			];
			args: [
				{
					name: "member";
					type: "pubkey";
				},
			];
		},
		{
			name: "increaseGameBalance";
			discriminator: [42, 11, 193, 55, 254, 125, 189, 168];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					docs: ["Authority's token account", "权限账户的代币账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "authority";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "gameVault";
					docs: ["Game vault token account", "游戏金库代币账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated Token Program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["Token Program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [
				{
					name: "amount";
					type: "u64";
				},
			];
		},
		{
			name: "increasePoolBalance";
			discriminator: [142, 244, 43, 121, 209, 95, 223, 55];
			accounts: [
				{
					name: "authority";
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "pool";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 111, 111, 108];
							},
						];
					};
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "poolVault";
					writable: true;
					relations: ["pool"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [
				{
					name: "amount";
					type: "u64";
				},
			];
		},
		{
			name: "increaseRegistrationRewardSlots";
			discriminator: [161, 118, 80, 138, 80, 52, 154, 84];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
			];
			args: [
				{
					name: "additionalSlots";
					type: "u64";
				},
			];
		},
		{
			name: "initialize";
			discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
			accounts: [
				{
					name: "superAdmin";
					docs: [
						"The super admin account, must match the predefined public key",
						"超级管理员账户，必须匹配预定义的公钥",
					];
					writable: true;
					signer: true;
					address: "FzTqvgGBS3ioKG4oYpQUP3hNJdaLavsxCu9giELZcnPA";
				},
				{
					name: "config";
					docs: [
						"The global configuration account for the game",
						"游戏的全局配置账户",
					];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: [
						"The main token mint account for the game",
						"游戏的主要代币铸造账户",
					];
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeDefaultPlayer";
			discriminator: [23, 116, 120, 192, 192, 83, 105, 89];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "defaultPlayer";
					docs: ["Default player account", "默认玩家账户"];
					address: "11111111111111111111111111111111";
				},
				{
					name: "playerData";
					docs: ["Player data account", "玩家数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "defaultPlayer";
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "voucherMint";
					docs: ["Voucher mint account", "凭证铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					docs: ["Default player's token account", "默认玩家的代币账户"];
					pda: {
						seeds: [
							{
								kind: "account";
								path: "defaultPlayer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "voucherAccount";
					docs: ["Default player's voucher account", "默认玩家的凭证账户"];
					pda: {
						seeds: [
							{
								kind: "account";
								path: "defaultPlayer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "voucherMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeDefaultSquad";
			discriminator: [202, 205, 219, 187, 185, 124, 234, 104];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "squad";
					docs: ["Default squad account", "默认小队账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [115, 113, 117, 97, 100];
							},
							{
								kind: "const";
								value: [64, 66, 15, 0];
							},
						];
					};
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeDefaultToken";
			discriminator: [51, 86, 59, 20, 84, 83, 59, 160];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "defaultPlayer";
					docs: ["Default player account", "默认玩家账户"];
					address: "11111111111111111111111111111111";
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "voucherMint";
					docs: ["Voucher mint account", "凭证铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					docs: ["Default player's token account", "默认玩家的代币账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "defaultPlayer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "voucherAccount";
					docs: ["Default player's voucher account", "默认玩家的凭证账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "defaultPlayer";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "voucherMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					docs: ["Token Program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated Token Program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					docs: ["System Program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeGame";
			discriminator: [44, 62, 102, 247, 126, 208, 130, 215];
			accounts: [
				{
					name: "authority";
					docs: [
						"The admin (signer) initializing the game",
						"初始化游戏的管理员账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"Config account containing global settings",
						"包含全局设置的配置账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account to be initialized", "要初始化的游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["The main token mint", "主要代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "gameVault";
					docs: ["The game's token vault", "游戏的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "game";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeNextPeriod";
			discriminator: [46, 76, 173, 91, 54, 12, 193, 41];
			accounts: [
				{
					name: "authority";
					docs: ["Authority account (signer)", "权限账户（签名者）"];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: ["Config account", "配置账户"];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["Game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["Current round account", "当前轮次账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "currentPeriod";
					docs: ["Current period account", "当前周期账户"];
					writable: true;
					relations: ["currentRound"];
				},
				{
					name: "nextPeriod";
					docs: [
						"Next period account to be initialized",
						"要初始化的下一个周期账户",
					];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 101, 114, 105, 111, 100];
							},
							{
								kind: "account";
								path: "currentRound";
							},
							{
								kind: "account";
								path: "current_round.nonce";
								account: "round";
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["Token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenVault";
					docs: ["Token vault for the next period", "下一个周期的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "nextPeriod";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "startTime";
					type: "u64";
				},
				{
					name: "leaderboardDuration";
					type: "u64";
				},
				{
					name: "squadRewardAmount";
					type: "u64";
				},
				{
					name: "individualRewardAmount";
					type: "u64";
				},
			];
		},
		{
			name: "initializeNextRound";
			discriminator: [10, 118, 67, 132, 36, 211, 96, 20];
			accounts: [
				{
					name: "authority";
					docs: [
						"The authority account (signer) initializing the next round",
						"初始化下一轮的权限账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"The config account containing global settings",
						"包含全局设置的配置账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["The current round account", "当前轮次账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "nextRound";
					docs: [
						"The next round account to be initialized",
						"要初始化的下一轮次账户",
					];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [114, 111, 117, 110, 100];
							},
							{
								kind: "account";
								path: "game.nonce";
								account: "game";
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenVault";
					docs: ["The token vault for the next round", "下一轮次的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "nextRound";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "startTime";
					type: "u64";
				},
				{
					name: "countdownDuration";
					type: "u64";
				},
			];
		},
		{
			name: "initializePeriod";
			discriminator: [72, 211, 113, 54, 173, 192, 29, 170];
			accounts: [
				{
					name: "authority";
					docs: [
						"The authority account (signer) initializing the period",
						"初始化周期的权限账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"The config account containing global settings",
						"包含全局设置的配置账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					docs: ["The current round account", "当前轮次账户"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "period";
					docs: ["The period account to be initialized", "要初始化的周期账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 101, 114, 105, 111, 100];
							},
							{
								kind: "account";
								path: "currentRound";
							},
							{
								kind: "account";
								path: "current_round.nonce";
								account: "round";
							},
						];
					};
				},
				{
					name: "gameVault";
					docs: ["The game's token vault", "游戏的代币金库"];
					writable: true;
					relations: ["game"];
				},
				{
					name: "periodVault";
					docs: ["The period's token vault", "周期的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "period";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "startTime";
					type: "u64";
				},
				{
					name: "leaderboardDuration";
					type: "u64";
				},
				{
					name: "squadRewardAmount";
					type: "u64";
				},
				{
					name: "individualRewardAmount";
					type: "u64";
				},
			];
		},
		{
			name: "initializePlayer";
			discriminator: [79, 249, 88, 177, 220, 62, 56, 128];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "referrerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "referrer";
							},
						];
					};
				},
				{
					name: "config";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "tokenMint";
					relations: ["config"];
				},
				{
					name: "voucherMint";
					writable: true;
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "player";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "voucherAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "player";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "voucherMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "voucher";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [118, 111, 117, 99, 104, 101, 114];
							},
						];
					};
				},
				{
					name: "voucherVault";
					writable: true;
					relations: ["voucher"];
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "referrer";
					type: "pubkey";
				},
			];
		},
		{
			name: "initializePool";
			discriminator: [95, 180, 10, 172, 84, 174, 232, 40];
			accounts: [
				{
					name: "authority";
					docs: [
						"The authority account (signer) initializing the pool",
						"初始化池的权限账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"The config account containing global settings",
						"包含全局设置的配置账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "pool";
					docs: ["The pool account to be initialized", "要初始化的池账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 111, 111, 108];
							},
						];
					};
				},
				{
					name: "poolVault";
					docs: ["The pool's token vault", "池的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "pool";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeRound";
			discriminator: [43, 135, 19, 93, 14, 225, 131, 188];
			accounts: [
				{
					name: "authority";
					docs: [
						"The authority account (signer) initializing the round",
						"初始化轮次的权限账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"The config account containing global settings",
						"包含全局设置的配置账户",
					];
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "game";
					docs: ["The game account", "游戏账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "round";
					docs: ["The round account to be initialized", "要初始化的轮次账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [114, 111, 117, 110, 100];
							},
							{
								kind: "account";
								path: "game.nonce";
								account: "game";
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["The token mint account", "代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "tokenVault";
					docs: ["The token vault for the round", "轮次的代币金库"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "round";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "associatedTokenProgram";
					docs: ["The associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "startTime";
					type: "u64";
				},
				{
					name: "countdownDuration";
					type: "u64";
				},
			];
		},
		{
			name: "initializeToken";
			discriminator: [38, 209, 150, 50, 190, 117, 16, 54];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "config";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "tokenMint";
					relations: ["config"];
				},
				{
					name: "voucherMint";
					relations: ["config"];
				},
				{
					name: "tokenAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "player";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "voucherAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "player";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "voucherMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "initializeVoucher";
			discriminator: [63, 32, 98, 163, 253, 60, 197, 211];
			accounts: [
				{
					name: "authority";
					docs: [
						"The authority account (signer) initializing the voucher",
						"初始化代金券的权限账户（签名者）",
					];
					writable: true;
					signer: true;
					relations: ["config"];
				},
				{
					name: "config";
					docs: [
						"Config account containing global settings",
						"包含全局设置的配置账户",
					];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [99, 111, 110, 102, 105, 103];
							},
						];
					};
				},
				{
					name: "voucher";
					docs: ["Voucher account to be initialized", "要初始化的代金券账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [118, 111, 117, 99, 104, 101, 114];
							},
						];
					};
				},
				{
					name: "tokenMint";
					docs: ["Main token mint account", "主要代币铸造账户"];
					relations: ["config"];
				},
				{
					name: "voucherMint";
					docs: ["Voucher token mint account", "代金券代币铸造账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [
									118,
									111,
									117,
									99,
									104,
									101,
									114,
									95,
									109,
									105,
									110,
									116,
								];
							},
						];
					};
				},
				{
					name: "voucherVault";
					docs: ["Voucher token vault account", "代金券代币金库账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "account";
								path: "voucher";
							},
							{
								kind: "const";
								value: [
									6,
									221,
									246,
									225,
									215,
									101,
									161,
									147,
									217,
									203,
									225,
									70,
									206,
									235,
									121,
									172,
									28,
									180,
									133,
									237,
									95,
									91,
									55,
									145,
									58,
									140,
									245,
									133,
									126,
									255,
									0,
									169,
								];
							},
							{
								kind: "account";
								path: "tokenMint";
							},
						];
						program: {
							kind: "const";
							value: [
								140,
								151,
								37,
								143,
								78,
								36,
								137,
								241,
								187,
								61,
								16,
								41,
								20,
								142,
								13,
								131,
								11,
								90,
								19,
								153,
								218,
								255,
								16,
								132,
								4,
								142,
								123,
								216,
								219,
								233,
								248,
								89,
							];
						};
					};
				},
				{
					name: "tokenMetadata";
					docs: ["Token metadata account", "代币元数据账户"];
					writable: true;
				},
				{
					name: "tokenMetadataProgram";
					docs: ["Token metadata program", "代币元数据程序"];
					address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
				},
				{
					name: "tokenProgram";
					docs: ["Token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "associatedTokenProgram";
					docs: ["Associated token program", "关联代币程序"];
					address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
				},
				{
					name: "systemProgram";
					docs: ["System program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
				{
					name: "rent";
					docs: ["Rent sysvar", "租金系统变量"];
					address: "SysvarRent111111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "leaveSquad";
			discriminator: [167, 247, 102, 137, 238, 146, 1, 89];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "purchase";
			discriminator: [21, 93, 113, 154, 193, 160, 242, 168];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "voucherAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "randomnessAccountData";
				},
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					writable: true;
					relations: ["game"];
				},
				{
					name: "roundVault";
					writable: true;
					relations: ["currentRound"];
				},
				{
					name: "currentPeriod";
					writable: true;
					relations: ["currentRound"];
				},
				{
					name: "squad";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "voucher";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [118, 111, 117, 99, 104, 101, 114];
							},
						];
					};
				},
				{
					name: "voucherVault";
					writable: true;
					relations: ["voucher"];
				},
				{
					name: "voucherMint";
					writable: true;
					relations: ["voucher"];
				},
				{
					name: "referrer";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player_data.referrer";
								account: "playerData";
							},
						];
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "purchaseQuantity";
					type: "u64";
				},
			];
		},
		{
			name: "reinvest";
			discriminator: [107, 29, 95, 200, 217, 52, 155, 76];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					writable: true;
					relations: ["game"];
				},
				{
					name: "currentPeriod";
					writable: true;
					relations: ["currentRound"];
				},
				{
					name: "squad";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "referrer";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player_data.referrer";
								account: "playerData";
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [];
		},
		{
			name: "rejectSquadApplication";
			discriminator: [22, 99, 93, 87, 181, 72, 104, 54];
			accounts: [
				{
					name: "rejector";
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					writable: true;
					relations: ["rejectorData"];
				},
				{
					name: "rejectorData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "rejector";
							},
						];
					};
				},
				{
					name: "applicantData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "applicant";
							},
						];
					};
				},
			];
			args: [
				{
					name: "applicant";
					type: "pubkey";
				},
			];
		},
		{
			name: "removeMemberFromSquad";
			discriminator: [106, 203, 130, 154, 197, 174, 6, 57];
			accounts: [
				{
					name: "manager";
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					writable: true;
					relations: ["memberToRemoveData"];
				},
				{
					name: "memberToRemoveData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "memberToRemove";
							},
						];
					};
				},
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "memberToRemove";
					type: "pubkey";
				},
			];
		},
		{
			name: "requestEarlyUnlock";
			discriminator: [163, 4, 108, 223, 45, 125, 7, 14];
			accounts: [
				{
					name: "player";
					docs: [
						"The player account (signer) requesting early unlock",
						"请求提前解锁的玩家账户（签名者）",
					];
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					docs: ["The player's data account", "玩家的数据账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "order";
					docs: [
						"The order account to be unlocked early",
						"要提前解锁的订单账户",
					];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [111, 114, 100, 101, 114];
							},
							{
								kind: "arg";
								path: "orderNumber";
							},
						];
					};
				},
				{
					name: "orderVault";
					docs: ["The order's token vault", "订单的代币金库"];
					writable: true;
					relations: ["order"];
				},
				{
					name: "pool";
					docs: ["The pool account", "池账户"];
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 111, 111, 108];
							},
						];
					};
				},
				{
					name: "poolVault";
					docs: ["The pool's token vault", "池的代币金库"];
					writable: true;
					relations: ["pool"];
				},
				{
					name: "tokenProgram";
					docs: ["The token program", "代币程序"];
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					docs: ["The system program", "系统程序"];
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "orderNumber";
					type: "u16";
				},
			];
		},
		{
			name: "revealDrawLotteryResult";
			discriminator: [213, 11, 203, 24, 105, 45, 18, 238];
			accounts: [
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "randomnessAccount";
					relations: ["playerData"];
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "revokeManagerPrivileges";
			discriminator: [152, 214, 82, 132, 4, 91, 108, 73];
			accounts: [
				{
					name: "captain";
					writable: true;
					signer: true;
				},
				{
					name: "squad";
					writable: true;
					relations: ["captainData"];
				},
				{
					name: "captainData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "captain";
							},
						];
					};
				},
				{
					name: "managerData";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "manager";
							},
						];
					};
				},
			];
			args: [
				{
					name: "manager";
					type: "pubkey";
				},
			];
		},
		{
			name: "setAutoReinvest";
			discriminator: [223, 44, 41, 29, 18, 103, 147, 112];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "game";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "currentRound";
					writable: true;
					relations: ["game"];
				},
			];
			args: [];
		},
		{
			name: "setReferrer";
			discriminator: [115, 251, 55, 0, 166, 189, 25, 74];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "referrerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "referrer";
							},
						];
					};
				},
			];
			args: [
				{
					name: "referrer";
					type: "pubkey";
				},
			];
		},
		{
			name: "settlePreviousRound";
			discriminator: [76, 156, 154, 22, 191, 72, 250, 56];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
					relations: ["playerData"];
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "game";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [103, 97, 109, 101];
							},
						];
					};
				},
				{
					name: "gameVault";
					writable: true;
					relations: ["game"];
				},
				{
					name: "currentRound";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
			];
			args: [];
		},
		{
			name: "transferSquadCaptaincy";
			discriminator: [214, 206, 74, 1, 167, 123, 6, 216];
			accounts: [
				{
					name: "squad";
					writable: true;
					relations: ["captainPlayerData"];
				},
				{
					name: "captain";
					writable: true;
					signer: true;
				},
				{
					name: "captainPlayerData";
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "captain";
							},
						];
					};
				},
				{
					name: "memberPlayerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "arg";
								path: "member";
							},
						];
					};
				},
			];
			args: [
				{
					name: "member";
					type: "pubkey";
				},
			];
		},
		{
			name: "updateSquadInfo";
			discriminator: [217, 142, 107, 234, 229, 67, 174, 22];
			accounts: [
				{
					name: "squad";
					writable: true;
					relations: ["captainData"];
				},
				{
					name: "captain";
					writable: true;
					signer: true;
				},
				{
					name: "captainData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "captain";
							},
						];
					};
				},
				{
					name: "nameAccount";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [110, 97, 109, 101];
							},
							{
								kind: "arg";
								path: "name";
							},
						];
					};
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "name";
					type: "string";
				},
				{
					name: "logoUrl";
					type: "string";
				},
				{
					name: "description";
					type: "string";
				},
			];
		},
		{
			name: "withdraw";
			discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
			accounts: [
				{
					name: "player";
					writable: true;
					signer: true;
				},
				{
					name: "playerData";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 108, 97, 121, 101, 114, 95, 100, 97, 116, 97];
							},
							{
								kind: "account";
								path: "player";
							},
						];
					};
				},
				{
					name: "order";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [111, 114, 100, 101, 114];
							},
							{
								kind: "arg";
								path: "orderNumber";
							},
						];
					};
				},
				{
					name: "orderVault";
					writable: true;
					relations: ["order"];
				},
				{
					name: "tokenAccount";
					writable: true;
					relations: ["playerData"];
				},
				{
					name: "pool";
					writable: true;
					pda: {
						seeds: [
							{
								kind: "const";
								value: [112, 111, 111, 108];
							},
						];
					};
				},
				{
					name: "tokenProgram";
					address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
				},
				{
					name: "systemProgram";
					address: "11111111111111111111111111111111";
				},
			];
			args: [
				{
					name: "orderNumber";
					type: "u16";
				},
			];
		},
	];
	accounts: [
		{
			name: "config";
			discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
		},
		{
			name: "game";
			discriminator: [27, 90, 166, 125, 74, 100, 121, 18];
		},
		{
			name: "name";
			discriminator: [138, 96, 142, 48, 110, 26, 183, 234];
		},
		{
			name: "order";
			discriminator: [134, 173, 223, 185, 77, 86, 28, 51];
		},
		{
			name: "period";
			discriminator: [238, 24, 19, 43, 114, 210, 252, 212];
		},
		{
			name: "playerData";
			discriminator: [197, 65, 216, 202, 43, 139, 147, 128];
		},
		{
			name: "pool";
			discriminator: [241, 154, 109, 4, 17, 177, 109, 188];
		},
		{
			name: "round";
			discriminator: [87, 127, 165, 51, 73, 78, 116, 174];
		},
		{
			name: "squad";
			discriminator: [224, 107, 111, 49, 238, 116, 28, 160];
		},
		{
			name: "voucher";
			discriminator: [191, 204, 149, 234, 213, 165, 13, 65];
		},
	];
	events: [
		{
			name: "transferEvent";
			discriminator: [100, 10, 46, 113, 8, 28, 179, 125];
		},
	];
	errors: [
		{
			code: 6000;
			name: "insufficientSquadRewardBalance";
			msg: "Insufficient squad reward balance";
		},
		{
			code: 6001;
			name: "squadFull";
			msg: "Squad is full";
		},
		{
			code: 6002;
			name: "applicationListFull";
			msg: "Application list is full";
		},
		{
			code: 6003;
			name: "alreadyApplied";
			msg: "Player has already applied to join";
		},
		{
			code: 6004;
			name: "alreadyMember";
			msg: "Player is already a member of the squad";
		},
		{
			code: 6005;
			name: "applicationNotFound";
			msg: "Application not found";
		},
		{
			code: 6006;
			name: "managerListFull";
			msg: "Manager list is full";
		},
		{
			code: 6007;
			name: "alreadyManager";
			msg: "Player is already a manager";
		},
		{
			code: 6008;
			name: "notSquadMember";
			msg: "Player is not a squad member";
		},
		{
			code: 6009;
			name: "managerNotFound";
			msg: "Manager not found";
		},
		{
			code: 6010;
			name: "memberNotFound";
			msg: "Member not found";
		},
		{
			code: 6011;
			name: "captainCannotLeave";
			msg: "Captain cannot leave the squad";
		},
		{
			code: 6012;
			name: "nameTooLong";
			msg: "Squad name is too long";
		},
		{
			code: 6013;
			name: "logoUrlTooLong";
			msg: "Squad logo URL is too long";
		},
		{
			code: 6014;
			name: "descriptionTooLong";
			msg: "Squad description is too long";
		},
	];
	types: [
		{
			name: "config";
			docs: ["Configuration account structure", "配置账户结构"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "authority";
						docs: ["Authority's public key", "权限公钥"];
						type: "pubkey";
					},
					{
						name: "tokenMint";
						docs: ["Main token mint public key", "主要代币铸造公钥"];
						type: "pubkey";
					},
					{
						name: "voucherMint";
						docs: ["Voucher token mint public key", "代金券代币铸造公钥"];
						type: "pubkey";
					},
					{
						name: "nonce";
						docs: ["Nonce for unique identification", "用于唯一标识的nonce值"];
						type: "u32";
					},
					{
						name: "lastUpdated";
						docs: ["Timestamp of the last update", "最后更新时间戳"];
						type: "u64";
					},
				];
			};
		},
		{
			name: "eventData";
			type: {
				kind: "enum";
				variants: [
					{
						name: "autoReinvest";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "period";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "referrer";
								type: "pubkey";
							},
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "purchaseQuantity";
								type: "u64";
							},
						];
					},
					{
						name: "collectDeveloperRewards";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "rewardAmount";
								type: "u64";
							},
						];
					},
					{
						name: "distributeGrandPrizes";
						fields: [
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "index";
								type: "u8";
							},
							{
								name: "prizeAmount";
								type: "u64";
							},
						];
					},
					{
						name: "distributeLeaderboardRewards";
						fields: [
							{
								name: "period";
								type: "pubkey";
							},
							{
								name: "squadFirst";
								type: "pubkey";
							},
							{
								name: "squadSecond";
								type: "pubkey";
							},
							{
								name: "squadThird";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
						];
					},
					{
						name: "increaseGameBalance";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
						];
					},
					{
						name: "increasePoolBalance";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "pool";
								type: "pubkey";
							},
						];
					},
					{
						name: "increaseRegistrationRewardSlots";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "additionalSlots";
								type: "u64";
							},
						];
					},
					{
						name: "initializeDefaultPlayer";
					},
					{
						name: "initializeDefaultSquad";
					},
					{
						name: "initializeDefaultToken";
					},
					{
						name: "initializeGame";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializeNextPeriod";
						fields: [
							{
								name: "period";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializeNextRound";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "currentRound";
								type: "pubkey";
							},
							{
								name: "nextRound";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializePeriod";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "period";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializePool";
						fields: [
							{
								name: "pool";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializeRound";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializeVoucher";
						fields: [
							{
								name: "voucher";
								type: "pubkey";
							},
						];
					},
					{
						name: "initialize";
						fields: [
							{
								name: "config";
								type: "pubkey";
							},
						];
					},
					{
						name: "deposit";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "amount";
								type: "u64";
							},
							{
								name: "orderNumber";
								type: "u16";
							},
						];
					},
					{
						name: "requestEarlyUnlock";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "orderNumber";
								type: "u16";
							},
						];
					},
					{
						name: "withdraw";
						fields: [
							{
								name: "orderNumber";
								type: "u16";
							},
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "amount";
								type: "u64";
							},
						];
					},
					{
						name: "cancelAutoReinvest";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
						];
					},
					{
						name: "collateralExchange";
						fields: [];
					},
					{
						name: "collectReferrerRewards";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "rewardAmount";
								type: "u64";
							},
						];
					},
					{
						name: "exit";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "purchaseQuantity";
								type: "u64";
							},
						];
					},
					{
						name: "initializePlayer";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "referrer";
								type: "pubkey";
							},
						];
					},
					{
						name: "initializeToken";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "tokenAccount";
								type: "pubkey";
							},
							{
								name: "voucherAccount";
								type: "pubkey";
							},
						];
					},
					{
						name: "purchase";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "period";
								type: "pubkey";
							},
							{
								name: "referrer";
								type: "pubkey";
							},
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "purchaseQuantity";
								type: "u64";
							},
						];
					},
					{
						name: "reinvest";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "period";
								type: "pubkey";
							},
							{
								name: "referrer";
								type: "pubkey";
							},
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "purchaseQuantity";
								type: "u64";
							},
						];
					},
					{
						name: "revealDrawLotteryResult";
						fields: [
							{
								name: "game";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
						];
					},
					{
						name: "setAutoReinvest";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "round";
								type: "pubkey";
							},
						];
					},
					{
						name: "setReferrer";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "referrer";
								type: "pubkey";
							},
						];
					},
					{
						name: "settlePreviousRound";
						fields: [
							{
								name: "round";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
						];
					},
					{
						name: "acceptSquadApplication";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "applicant";
								type: "pubkey";
							},
						];
					},
					{
						name: "applyToJoinSquad";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
						];
					},
					{
						name: "createSquad";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "player";
								type: "pubkey";
							},
						];
					},
					{
						name: "distributeSquadRewards";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "member";
								type: "pubkey";
							},
							{
								name: "rewardAmount";
								type: "u64";
							},
						];
					},
					{
						name: "grantManagerPrivileges";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "member";
								type: "pubkey";
							},
						];
					},
					{
						name: "leaveSquad";
						fields: [
							{
								name: "player";
								type: "pubkey";
							},
							{
								name: "squad";
								type: "pubkey";
							},
						];
					},
					{
						name: "rejectSquadApplication";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "applicant";
								type: "pubkey";
							},
							{
								name: "rejector";
								type: "pubkey";
							},
						];
					},
					{
						name: "removeMemberFromSquad";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "member";
								type: "pubkey";
							},
							{
								name: "manager";
								type: "pubkey";
							},
						];
					},
					{
						name: "revokeManagerPrivileges";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "manager";
								type: "pubkey";
							},
						];
					},
					{
						name: "transferSquadCaptaincy";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
							{
								name: "captain";
								type: "pubkey";
							},
							{
								name: "newCaptain";
								type: "pubkey";
							},
						];
					},
					{
						name: "updateSquadInfo";
						fields: [
							{
								name: "squad";
								type: "pubkey";
							},
						];
					},
				];
			};
		},
		{
			name: "eventType";
			type: {
				kind: "enum";
				variants: [
					{
						name: "autoReinvest";
					},
					{
						name: "collectDeveloperRewards";
					},
					{
						name: "distributeGrandPrizes";
					},
					{
						name: "distributeLeaderboardRewards";
					},
					{
						name: "increaseGameBalance";
					},
					{
						name: "increasePoolBalance";
					},
					{
						name: "increaseRegistrationRewardSlots";
					},
					{
						name: "initializeDefaultPlayer";
					},
					{
						name: "initializeDefaultSquad";
					},
					{
						name: "initializeDefaultToken";
					},
					{
						name: "initializeGame";
					},
					{
						name: "initializeNextPeriod";
					},
					{
						name: "initializeNextRound";
					},
					{
						name: "initializePeriod";
					},
					{
						name: "initializePool";
					},
					{
						name: "initializeRound";
					},
					{
						name: "initializeVoucher";
					},
					{
						name: "initialize";
					},
					{
						name: "deposit";
					},
					{
						name: "requestEarlyUnlock";
					},
					{
						name: "withdraw";
					},
					{
						name: "cancelAutoReinvest";
					},
					{
						name: "collateralExchange";
					},
					{
						name: "collectReferrerRewards";
					},
					{
						name: "exit";
					},
					{
						name: "initializePlayer";
					},
					{
						name: "initializeToken";
					},
					{
						name: "purchase";
					},
					{
						name: "reinvest";
					},
					{
						name: "revealDrawLotteryResult";
					},
					{
						name: "setAutoReinvest";
					},
					{
						name: "setReferrer";
					},
					{
						name: "settlePreviousRound";
					},
					{
						name: "acceptSquadApplication";
					},
					{
						name: "applyToJoinSquad";
					},
					{
						name: "createSquad";
					},
					{
						name: "distributeSquadRewards";
					},
					{
						name: "grantManagerPrivileges";
					},
					{
						name: "leaveSquad";
					},
					{
						name: "rejectSquadApplication";
					},
					{
						name: "removeMemberFromSquad";
					},
					{
						name: "revokeManagerPrivileges";
					},
					{
						name: "transferSquadCaptaincy";
					},
					{
						name: "updateSquadInfo";
					},
				];
			};
		},
		{
			name: "game";
			docs: ["Game's global state", "游戏的全局状态"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "gameVault";
						docs: ["Game vault account public key", "游戏金库账户公钥"];
						type: "pubkey";
					},
					{
						name: "currentRound";
						docs: ["Current round public key", "当前轮次公钥"];
						type: "pubkey";
					},
					{
						name: "totalBalance";
						docs: ["Game total balance", "游戏总余额"];
						type: "u64";
					},
					{
						name: "constructionWorkerSalaryPoolBalance";
						docs: [
							"Construction worker salary pool balance",
							"建造工人工资池余额",
						];
						type: "u64";
					},
					{
						name: "totalConstructionWorkerSalariesClaimed";
						docs: [
							"Total construction worker salaries claimed",
							"已领取的建造工人工资总数",
						];
						type: "u64";
					},
					{
						name: "bonusSalaryPoolBalance";
						docs: ["Bonus salary pool balance", "奖励工资池余额"];
						type: "u64";
					},
					{
						name: "totalBonusSalariesClaimed";
						docs: ["Total bonus salaries claimed", "已领取的奖励工资总数"];
						type: "u64";
					},
					{
						name: "specialRewardPoolBalance";
						docs: ["Special reward pool balance", "特别奖励池余额"];
						type: "u64";
					},
					{
						name: "totalSpecialRewardsClaimed";
						docs: ["Total special rewards claimed", "已领取的特别奖励总额"];
						type: "u64";
					},
					{
						name: "developerPoolBalance";
						docs: ["Developer pool balance", "开发者池余额"];
						type: "u64";
					},
					{
						name: "totalDeveloperRewardsClaimed";
						docs: ["Total developer rewards claimed", "已领取的开发者奖励总额"];
						type: "u64";
					},
					{
						name: "referrerRewardPoolBalance";
						docs: ["Referrer reward pool balance", "推荐人奖励池余额"];
						type: "u64";
					},
					{
						name: "totalReferrerRewardsClaimed";
						docs: ["Total referrer rewards claimed", "已领取的推荐人奖励总额"];
						type: "u64";
					},
					{
						name: "registrationRewardPoolBalance";
						docs: ["Registration reward pool balance", "注册奖励池余额"];
						type: "u64";
					},
					{
						name: "totalRegistrationRewardsClaimed";
						docs: [
							"Total registration rewards claimed",
							"已领取的注册奖励总额",
						];
						type: "u64";
					},
					{
						name: "singleRegistrationRewardAmount";
						docs: ["Single registration reward amount", "单次注册奖励金额"];
						type: "u64";
					},
					{
						name: "remainingRegistrationRewardSlots";
						docs: [
							"Remaining slots for registration rewards",
							"剩余可获得注册奖励的名额",
						];
						type: "u64";
					},
					{
						name: "totalExitRewardsClaimed";
						docs: ["Total exit rewards claimed", "已领取的退出奖励总额"];
						type: "u64";
					},
					{
						name: "nonce";
						docs: ["Game's nonce", "游戏的随机数"];
						type: "u16";
					},
					{
						name: "bump";
						docs: ["Bump for PDA validation", "PDA 验证的膨胀值"];
						type: "u8";
					},
					{
						name: "defaultSquad";
						docs: ["Default squad public key", "默认战队公钥"];
						type: "pubkey";
					},
				];
			};
		},
		{
			name: "initiatorType";
			type: {
				kind: "enum";
				variants: [
					{
						name: "system";
					},
					{
						name: "player";
					},
					{
						name: "squad";
					},
					{
						name: "order";
					},
				];
			};
		},
		{
			name: "name";
			type: {
				kind: "struct";
				fields: [
					{
						name: "owner";
						type: {
							option: "pubkey";
						};
					},
				];
			};
		},
		{
			name: "order";
			type: {
				kind: "struct";
				fields: [
					{
						name: "depositAmount";
						docs: ["存入的数量", "Amount deposited"];
						type: "u64";
					},
					{
						name: "minedAmount";
						docs: ["已经挖出来的数量", "Amount of resources mined"];
						type: "u64";
					},
					{
						name: "lockedAmount";
						docs: ["锁定的数量", "Amount of resources locked"];
						type: "u64";
					},
					{
						name: "orderVault";
						docs: ["订单金库", "Order vault public key"];
						type: "pubkey";
					},
					{
						name: "orderTimestamp";
						docs: ["订单创建时间戳", "Timestamp when the order was created"];
						type: "u64";
					},
					{
						name: "withdrawableTimestamp";
						docs: [
							"可提取时间戳",
							"Timestamp when the order becomes withdrawable",
						];
						type: "u64";
					},
					{
						name: "annualPercentageRate";
						docs: [
							"年化率（基点，1 basis point = 0.01%）",
							"Annual percentage rate (in basis points, 1 basis point = 0.01%)",
						];
						type: "u16";
					},
					{
						name: "earlyUnlockApr";
						docs: ["提前解锁年化率", "Early unlock annual percentage rate"];
						type: "u16";
					},
					{
						name: "earlyUnlockRequested";
						docs: [
							"是否请求提前解锁",
							"Whether early unlock has been requested",
						];
						type: "bool";
					},
					{
						name: "earlyUnlockTimestamp";
						docs: ["提前解锁时间戳", "Timestamp for early unlock"];
						type: "u64";
					},
					{
						name: "bump";
						docs: ["用于PDA派生的bump", "Bump used for PDA derivation"];
						type: "u8";
					},
					{
						name: "isCompleted";
						docs: ["是否完成", "Whether the order is completed"];
						type: "bool";
					},
				];
			};
		},
		{
			name: "period";
			type: {
				kind: "struct";
				fields: [
					{
						name: "periodNumber";
						docs: ["Period number", "期数"];
						type: "u16";
					},
					{
						name: "startTime";
						docs: ["Start time of the period", "期间开始时间"];
						type: "u64";
					},
					{
						name: "endTime";
						docs: ["End time of the period", "期间结束时间"];
						type: "u64";
					},
					{
						name: "periodVault";
						docs: ["Token vault account", "代币保管账户"];
						type: "pubkey";
					},
					{
						name: "topPlayers";
						docs: ["Top player accounts", "顶级玩家账户列表"];
						type: {
							vec: {
								defined: {
									name: "topPlayerAccount";
								};
							};
						};
					},
					{
						name: "topSquads";
						docs: ["Top squad accounts", "顶级团队账户列表"];
						type: {
							vec: {
								defined: {
									name: "topSquadAccount";
								};
							};
						};
					},
					{
						name: "squadRewardAmount";
						docs: ["Total squad reward amount", "团队总奖励金额"];
						type: "u64";
					},
					{
						name: "squadFirstPlaceRewardAmount";
						docs: ["Squad first place reward amount", "团队一等奖奖励金额"];
						type: "u64";
					},
					{
						name: "squadSecondPlaceRewardAmount";
						docs: ["Squad second place reward amount", "团队二等奖奖励金额"];
						type: "u64";
					},
					{
						name: "squadThirdPlaceRewardAmount";
						docs: ["Squad third place reward amount", "团队三等奖奖励金额"];
						type: "u64";
					},
					{
						name: "individualRewardAmount";
						docs: ["Individual reward amount", "个人奖励金额"];
						type: "u64";
					},
					{
						name: "isDistributionCompleted";
						docs: ["Whether rewards have been distributed", "是否已分发奖励"];
						type: "bool";
					},
				];
			};
		},
		{
			name: "playerData";
			docs: ["Player account structure", "玩家账户结构"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "player";
						docs: ["Player's public key", "玩家的公钥"];
						type: "pubkey";
					},
					{
						name: "nonce";
						docs: ["Nonce for unique identification", "用于唯一标识的nonce值"];
						type: "u16";
					},
					{
						name: "tokenAccount";
						docs: ["The player's main token account", "玩家的主要代币账户"];
						type: "pubkey";
					},
					{
						name: "voucherAccount";
						docs: [
							"The player's voucher token account",
							"玩家的代金券代币账户",
						];
						type: "pubkey";
					},
					{
						name: "referrer";
						docs: ["The referrer's public key", "推荐人的公钥"];
						type: "pubkey";
					},
					{
						name: "referralCount";
						docs: ["Referral count", "邀请的人数"];
						type: "u16";
					},
					{
						name: "squad";
						docs: ["Squad's public key", "战队的公钥"];
						type: "pubkey";
					},
					{
						name: "squadApplications";
						docs: [
							"List of squad's public key applications",
							"申请加入的战队列表",
						];
						type: {
							vec: "pubkey";
						};
					},
					{
						name: "canApplySquadTimestamp";
						docs: [
							"The timestamp when the player can apply for a squad",
							"可以申请战队的时间",
						];
						type: "u64";
					},
					{
						name: "pendingReferrerRewards";
						docs: [
							"Pending referrer rewards to be claimed",
							"待领取的邀请奖励",
						];
						type: "u64";
					},
					{
						name: "totalReferrerRewardsClaimed";
						docs: ["Total referrer rewards claimed", "总共已领取的邀请奖励"];
						type: "u64";
					},
					{
						name: "currentRound";
						docs: [
							"Current round the player is participating in",
							"玩家当前参与的轮次",
						];
						type: "pubkey";
					},
					{
						name: "currentPeriod";
						docs: ["Current period the player is participating in", "当前周期"];
						type: "pubkey";
					},
					{
						name: "earningsPerOre";
						docs: [
							"Earnings per ore unit in the current round",
							"当前轮次用户的每单位收益",
						];
						type: "u64";
					},
					{
						name: "constructionWorkerSalaries";
						docs: [
							"Unclaimed earnings in the current round",
							"当前轮次用户未提取的收益",
						];
						type: "u64";
					},
					{
						name: "oreAmount";
						docs: [
							"Amount of ore in the current round",
							"当前轮次用户的矿石数量",
						];
						type: "u64";
					},
					{
						name: "randomnessAccount";
						docs: ["Randomness account public key", "随机性账户公钥"];
						type: "pubkey";
					},
					{
						name: "randomnessCommitSlot";
						docs: ["Randomness commit slot", "随机性提交槽位"];
						type: "u64";
					},
					{
						name: "randomnessProbability";
						docs: ["Randomness probability", "随机性概率"];
						type: "u32";
					},
					{
						name: "randomnessRewardAmount";
						docs: ["Randomness reward amount", "随机性奖励金额"];
						type: "u64";
					},
					{
						name: "totalPurchaseQuantity";
						docs: [
							"Total quantity of purchases (formerly score)",
							"购买总数量（原为score）",
						];
						type: "u64";
					},
					{
						name: "currentPeriodPurchaseQuantity";
						docs: [
							"Total quantity of purchases in the current period",
							"当期购买的总数量",
						];
						type: "u64";
					},
					{
						name: "autoReinvest";
						docs: ["Whether to automatically reinvest", "是否自动再投资"];
						type: "bool";
					},
					{
						name: "lastPurchaseTimestamp";
						docs: ["Timestamp of the last purchase", "最后一次购买的时间戳"];
						type: "u64";
					},
					{
						name: "hasExited";
						docs: [
							"Whether the player has exited the game",
							"玩家是否已退出游戏",
						];
						type: "bool";
					},
					{
						name: "createdAt";
						docs: ["PlayerData creation timestamp", "玩家数据创建时间戳"];
						type: "u64";
					},
					{
						name: "totalExitRewardsClaimed";
						docs: ["Total exit rewards claimed", "已领取的退出奖励总额"];
						type: "u64";
					},
					{
						name: "pendingExitRewards";
						docs: ["Pending exit rewards", "预计退出奖励"];
						type: "u64";
					},
					{
						name: "orderNumberList";
						docs: ["List of order numbers", "订单编号列表"];
						type: {
							vec: "u16";
						};
					},
				];
			};
		},
		{
			name: "pool";
			type: {
				kind: "struct";
				fields: [
					{
						name: "tokenMint";
						docs: ["Token mint address", "代币铸造地址"];
						type: "pubkey";
					},
					{
						name: "poolVault";
						docs: ["Pool vault address", "资金池保管库地址"];
						type: "pubkey";
					},
					{
						name: "balance";
						docs: ["Current balance of the pool", "资金池当前余额"];
						type: "u64";
					},
					{
						name: "totalMinedAmount";
						docs: ["Total amount of resources mined", "已挖出的资源总量"];
						type: "u64";
					},
					{
						name: "bump";
						docs: ["Bump seed for PDA derivation", "PDA 派生的 bump seed"];
						type: "u8";
					},
					{
						name: "nonce";
						docs: ["Nonce for unique identification", "用于唯一标识的nonce值"];
						type: "u16";
					},
				];
			};
		},
		{
			name: "round";
			type: {
				kind: "struct";
				fields: [
					{
						name: "roundNumber";
						docs: ["Round number", "轮次编号"];
						type: "u16";
					},
					{
						name: "currentPeriod";
						docs: ["Current period", "当前期"];
						type: "pubkey";
					},
					{
						name: "roundVault";
						docs: ["Token vault account", "代币保管账户"];
						type: "pubkey";
					},
					{
						name: "autoReinvestPlayerAmount";
						docs: ["Auto reinvest player amount", "自动复投玩家数量"];
						type: "u32";
					},
					{
						name: "startTime";
						docs: ["Start time of the round", "轮次开始时间"];
						type: "u64";
					},
					{
						name: "endTime";
						docs: ["End time of the round", "轮次结束时间"];
						type: "u64";
					},
					{
						name: "lastCallSlot";
						docs: ["Last call slot", "最后一次调用的时间槽"];
						type: "u64";
					},
					{
						name: "callCount";
						docs: ["Call count for final countdown", "最终倒计时的调用次数"];
						type: "u8";
					},
					{
						name: "earningsPerOre";
						docs: ["Current earnings per ore", "当前每单位矿石的收益"];
						type: "u64";
					},
					{
						name: "soldOres";
						docs: ["Total number of sold ores", "已售出的矿石总数"];
						type: "u64";
					},
					{
						name: "activeOres";
						docs: ["Number of active ores", "活跃的矿石数量"];
						type: "u64";
					},
					{
						name: "grandPrizePoolBalance";
						docs: ["Grand prize pool balance", "大奖池余额"];
						type: "u64";
					},
					{
						name: "firstGrandPrizeAmount";
						docs: ["First grand prize amount", "第一大奖金额"];
						type: "u64";
					},
					{
						name: "secondGrandPrizeAmount";
						docs: ["Second grand prize amount", "第二大奖金额"];
						type: "u64";
					},
					{
						name: "totalGrandPrizesDistributed";
						docs: [
							"Total number of grand prizes distributed",
							"已分发的大奖总数",
						];
						type: "u64";
					},
					{
						name: "lastActiveParticipants";
						docs: ["Last active participants", "最后活跃的参与者"];
						type: {
							vec: "pubkey";
						};
					},
					{
						name: "grandPrizeDistributionIndex";
						docs: ["Index of grand prize distribution", "大奖分发索引"];
						type: "u8";
					},
					{
						name: "isOver";
						docs: ["Is the current round over?", "当前轮次是否结束"];
						type: "bool";
					},
					{
						name: "isGrandPrizeDistributionCompleted";
						docs: [
							"Is grand prize distribution completed?",
							"大奖分发是否完成",
						];
						type: "bool";
					},
					{
						name: "exitRewardsPerSecond";
						docs: ["Exit rewards per second", "每秒退出奖励"];
						type: "u64";
					},
					{
						name: "lastClaimedExitRewardsTimestamp";
						docs: [
							"Timestamp of last claimed exit rewards",
							"上次领取退出奖励的时间戳",
						];
						type: "u64";
					},
					{
						name: "nonce";
						docs: ["Nonce for unique identification", "用于唯一标识的nonce值"];
						type: "u16";
					},
				];
			};
		},
		{
			name: "squad";
			docs: ["Squad account structure", "战队账户结构"];
			type: {
				kind: "struct";
				fields: [
					{
						name: "squadNumber";
						docs: ["Squad number", "战队编号"];
						type: "u32";
					},
					{
						name: "captain";
						docs: ["Squad captain's public key", "战队队长的公钥"];
						type: "pubkey";
					},
					{
						name: "name";
						docs: ["Squad name", "战队名称"];
						type: {
							option: "string";
						};
					},
					{
						name: "logoUrl";
						docs: ["Squad logo URL", "战队logo图片地址"];
						type: {
							option: "string";
						};
					},
					{
						name: "description";
						docs: ["Squad description", "战队介绍"];
						type: {
							option: "string";
						};
					},
					{
						name: "currentPeriod";
						docs: ["Current period", "当前周期"];
						type: "pubkey";
					},
					{
						name: "totalPurchaseQuantity";
						docs: ["Total purchase amount of the squad", "战队总购买金额"];
						type: "u64";
					},
					{
						name: "currentPeriodPurchaseQuantity";
						docs: [
							"Total amount of purchases in the current period",
							"当期购买的总数量",
						];
						type: "u64";
					},
					{
						name: "collectableSquadRewards";
						docs: ["Collectable squad reward", "可领取的战队奖励"];
						type: "u64";
					},
					{
						name: "totalSquadRewardsCollected";
						docs: ["Total squad rewards collected", "已领取的战队奖励总数"];
						type: "u64";
					},
					{
						name: "memberList";
						docs: ["List of squad members", "战队成员列表"];
						type: {
							vec: "pubkey";
						};
					},
					{
						name: "managers";
						docs: ["List of squad managers", "战队管理员列表"];
						type: {
							vec: "pubkey";
						};
					},
					{
						name: "applicationList";
						docs: ["List of applicants", "申请者列表"];
						type: {
							vec: "pubkey";
						};
					},
					{
						name: "lastUpdatedTimestamp";
						docs: ["Last updated timestamp", "最后更新时间戳"];
						type: "u64";
					},
					{
						name: "createdAt";
						docs: ["Squad creation timestamp", "战队创建时间戳"];
						type: "u64";
					},
				];
			};
		},
		{
			name: "topPlayerAccount";
			type: {
				kind: "struct";
				fields: [
					{
						name: "player";
						docs: ["Player's public key", "玩家的公钥"];
						type: "pubkey";
					},
					{
						name: "purchaseQuantity";
						docs: ["Total purchase quantity", "总购买数量"];
						type: "u64";
					},
				];
			};
		},
		{
			name: "topSquadAccount";
			type: {
				kind: "struct";
				fields: [
					{
						name: "squad";
						docs: ["Squad's public key", "团队的公钥"];
						type: "pubkey";
					},
					{
						name: "purchaseQuantity";
						docs: ["Total purchase quantity", "总购买数量"];
						type: "u64";
					},
				];
			};
		},
		{
			name: "transferEvent";
			type: {
				kind: "struct";
				fields: [
					{
						name: "eventType";
						type: {
							defined: {
								name: "eventType";
							};
						};
					},
					{
						name: "data";
						type: {
							defined: {
								name: "eventData";
							};
						};
					},
					{
						name: "initiatorType";
						type: {
							defined: {
								name: "initiatorType";
							};
						};
					},
					{
						name: "initiator";
						type: "pubkey";
					},
					{
						name: "timestamp";
						type: "u64";
					},
				];
			};
		},
		{
			name: "voucher";
			type: {
				kind: "struct";
				fields: [
					{
						name: "voucherMint";
						docs: ["Voucher mint address", "代金券铸造地址"];
						type: "pubkey";
					},
					{
						name: "voucherVault";
						docs: ["Voucher vault address", "代金券保管库地址"];
						type: "pubkey";
					},
					{
						name: "mintedAmount";
						docs: ["Amount of vouchers minted", "已经铸造的代金券数量"];
						type: "u64";
					},
					{
						name: "bump";
						docs: ["Bump seed for PDA derivation", "PDA 派生的 bump 种子"];
						type: "u8";
					},
				];
			};
		},
	];
};
