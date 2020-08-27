var fs = require("fs")
const { Octokit } = require("@octokit/rest")
const { createOAuthAppAuth } = require("@octokit/auth")
const repos = require("./repos")

// 认证（5000/h）、不认证（60/h）
const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
  authStrategy: createOAuthAppAuth,
  auth: {
    clientId: "095e78751050b0ea6006",
    clientSecret:"b7dca1a93ae62fa9fd841b61d8fc25f9e6dd7b0b",
  }
})

const tasks = repos.map(item => octokit.repos.get({
  owner: item.owner,
  repo: item.repo,
}))

Promise.all(tasks).then(res => {
  const result = res.map(({data}) => {
    return {
      url: data.svn_url,
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      watchers: data.subscribers_count,
      stars: data.stargazers_count,
      forks: data.forks,
      avatar_url: data.owner.avatar_url
    }
  })
  fs.writeFile('repos.json', JSON.stringify(result), (err) => {
    if (err) {
      return console.log(err)
    }
    console.log("数据更新成功")
  })
})
