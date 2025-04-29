import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/",
        destination: "/chat",
        permanent: false,
      },
    ];
  },
  serverExternalPackages: ["pdfmake"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;

  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.rtai.chat",
        port: "",
        pathname: "/storage/v1/object/sign/rtai-assets/**",
      },
      {
        protocol: "https",
        hostname: "api.rtai.chat",
        port: "",
        pathname: "/storage/v1/object/public/Public_assets/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
