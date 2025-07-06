import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
// import IDL from '../target/idl/voting.json'

const IDL = require('../target/idl/voting.json')

// const votingAddress = idl.metadata.address
const votingAddress = '41dehd3qKW3ongna3tHSCcVfzhQhDPDyF2TsFMmCXXVZ'

describe('voting', () => {
  it('Initialize Poll', async () => {
    const context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], [])
    const provider = new BankrunProvider(context)

    const votingProgram = new Program<Voting>(IDL, provider)
  })
})
