import './globals.css';

export const metadata = {
  title: 'Hustle Village - Auth Demo',
  description: 'Quick public URL starter (localStorage auth)'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
