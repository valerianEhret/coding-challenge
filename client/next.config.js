module.exports = {
  images: {
    domains: ["assets.kartenmacherei.de"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products/MGG73GG",
        permanent: true,
      },
    ];
  },
};
