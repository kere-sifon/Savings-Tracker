/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose", "exceljs"],
  async redirects() {
    return [
      { source: "/entries", destination: "/savings/entries", permanent: false },
      {
        source: "/entries/:path*",
        destination: "/savings/entries/:path*",
        permanent: false,
      },
      { source: "/accounts", destination: "/savings/accounts", permanent: false },
      { source: "/credit", destination: "/savings/credit", permanent: false },
      { source: "/settings", destination: "/savings/settings", permanent: false },
      {
        source: "/deductions",
        destination: "/savings/deductions",
        permanent: false,
      },
      { source: "/api/entries", destination: "/api/savings/entries", permanent: false },
      {
        source: "/api/entries/:path*",
        destination: "/api/savings/entries/:path*",
        permanent: false,
      },
      {
        source: "/api/deductions",
        destination: "/api/savings/deductions",
        permanent: false,
      },
      {
        source: "/api/deductions/:path*",
        destination: "/api/savings/deductions/:path*",
        permanent: false,
      },
      {
        source: "/api/accounts",
        destination: "/api/savings/accounts",
        permanent: false,
      },
      {
        source: "/api/accounts/:path*",
        destination: "/api/savings/accounts/:path*",
        permanent: false,
      },
      { source: "/api/credit", destination: "/api/savings/credit", permanent: false },
      {
        source: "/api/credit/:path*",
        destination: "/api/savings/credit/:path*",
        permanent: false,
      },
      {
        source: "/api/settings",
        destination: "/api/savings/settings",
        permanent: false,
      },
      {
        source: "/api/summary",
        destination: "/api/savings/summary",
        permanent: false,
      },
      { source: "/api/export", destination: "/api/savings/export", permanent: false },
    ];
  },
};

export default nextConfig;
