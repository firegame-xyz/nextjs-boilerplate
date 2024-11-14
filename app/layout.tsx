import { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { Oswald, Major_Mono_Display } from "next/font/google";
import Header from "./components/Header";
import Nav from "./components/widgets/Nav";
import Alert from "./components/Alert";

import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/Footer";

const oswald = Oswald({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-oswald",
});

const major_mono_display = Major_Mono_Display({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-major",
});

export const metadata: Metadata = {
	title: "Doomsday Ark",
	description: "FireGame's first blockchain game",
	icons: {
		icon: "favicon_256.png",
	},
};

export default function RootLayout({
	children,
	modals,
}: Readonly<{
	children: React.ReactNode;
	modals: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className={`${oswald.variable} ${major_mono_display.variable}`}
		>
			<body>
				<Providers>
					<main>
						<Alert />
						<Header />
						<Nav type='mobile' />
						<div className='w-full p-4'>
							<div className='mx-auto max-w-screen-xl'>
								{children}
								<SpeedInsights />
							</div>
						</div>
						<Footer />
						{modals}
					</main>
				</Providers>
			</body>
		</html>
	);
}
