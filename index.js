const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
})

octokit.repos.get({
  owner: "octokit",
  repo: "rest.js",
}).then(res => {
  console.log('[index]', res)
})
