"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { clx } from "@/app/utils/helpers";

export default function Nav(props: { type?: string }) {
	const { type } = props;
	const pathname = usePathname();

	return (
		<>
			{type === "mobile" ? (
				<div className='fixed bottom-0 z-10 flex h-12 w-full items-center justify-center bg-warning px-4 sm:hidden'>
					<Link
						href={"/"}
						className={clx(
							"flex-1 text-center",
							pathname === "/" ? "text-base-black" : "text-base-white",
						)}
					>
						Home
					</Link>
					<Link
						href={"/earn"}
						className={clx(
							"flex-1 text-center",
							pathname.split("/")[1] === "earn"
								? "text-base-black"
								: "text-base-white",
						)}
					>
						Earn
					</Link>
					<Link
						href={"/rank"}
						className={clx(
							"flex-1 text-center",
							pathname === "/rank" ? "text-base-black" : "text-base-white",
						)}
					>
						Rank
					</Link>
					<Link
						href={"/squad"}
						className={clx(
							"flex-1 text-center",
							pathname.split("/")[1] === "squad"
								? "text-base-black"
								: "text-base-white",
						)}
					>
						Squad
					</Link>
					<Link
						href={"/winners"}
						className={clx(
							"flex-1 text-center",
							pathname === "/winners" ? "text-base-black" : "text-base-white",
						)}
					>
						Winners
					</Link>
				</div>
			) : (
				<div className='nav hidden h-12 items-center gap-12 sm:flex'>
					<Link
						href={"/"}
						className={clx(
							"text-center",
							pathname === "/" ? "text-warning" : "",
						)}
					>
						Home
					</Link>
					<Link
						href={"/earn"}
						className={clx(
							"text-center",
							pathname === "/earn" ? "text-warning" : "",
						)}
					>
						Earn
					</Link>
					<Link
						href={"/rank"}
						className={clx(
							"text-center",
							pathname === "/rank" ? "text-warning" : "",
						)}
					>
						Rank
					</Link>
					<Link
						href={"/squad"}
						className={clx(
							"text-center",
							pathname.split("/")[1] === "squad" ? "text-warning" : "",
						)}
					>
						Squad
					</Link>
					<Link
						href={"/winners"}
						className={clx(
							"text-center",
							pathname === "/winners" ? "text-warning" : "",
						)}
					>
						Winners
					</Link>
				</div>
			)}
		</>
	);
}
