// https://octokit.github.io/rest.js/v18
var fs = require("fs")
const { Octokit } = require("@octokit/rest")
const repos = require("./repos")

// 认证（5000/h）、不认证（60/h）
const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
})

const baseInfoTasks = repos.map(item => octokit.repos.get({
  owner: item.owner,
  repo: item.repo,
}))
const topicsTasks = repos.map(item => octokit.repos.getAllTopics({
  owner: item.owner,
  repo: item.repo,
}))

const getData = async () => {
  const baseInfo = await Promise.all(baseInfoTasks)
  const topics = await Promise.all(topicsTasks)
  const result = baseInfo.map(({data}) => {
    const findTopics = topics.find(item => item.url === `https://api.github.com/repos/${data.full_name}/topics`)
    return {
      topics: findTopics.data.names,
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
  return result
}

getData().then((data) => {
  fs.writeFile('repos.json', JSON.stringify(data), (err) => {
    if (err) {
      return console.log(err)
    }
    console.log("数据更新成功")
  })
})
