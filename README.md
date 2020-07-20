# setup-tools

<p align="left">
  <a href="https://github.com/ton-actions/setup-tools"><img alt="GitHub Actions status" src="https://github.com/ton-actions/setup-tools/workflows/Main%20workflow/badge.svg"></a>
  <a href="https://github.com/ton-actions/build-solc"><img alt="GitHub Actions status" src="https://github.com/ton-actions/build-solc/workflows/Build%20and%20release%20solidity%20compiler/badge.svg"></a>
  <a href="https://github.com/ton-actions/build-tvm-linker"><img alt="GitHub Actions status" src="https://github.com/ton-actions/build-tvm-linker/workflows/Build%20and%20release%20TVM-Linker/badge.svg"></a>
</p>

This action sets up a tonos cli tools for use in actions.
Avalible tool list:

- [tonos-cli](https://github.com/tonlabs/tonos-cli) 
- [solc](https://github.com/tonlabs/TON-Solidity-Compiler) 
- [tvm_linker](https://github.com/tonlabs/TVM-linker) 
- env variable TVM_LINKER_LIB_PATH set to stdlib_sol.tvm

# Usage

See [action.yml](action.yml)

```yaml
steps:
- uses: actions/checkout@main
- uses: ton-actions/setup-tools@v1
  with:
    gitHubToken: ${{ secrets.GITHUB_TOKEN }}
- run: |
  tonos-cli --version
  solc --version
  tvm_linker --version
```

# Don't forget to tip

My Free TON address: 
0:9b487d68e4f029ab6d92640892d99d1c549ae69b198df414e905350559a165bf

https://ton.surf
