use anchor_lang::prelude::*;

declare_id!("WW4FYYUvGdGbBrF1tZRqx2d5eQpmUBZnwkPS6hLDV8T");

#[program]
pub mod solana_vote_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
