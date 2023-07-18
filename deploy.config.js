module.exports = {
  apps: [
    {
      name: "JCWDOL-09-04", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8904,
      },
      time: true,
    },
  ],
};
