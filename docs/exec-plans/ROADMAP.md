# Roadmap

This file is informational: it describes what will be built and why, using short checklists.

## DB
- [ ] Create base schema: users, tasks, task_shares, password_reset_tokens
- [ ] Add indexes for ownership and sharing lookups

## BACK
- [ ] Bootstrap Fastify app with pg connection, JWT, and request logging
- [ ] Implement auth: register/login
- [ ] Implement password reset demo flow
- [ ] Implement tasks CRUD (PATCH updates)
- [ ] Implement task sharing (shared recipients read-only)
- [ ] Implement plan caps (free/premium/enterprise)
- [ ] Implement rate limiting per plan (in-memory)
- [ ] Serve frontend static assets from the backend

## FRONT
- [ ] Login/Register screen (real endpoints)
- [ ] Dashboard: list tasks, create task, mark complete
- [ ] Show shared tasks as read-only with a clear badge
- [ ] Settings (optional): show plan + upgrade/downgrade demo + logout

## DOCS
- [x] Define bilingual rules and workflow docs (this repo)
- [ ] Add run instructions and API examples to README (later)
