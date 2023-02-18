# Necord Playground

This project was generated using [Nx](https://nx.dev).

### Installation

- Clone repo
- Install dependencies
  ```shell
  pnpm i --frozen-lockfile
  ```
- Start playground
  ```shell
  pnpm start playground
  ```

### Contributing

- Fork this repository
- Switch to `base` branch
- Create a branch from `base`
  ```shell
  git switch base
  git switch -c feat/new-example
  ```
- Code your heart out
- Document your changes in [Implementation](#Implementations)
- Commit, push your branch
- Submit a PR to upstream

### Implementations

- `/ping` : Replies with pong

  - available globally across all guilds

- `/dynamic` : Replies with `I am so dynamic !! 😎` message
  - available only in guild supplied via database (in this demo, process.env.DB_GUILD_ID)
  - hidden in other guilds
