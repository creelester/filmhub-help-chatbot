# bunn

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Deploy (Render)

This repo includes a `render.yaml` Blueprint that deploys:

- API service from `packages/server`
- Static frontend from `packages/client`

Quick deploy steps:

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Render, click **New > Blueprint** and connect this repo.
3. Set `OPENAI_API_KEY` when prompted.
4. Deploy.

After the first deploy, confirm the API service URL.  
If it differs from `https://filmhub-help-chatbot-api.onrender.com`, update the `/api/*` rewrite destination in `render.yaml`.
