// @ts-nocheck
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
import IDL from '../target/idl/voting.json'
// const IDL = require('../target/idl/voting.json')

// const votingAddress = IDL.address
const votingAddress = new PublicKey('41dehd3qKW3ongna3tHSCcVfzhQhDPDyF2TsFMmCXXVZ')

describe('Voting', () => {
  let context
  let provider
  let votingProgram

  beforeAll(async () => {
    context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], [])
    provider = new BankrunProvider(context)
    // Load the Voting Program TS instance.
    votingProgram = new Program<Voting>(IDL, provider)
  })

  it('Initialize Poll', async () => {
    // Call the initializePoll method.
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        'What is favorite type of peanut butter?',
        new anchor.BN(0),
        new anchor.BN(Date.now() + 60 * 60 * 24 * 1000),
      )
      .rpc()

    // Get the address of the poll.
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingProgram.programId,
    )

    // Fetch the poll data.
    const poll = await votingProgram.account.poll.fetch(pollAddress)
    console.log(poll)

    expect(poll.pollId.toNumber()).toEqual(1)
    expect(poll.description).toEqual('What is favorite type of peanut butter?')
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  })

  it('Initialize Candidate', async () => {
    await votingProgram.methods.initializeCandidate('Smooth', new anchor.BN(1)).rpc()
    await votingProgram.methods.initializeCandidate('Crunchy', new anchor.BN(1)).rpc()

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Crunchy')],
      votingProgram.programId,
    )
    console.log('crunchyAddress', crunchyAddress.toBase58())
    const crunchyCandidate = await votingProgram.account.candidate.fetch(crunchyAddress)
    console.log(crunchyCandidate)
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0)

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Smooth')],
      votingProgram.programId,
    )
    console.log('smoothAddress', smoothAddress.toBase58())
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress)
    console.log(smoothCandidate)
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0)
  })

  it('Vote', async () => {
    await votingProgram.methods.vote('Smooth', new anchor.BN(1)).rpc()

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Smooth')],
      votingProgram.programId,
    )
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress)
    console.log(smoothCandidate)
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1)
  })
})
