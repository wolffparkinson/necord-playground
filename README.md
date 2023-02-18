## Necord Playground

Collection of <a href="https://necord.org/">Necord</a> samples for quick prototyping and testing stuff.

> This project was generated using [Nx](https://nx.dev).

![Build](https://github.com/wolffparkinson/necord-playground/actions/workflows/build.yml/badge.svg)

### Prequisites

- [git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/en/) v16+
- [pnpm](https://pnpm.io/installation) v7+
  ```shell
  npm i -g pnpm
  ```

### Usage

- Fork this repository
- Switch to `main` branch
- Create a new branch from `main`
  ```shell
  git switch main
  git switch -c feat/new-example
  ```
- Install depedencies
  ```shell
  pnpm i --frozen-lockfile
  ```
- Update environment variables
  ```shell
  cp .env.example .env
  ```
- Start playground in dev mode
  ```shell
  pnpm start playground
  ```
- Code your heart out
- Document your changes under [Features](#Features)
- Commit and push your branch
- Submit a PR to upstream

### Implementations

- `/ping` : Replies with pong

  - available globally across all guilds

- `/dynamic` : Replies with `I am so dynamic !! 😎` message
  - available only in guild supplied via database (in this demo, process.env.DB_GUILD_ID)
  - hidden in other guilds
