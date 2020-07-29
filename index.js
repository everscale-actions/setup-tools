const github = require('@actions/github');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

const gitHubToken = core.getInput('gitHubToken');
const octokit = github.getOctokit(gitHubToken)

const toolsDir = 'tools';

const tools = [
    {
        name: 'solc',
        repoOwner: 'ton-actions',
        repoName: 'build-solc',
        assetPrefix: 'solc',
        addToPath: true
    },
    {
        name: 'stdlib_sol.tvm',
        repoOwner: 'ton-actions',
        repoName: 'build-solc',
        assetPrefix: 'stdlib_sol.tvm',
        addEnvVariable: 'TVM_LINKER_LIB_PATH'
    },
    {
        name: 'tonos-cli',
        repoOwner: 'ton-actions',
        repoName: 'build-tonos-cli',
        assetPrefix: 'tonos-cli',
        addToPath: true
    },
    {
        name: 'tvm_linker',
        repoOwner: 'ton-actions',
        repoName: 'build-tvm-linker',
        assetPrefix: 'tvm_linker',
        addToPath: true
    }
]

async function getLatestReleaseInfo(repoOwner, repoName, assetPrefix){
    const {data: latestRelease} = await octokit.repos.getLatestRelease({owner: repoOwner, repo: repoName});
    let assertIndex = latestRelease.assets.findIndex(asset => asset.name.startsWith(assetPrefix));
    if (assertIndex<0) {
        throw `Asset was not found. Prefix:${assetPrefix} Release: ${latestRelease.url}`;        
    }
    return { tag: latestRelease.tag_name, assetDownloadUrl: latestRelease.assets[assertIndex].browser_download_url }
}

async function getTool(toolName, toolVersion, downloadUrl) {
    // try get cached tools dir
    let solcDir = tc.find(toolName, toolVersion);

    // else download and cache tools
    if (!solcDir) {
        const archive = await tc.downloadTool(downloadUrl);
        const extractedDir = await tc.extractTar(archive, `${toolsDir}/${toolName}`);
        solcDir = await tc.cacheDir(extractedDir, toolName, toolVersion);
    }
    return solcDir;
}

async function run() {
    try {
        for (const tool of tools) {
            core.info(`Install ${tool.name} Repo:${tool.repoOwner}/${tool.repoName}`)
            
            // get latest release and binary assert download url
            const { tag: solcVersion, assetDownloadUrl: solcAssetDownloadUrl } = await getLatestReleaseInfo(tool.repoOwner, tool.repoName, tool.assetPrefix)
            
            // download or get tool from cache
            const toolDir = await getTool(tool.name, solcVersion, solcAssetDownloadUrl);
            
            // add tool to path env variable
            if (tool.addToPath) {
                core.addPath(toolDir);
            }
            
            // if need add assert with full path to env, for assert like TVM_LINKER_LIB_PATH
            if (tool.addEnvVariable) {
                core.exportVariable(tool.addEnvVariable, `${toolDir}/${tool.name}`)
            }                       
            
            core.info(`Install ${tool.name} Repo:${tool.repoOwner}/${tool.repoName} Done.`)
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();    