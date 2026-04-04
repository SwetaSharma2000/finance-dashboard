import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0b1729",
          color: "#ddeeff",
          border: "1px solid #16263d",
          borderRadius: "14px",
          fontSize: "13px",
          fontWeight: "500",
          padding: "12px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
        success: {
          iconTheme: {
            primary: "#00d9a6",
            secondary: "#060d1c",
          },
          style: {
            background: "#0b1729",
            border: "1px solid #00d9a6/30",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff6b71",
            secondary: "#060d1c",
          },
        },
      }}
    />
  );
}