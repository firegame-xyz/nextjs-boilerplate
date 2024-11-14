import { clx } from "@/app/utils/helpers";

interface Props extends React.SVGAttributes<SVGElement> {
	children?: React.ReactNode;
	className?: string;
	contentClassName?: string;
	color?: string;
	color1?: string;
	color2?: string;
	opacity?: string;
	strokeWidth?: string;
}
export const CopyIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	color = "#CED3DB",
	// opacity = "0.8",
	// strokeWidth = "1.5",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color}
					fillRule='evenodd'
					d='M9 1.4a.6.6 0 0 0 0 1.2h7.5a.9.9 0 0 1 .9.9V11a.6.6 0 1 0 1.2 0V3.5a2.1 2.1 0 0 0-2.1-2.1zM3.5 6.2h10a.3.3 0 0 1 .3.3v10a.3.3 0 0 1-.3.3h-10a.3.3 0 0 1-.3-.3v-10a.3.3 0 0 1 .3-.3M2 6.5A1.5 1.5 0 0 1 3.5 5h10A1.5 1.5 0 0 1 15 6.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 2 16.5z'
					clipRule='evenodd'
				/>
			</svg>
			{children}
		</>
	);
};

export const TriangleIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	color1 = "#FEC84B",
	color2 = "#FDB022",
	// opacity = "0.8",
	// strokeWidth = "1.5",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width={48}
				height={48}
				viewBox='0 0 1024 1024'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color1}
					d='M512.646 7.168S-9.594 753.664.134 759.808c10.24 5.632 513.536 257.536 513.536 257.536L512.646 7.168z'
				/>
				<path
					fill={color2}
					d='M511.622 7.168s522.24 746.496 512.512 752.64c-10.24 5.632-513.536 257.536-513.536 257.536L511.622 7.168z'
				/>
			</svg>
			{children}
		</>
	);
};

export const BackIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	color = "#A3A3A3",
	// opacity = "0.8",
	// strokeWidth = "1.5",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width={14}
				height={14}
				viewBox='0 0 1024 1024'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color}
					d='M395.215 513.605 718.351 201.23c19.053-18.416 19.053-48.273 0-66.66-19.054-18.417-49.911-18.417-68.965 0L291.752 480.29c-19.053 18.416-19.053 48.273 0 66.66l357.633 345.688c9.526 9.208 22.012 13.796 34.498 13.796 12.485 0 24.971-4.588 34.467-13.829 19.053-18.416 19.053-48.242 0-66.66L395.215 513.605z'
				/>
			</svg>
			{children}
		</>
	);
};

export const SelectIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	color = "#A3A3A3",
	// opacity = "0.8",
	// strokeWidth = "1.5",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width={18}
				height={18}
				viewBox='0 0 1024 1024'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color}
					d='M512 170.667a42.667 42.667 0 0 1 30.165 12.501l170.667 170.667a42.667 42.667 0 0 1-60.33 60.33L512 273.664 371.499 414.165a42.667 42.667 0 0 1-60.331-60.33l170.667-170.667A42.667 42.667 0 0 1 512 170.667zM311.168 609.835a42.667 42.667 0 0 1 60.33 0L512 750.336l140.501-140.501a42.667 42.667 0 0 1 60.331 60.33L542.165 840.832a42.667 42.667 0 0 1-60.33 0L311.168 670.165a42.667 42.667 0 0 1 0-60.33z'
				/>
			</svg>
			{children}
		</>
	);
};

export const QuestionIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	color = "#F8FFFE",
	// opacity = "0.8",
	// strokeWidth = "1.5",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width={18}
				height={18}
				viewBox='0 0 1024 1024'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color}
					d='M512 56.89c251.335 0 455.11 203.775 455.11 455.11S763.336 967.11 512 967.11 56.89 763.336 56.89 512 260.664 56.89 512 56.89zm-4.056 593.276c-13.085 0-23.78 3.754-31.858 12.516-9.443 8.078-13.824 18.773-13.824 31.857 0 12.516 4.38 23.154 13.824 31.915 8.079 8.704 18.773 13.085 31.857 13.085 12.574 0 23.78-4.38 33.167-12.46 8.704-8.817 13.085-19.399 13.085-32.54 0-13.084-4.38-23.78-13.085-31.857-8.761-8.762-20.025-12.516-33.167-12.516zm10.667-365.721c-45.683 0-81.92 13.084-108.147 39.992-26.907 26.283-39.992 61.896-39.992 107.577v1.024c0 18.375 14.79 33.223 33.166 33.223 18.319 0 33.167-14.848 33.167-33.223 0-.398-.114-1.024-.114-1.024 0-27.591 5.575-49.379 16.839-64.398 12.515-17.522 33.109-26.283 61.326-26.283 22.47 0 39.992 6.258 52.451 18.774 11.89 12.515 18.205 29.411 18.205 51.256 0 16.272-5.69 31.232-16.953 45.626l-10.639 11.888c-38.683 34.362-61.78 60.416-71.28 77.484-14.166 25.543-11.606 49.152-11.606 49.152 0 18.318 14.905 33.166 33.222 33.166 18.376 0 30.493-12.63 33.168-33.166 0 0 3.413-19.115 10.296-31.631 5.632-11.207 14.392-21.901 25.6-31.857 30.094-25.657 47.559-41.927 53.134-48.81 15.018-19.969 23.097-45.626 23.097-76.232 0-37.489-12.458-67.527-36.807-89.43-25.032-22.47-57.515-33.108-98.133-33.108z'
				/>
			</svg>
			{children}
		</>
	);
};

export const LeaveIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	// color = "#F8FFFE",
	// opacity = "1",
	// strokeWidth = "1.66667",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 1024 1024'
				fill='currentColor'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path d='M465.252 599.718c-6.785 6.747-6.857 17.761-.073 24.583a17.477 17.477 0 0 0 12.402 5.142c4.413 0 8.9-1.713 12.219-5.069l121.216-120.552L489.874 382.87a17.41 17.41 0 0 0-12.293-5.106c-4.487 0-8.974 1.714-12.33 5.106-6.784 6.785-6.784 17.8 0 24.658l79.048 78.895H206.824c-9.665 0-17.47 7.734-17.47 17.4 0 9.63 7.805 17.398 17.47 17.398h337.292l-78.864 78.497z' />
				<path d='M817.758 188.858c-7.113-7.003-16.34-10.578-25.605-10.578H322.27c-9.265 0-18.493 3.575-25.532 10.578-7.113 7.113-10.578 16.378-10.578 25.605v181.538h35.235V213.515s471.526-.182 471.598-.073l.073.073v582.547s-471.561.11-471.67 0V613.614h-35.236v181.501c0 9.228 3.465 18.493 10.578 25.568 7.04 7.04 16.267 10.58 25.532 10.58h469.884c9.265 0 18.492-3.54 25.605-10.58 7.004-7.075 10.578-16.34 10.578-25.568V214.463c0-9.227-3.574-18.492-10.578-25.605z' />
			</svg>
			{children}
		</>
	);
};

export const PhotoIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	// color = "#F8FFFE",
	// opacity = "1",
	// strokeWidth = "1.66667",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				aria-hidden='true'
				fill='currentColor'
				viewBox='0 0 24 24'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path d='M9.697 3H11v2h-.697l-3 2H5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V10h2v8.5A2.5 2.5 0 0 1 19 21H5a2.5 2.5 0 0 1-2.5-2.5v-11A2.5 2.5 0 0 1 5 5h1.697l3-2zM12 10.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 10.5zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0zM17 2a3 3 0 0 1-3 3v1a3 3 0 0 1 3 3h1a3 3 0 0 1 3-3V5a3 3 0 0 1-3-3h-1z' />
			</svg>
			{children}
		</>
	);
};

export const MenuIcon: React.FC<Props> = ({
	children,
	className,
	// contentClassName,
	// color = "#F8FFFE",
	// opacity = "1",
	// strokeWidth = "1.66667",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width='1em'
				height='1em'
				fill='currentColor'
				stroke='currentColor'
				strokeWidth={0}
				viewBox='0 0 448 512'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					stroke='none'
					d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'
				/>
			</svg>
			{children}
		</>
	);
};

export const CloseIcon: React.FC<Props> = ({
	children,
	className,
	contentClassName,
	color = "#F8FFFE",
	opacity = "1",
	strokeWidth = "1.66667",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				width='1em'
				height='1em'
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<g id='x-close' opacity={opacity}>
					<path
						className={contentClassName}
						id='Icon'
						d='M15 5L5 15M5 5L15 15'
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</g>
			</svg>
			{children}
		</>
	);
};

export const LinkExternalIcon: React.FC<Props> = ({
	children,
	className,
	contentClassName,
	color = "#F8FFFE",
	opacity = "1",
	strokeWidth = "1.66667",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 20 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<g id='link-external-02' opacity={opacity}>
					<path
						className={contentClassName}
						id='Icon'
						d='M17.5 7.50001L17.5 2.50001M17.5 2.50001H12.5M17.5 2.50001L10 10M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V11.6667'
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</g>
			</svg>
			{children}
		</>
	);
};

export const FilterIcon: React.FC<Props> = ({
	children,
	// className,
	// contentClassName,
	// color = "#F8FFFE",
	// opacity = "1",
	strokeWidth = "0",
	...otherProps
}) => {
	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='1em'
				height='1em'
				fill='currentColor'
				stroke='currentColor'
				strokeWidth={strokeWidth}
				aria-hidden='true'
				className='chakra-icon custom-eupi28'
				viewBox='0 0 16 16'
				{...otherProps}
			>
				<path
					fillRule='evenodd'
					stroke='none'
					d='M15 2v1.67l-5 4.759V14H6V8.429l-5-4.76V2h14zM7 8v5h2V8l5-4.76V3H2v.24L7 8z'
					clipRule='evenodd'
				/>
			</svg>
			{children}
		</>
	);
};

export const TwitterIcon: React.FC<Props> = ({
	children,
	className,
	contentClassName,
	color = "#F8FFFE",
	opacity = "0.7",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 357 322'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<path
					fill={color}
					fillOpacity={opacity}
					d='M281.026.125h54.582l-119.246 136.29 140.283 185.46h-109.84l-86.031-112.48-98.439 112.48H7.72l127.545-145.777L.691.125H113.32l77.764 102.812L281.026.125Zm-19.157 289.08h30.245L96.886 31.079H64.43L261.87 289.205Z'
				/>
			</svg>
			{children}
		</>
	);
};

export const DiscordIcon: React.FC<Props> = ({
	children,
	className,
	contentClassName,
	color = "#F8FFFE",
	opacity = "0.7",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 16 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<g id='Socials' opacity={opacity}>
					<path
						className={contentClassName}
						id='Vector'
						d='M12.6381 3.76949C12.6381 3.76949 12.6381 3.76949 12.6154 3.76949C11.7534 3.36113 10.846 3.08892 9.91589 2.93012C9.89321 2.90744 9.87052 2.93012 9.87052 2.93012C9.73444 3.15697 9.621 3.40652 9.53024 3.63337C8.50943 3.47457 7.48859 3.47457 6.46778 3.63337C6.37702 3.40652 6.26358 3.15697 6.1275 2.93012C6.1275 2.93012 6.10481 2.90744 6.0821 2.93012C5.15201 3.08892 4.24461 3.36113 3.38256 3.76949C3.35988 3.76949 3.35988 3.76949 3.35988 3.76949C1.63582 6.35559 1.15943 8.87364 1.38629 11.369C1.38629 11.369 1.38629 11.3917 1.40897 11.3917C2.40712 12.1403 3.54136 12.7074 4.74369 13.0704C4.74369 13.0931 4.76637 13.0704 4.78905 13.0704C5.03861 12.7074 5.26545 12.3445 5.46961 11.9588C5.46961 11.9361 5.46961 11.9135 5.44693 11.8908C5.08397 11.7547 4.72101 11.5959 4.40341 11.3917C4.38073 11.3917 4.35805 11.3463 4.40341 11.3236C4.47145 11.2783 4.53953 11.2329 4.60757 11.1649C4.60757 11.1649 4.63025 11.1649 4.65296 11.1649C6.83074 12.163 9.18996 12.163 11.3451 11.1649C11.3677 11.1649 11.3677 11.1649 11.3905 11.1649C11.4585 11.2329 11.5265 11.2783 11.5946 11.3236C11.6173 11.3463 11.6173 11.3917 11.5946 11.3917C11.2543 11.5959 10.914 11.7547 10.5511 11.8908C10.5284 11.9135 10.5284 11.9361 10.5284 11.9588C10.7326 12.3445 10.9594 12.7074 11.209 13.0704C11.2317 13.0704 11.2316 13.0931 11.2543 13.0704C12.4566 12.7074 13.5909 12.1403 14.589 11.3917C14.6117 11.3917 14.6117 11.369 14.6117 11.369C14.884 8.488 14.1353 5.99262 12.6381 3.76949ZM5.78721 9.84909C5.12933 9.84909 4.58489 9.23661 4.58489 8.51068C4.58489 7.76207 5.12933 7.17227 5.78721 7.17227C6.46778 7.17227 6.98951 7.76207 6.98951 8.51068C6.98951 9.23661 6.44506 9.84909 5.78721 9.84909ZM10.2108 9.84909C9.55292 9.84909 9.03119 9.23661 9.03119 8.51068C9.03119 7.76207 9.55292 7.17227 10.2108 7.17227C10.8914 7.17227 11.4358 7.76207 11.4131 8.51068C11.4131 9.23661 10.8914 9.84909 10.2108 9.84909Z'
						fill={color}
					/>
				</g>
			</svg>
			{children}
		</>
	);
};

export const TelegramIcon: React.FC<Props> = ({
	children,
	className,
	contentClassName,
	color = "#F8FFFE",
	opacity = "0.9",
	...otherProps
}) => {
	return (
		<>
			<svg
				className={clx("icon-base", className)}
				viewBox='0 0 21 20'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				{...otherProps}
			>
				<g id='Socials' opacity={opacity}>
					<path
						className={contentClassName}
						id='Vector'
						d='M17.9686 2.79715C17.9559 2.73367 17.9279 2.67499 17.8874 2.6271C17.847 2.57921 17.7956 2.54384 17.7384 2.5246C17.5305 2.47981 17.3153 2.4964 17.1155 2.57264C17.1155 2.57264 3.24175 7.98881 2.44975 8.58372C2.27912 8.713 2.22198 8.78812 2.19381 8.87548C2.05698 9.30267 2.48356 9.48699 2.48356 9.48699L6.05883 10.7519C6.11918 10.7636 6.18121 10.7597 6.23992 10.7406C7.05364 10.1824 14.4239 5.13135 14.8521 4.96187C14.9189 4.94003 14.9689 4.96187 14.9559 5.01515C14.7853 5.66335 8.38411 11.8395 8.38411 11.8395C8.36829 11.8616 8.35506 11.8856 8.34468 11.9112L8.33662 11.9059L8.0026 15.7557C8.0026 15.7557 7.86335 16.9351 8.94913 15.7557C9.71537 14.9232 10.4575 14.2279 10.8285 13.8889C12.0584 14.8106 13.3816 15.83 13.9523 16.3629C14.048 16.4636 14.1615 16.5425 14.286 16.5946C14.4105 16.6466 14.5433 16.6709 14.6766 16.6661C15.2183 16.6442 15.3697 15.9977 15.3697 15.9977C15.3697 15.9977 17.8978 4.95575 17.9782 3.47679C17.9863 3.33178 17.9975 3.23918 17.9992 3.13959C18.0034 3.02442 17.9936 2.90917 17.9686 2.79715Z'
						fill={color}
						fillOpacity={opacity}
					/>
				</g>
			</svg>
			{children}
		</>
	);
};
