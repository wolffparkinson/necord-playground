# Necord Playground

> Repository of necord examples for quick prototyping and testing

This project was generated using [Nx](https://nx.dev).

### Prequisites

- [git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/en/) v16+
- [pnpm](https://pnpm.io/installation) v7+ : `npm i -g pnpm`

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

### Features

- `/ping` : Replies with pong
