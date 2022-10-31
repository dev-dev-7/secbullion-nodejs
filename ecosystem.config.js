module.exports = {
  apps: [
    {
      name: "mazadee-prod",
      script: "./index.js",
    },
  ],
  deploy: {
    production: {
      user: "root",
      host: "142.93.171.153",
      ref: "origin/master",
      repo: "git@github.com:in-ceptive/mazadee-api-v1.git",
      path: "/var/www/html/api.mazadee.com",
      "post-deploy": "npm ci && npm run-script restart",
    },
  },
};