import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "TutorTom - Free Online Brain Games & Cognitive Tests | Train Your Mind",
  description:
    "Play free brain training games at TutorTom. Test and improve your memory, reaction time, math speed, and cognitive skills with fun daily brain challenges. No signup required.",
  keywords: [
    "brain games",
    "brain training",
    "cognitive test",
    "memory test",
    "brain test",
    "reaction time test",
    "math speed test",
    "IQ test",
    "mind games",
    "brain exercises",
    "free brain games",
    "online brain games",
    "cognitive training",
    "memory games",
    "mental fitness",
    "brain health",
    "speed match",
    "chimp test",
    "word memory",
    "number memory",
    "brain score",
    "daily brain test",
    "TutorTom",
    "tutor tom",
    "brain challenge",
    "cognitive assessment",
    "mental agility",
    "brain workout",
    "free cognitive test",
    "online memory test",
    "pattern recognition test",
    "visual memory test",
    "brain power",
    "sharpen your mind",
    "improve memory",
    "brain quiz",
    "intelligence test",
    "mental speed test",
  ],
  authors: [{ name: "TutorTom" }],
  creator: "TutorTom",
  publisher: "TutorTom",
  metadataBase: new URL("https://play.tutortom.ai"),
  alternates: {
    canonical: "https://play.tutortom.ai",
  },
  openGraph: {
    title: "TutorTom - Free Online Brain Games & Cognitive Tests",
    description:
      "Train your brain with fun daily challenges. Test memory, reaction time, math speed, and more. Play free - no signup required.",
    url: "https://play.tutortom.ai",
    siteName: "TutorTom",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorTom - Free Online Brain Games & Cognitive Tests",
    description:
      "Train your brain with fun daily challenges. Test memory, reaction time, math speed, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EBBRYGRFH3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EBBRYGRFH3');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
