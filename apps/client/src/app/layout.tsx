import "./global.css";
import { Anton } from "@next/font/google";
import { createGetInitialProps } from "@mantine/next";
const anton = Anton({
  weight: "400",
  variable: "--font-anton",
});
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={anton.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="wrapper">
          <div className="page">{children}</div>
        </div>
      </body>
    </html>
  );
};
export default RootLayout;
