# BACK-CARD-002: bootstrap fastify app with db, jwt, and request logger

**Type**: feature
**Priority**: high
**Status**: pending
**Sprint**: 01

## Goal
Create the backend skeleton so we can start implementing endpoints incrementally.

## Scope
- Fastify app entry
- pg pool plugin
- JWT plugin
- Request logger middleware (url/method/timestamp/execution time)
- Serve frontend static files from backend

## Acceptance criteria
- [ ] Server starts locally and in Docker.
- [ ] `/v1/health` responds 200.
- [ ] Each request logs method/url/timestamp/duration.
