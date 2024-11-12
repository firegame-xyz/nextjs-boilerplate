import { useAtom } from "jotai";
import {
	randomnessAtom,
	RandomnessStep,
	CreateRandomnessResponse,
	CommitResponse,
	RevealResponse,
} from "@/app/state";
import { clx } from "../utils/helpers";

const CheckCircleIcon = ({ className }: { className?: string }) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className}>
		<path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.177 15.141l-4.243-4.243 1.414-1.414 2.829 2.829 5.656-5.657 1.414 1.414-7.07 7.071z' />
	</svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className}>
		<path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.243 12.828l-1.414 1.414L12 13.414l-2.828 2.828-1.414-1.414L10.586 12 7.758 9.172l1.414-1.414L12 10.586l2.828-2.828 1.414 1.414L13.414 12l2.829 2.828z' />
	</svg>
);

const SubStep = ({
	label,
	isProcessing,
	isCompleted,
	error,
	txSignature,
	blockTime,
}: {
	label: string;
	isProcessing: boolean;
	isCompleted: boolean;
	error: string | null;
	txSignature?: string;
	blockTime?: number;
}) => (
	<div className='ml-8 mt-2'>
		<div className='flex items-center space-x-2'>
			{isProcessing ? (
				<div className='animate-spin rounded-full h-3 w-3 border-b-2 border-base-white' />
			) : isCompleted ? (
				<CheckCircleIcon className='h-3 w-3 text-primary' />
			) : error ? (
				<XCircleIcon className='h-3 w-3 text-error-600' />
			) : (
				<div className='h-3 w-3 rounded-full border border-gray-600' />
			)}
			<span className='text-sm text-gray-400'>{label}</span>
			{isCompleted && <span className='text-xs text-primary'>Success</span>}
		</div>
		{txSignature && (
			<div className='text-xs text-gray break-all mt-1 ml-5'>
				<a
					href={`https://solscan.io/tx/${txSignature}`}
					target='_blank'
					rel='noopener noreferrer'
					className='hover:text-blue-400 transition-colors'
				>
					View Transaction
				</a>
				{blockTime && (
					<span className='ml-2'>
						({new Date(blockTime * 1000).toLocaleTimeString()})
					</span>
				)}
			</div>
		)}
		{error && (
			<div className='text-xs text-error-600 mt-1 ml-5'>Error: {error}</div>
		)}
	</div>
);

const StatusStep = ({
	label,
	step,
	className = "",
}: {
	label: string;
	step: RandomnessStep & {
		response: CreateRandomnessResponse | CommitResponse | RevealResponse | null;
	};
	className?: string;
}) => {
	const hasResponse = !!step.response;
	const isCompleted = !!step.txSignature;
	const isPending = step.isProcessing;

	return (
		<div
			className={clx(
				"flex-1 p-4 rounded-lg border bg-gray-800/50",
				step.error ? "border-error-600" : "border-gray-800/50",
				className,
			)}
		>
			<div className='flex items-center justify-between mb-2'>
				<span className='font-medium'>{label}</span>
				{isCompleted && (
					<span className='text-xs px-2 py-1 rounded-full bg-primary/10 text-primary'>
						Completed
					</span>
				)}
				{isPending && (
					<span className='text-xs px-2 py-1 rounded-full bg-warning/10 text-warning'>
						Pending
					</span>
				)}
				{step.error && (
					<span className='text-xs px-2 py-1 rounded-full bg-error-600/10 text-error-600'>
						Failed
					</span>
				)}
			</div>

			<SubStep
				label='Fetching Data'
				isProcessing={step.isProcessing && !hasResponse}
				isCompleted={hasResponse}
				error={!hasResponse ? step.error : null}
				blockTime={step.blockTime}
			/>

			<SubStep
				label='Submitting to Chain'
				isProcessing={step.isProcessing && hasResponse && !step.txSignature}
				isCompleted={isCompleted}
				error={hasResponse ? step.error : null}
				txSignature={step.txSignature}
				blockTime={step.blockTime}
			/>
		</div>
	);
};

const RandomnessStatus = () => {
	const [randomness] = useAtom(randomnessAtom);

	const hasAnyActivity =
		randomness.creating.isProcessing ||
		randomness.committing.isProcessing ||
		randomness.revealing.isProcessing ||
		randomness.creating.response ||
		randomness.committing.response ||
		randomness.revealing.response ||
		randomness.creating.error ||
		randomness.committing.error ||
		randomness.revealing.error;

	if (!hasAnyActivity) {
		return null;
	}

	return (
		<div className='my-6 p-4 rounded-xl bg-gray-900/50 border border-gray-800'>
			<h3 className='text-lg font-medium mb-4'>Randomness Generation Status</h3>

			<div className='flex gap-3'>
				<StatusStep
					label='1. Creating Randomness'
					step={randomness.creating}
					className={
						randomness.creating.isProcessing ||
						randomness.creating.txSignature ||
						randomness.creating.error
							? "opacity-100"
							: "opacity-50"
					}
				/>

				<StatusStep
					label='2. Committing Random Value'
					step={randomness.committing}
					className={
						randomness.committing.isProcessing ||
						randomness.committing.txSignature ||
						randomness.committing.error
							? "opacity-100"
							: "opacity-50"
					}
				/>

				<StatusStep
					label='3. Revealing Result'
					step={randomness.revealing}
					className={
						randomness.revealing.isProcessing ||
						randomness.revealing.txSignature ||
						randomness.revealing.error
							? "opacity-100"
							: "opacity-50"
					}
				/>
			</div>

			{randomness.revealing.txSignature && (
				<div className='text-center py-2 text-green-400'>
					✨ Randomness Generation Complete ✨
				</div>
			)}
		</div>
	);
};

export default RandomnessStatus;
