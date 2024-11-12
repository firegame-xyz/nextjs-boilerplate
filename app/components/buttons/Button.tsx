import { clx } from "@/app/utils/helpers";

interface ButtonPrimaryProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	onClick?: () => void;
	destructive?: boolean;
	disabled?: boolean;
}

interface ButtonProps extends ButtonPrimaryProps {
	variant?: string;
	styleName?: string;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
	children,
	className,
	contentClassName,
	onClick,
	destructive = false,
	...otherProps
}) => {
	const classes = clx(
		"btn-base",
		destructive
			? "border border-error-600 bg-error-600 hover:border-error-700 hover:bg-error-700 disabled:border-error-200 disabled:bg-error-200"
			: "border border-blue bg-blue hover:bg-base-black shadow-sm shadow-blue/50 disabled:shadow-transparent disabled:border-gray-700 disabled:bg-gray-700 disabled:text-gray-400",
		className,
	);
	return (
		<button onClick={onClick} className={classes} {...otherProps}>
			{children}
		</button>
	);
};

export const ButtonTertiary: React.FC<ButtonPrimaryProps> = ({
	children,
	className,
	contentClassName,
	onClick,
	destructive = false,
	...otherProps
}) => {
	const classes = clx(
		"btn-base text-base-black",
		destructive
			? "border border-error-600 bg-error-600 hover:border-error-700 hover:bg-error-700 disabled:border-error-200 disabled:bg-error-200"
			: "border border-warning bg-warning hover:bg-warning-400 shadow-sm shadow-warning/50 disabled:shadow-transparent disabled:border-gray-700 disabled:bg-gray-700 disabled:text-gray-400",
		className,
	);

	return (
		<button onClick={onClick} className={classes} {...otherProps}>
			{children}
		</button>
	);
};

export const ButtonDefault: React.FC<ButtonPrimaryProps> = ({
	children,
	className,
	contentClassName,
	onClick,
	destructive = false,
	...otherProps
}) => {
	const classes = clx(
		"btn-base text-base-black text-xs",
		destructive
			? "border border-error-600 bg-error-600 hover:border-error-700 hover:bg-error-700 disabled:border-error-200 disabled:bg-error-200"
			: "border text-base-white border-gray-700 bg-gray-700 hover:bg-warning-400 shadow-sm shadow-base-black/50 disabled:shadow-transparent disabled:border-gray-700 disabled:bg-gray-700 disabled:text-gray-400",
		className,
	);

	return (
		<button onClick={onClick} className={classes} {...otherProps}>
			{children}
		</button>
	);
};
