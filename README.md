# The Toturials of Solana

- Refer to: https://www.youtube.com/watch?v=amAq-WHAFs8

## Create the DApps

### Voting dApp

```bash
npx create-solana-dapp voting-dapp -t web3js-react-vite-tailwind-counter --pm npm --skip-install
cd ./voting-dapp
npm install

# Fix the anchor default version not compatibilities. otherwise it's maybe build failure.
sed -i -p 's/[toolchain]/[toolchain]\nchannel = "1.85.0"/g' anchor/Anchor.toml

cat <<EOF >> anchor/programs/counter/Cargo.toml
[dependencies]
anchor-lang = "0.30.1"
proc-macro2 = "=1.0.89"
EOF

cat <<EOF > anchor/rust-toolchain.toml 
[toolchain]
channel = "1.85.0"
#components = ["rustfmt", "clippy", "llvm-tools"]
EOF

npm run anchor build
```

- Create the program IDs

```bash
anchor keys list
#voting: 41dehd3qKW3ongna3tHSCcVfzhQhDPDyF2TsFMmCXXVZ
#counter: CwNP6pNcHNHHu2VE7jBPWeEeUg9SEUXbJj3uuGSUqCZ3
```

