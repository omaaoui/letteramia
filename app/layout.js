export const metadata = {
  title: "LetteraMia – Italian Document Assistant for Expats",
  description: "Describe your situation in any language, get a formal Italian letter ready to send.",
  icons: { icon: "/letteramia-icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
