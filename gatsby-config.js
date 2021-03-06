require("dotenv").config()

module.exports = {
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-svgr",
    {
      resolve: "gatsby-plugin-env-variables",
      options: {
        whitelist: [
          "SANITY_PROJECT_ID",
          "SANITY_DATASET",
          "GOOGLE_MAPS_API_KEY",
        ],
      },
    },
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        token: process.env.SANITY_TOKEN,
        overlayDrafts:
          process.env.NODE_ENV !== "production" &&
          process.env.SHOW_DRAFTS !== "false",
        watchMode: process.env.NODE_ENV !== "production",
      },
    },
    {
      resolve: "gatsby-plugin-sanity-image",
      options: {
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Roboto:400,400italic,500,700,900"],
        },
      },
    },
  ].filter(Boolean),
}
