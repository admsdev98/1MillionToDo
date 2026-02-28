# BACK-CARD-005: subscription plans, task caps, and rate limiting

**Type**: feature
**Priority**: medium
**Status**: pending
**Sprint**: 01

## Goal
Implement plan-based task caps and rate limiting.

## Plans (locked)
- free: 10 owned tasks
- premium: 30 owned tasks
- enterprise: 100 owned tasks

## Rate limiting (defaults)
- free: 30 req/min
- premium: 120 req/min
- enterprise: 600 req/min

## Acceptance criteria
- [ ] Creating tasks enforces caps based on plan.
- [ ] Rate limiting triggers based on plan.
- [ ] Limits apply per userId (auth) and per IP (unauth).
