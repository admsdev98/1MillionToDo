const TASK_CAPS = {
  free: 10,
  premium: 30,
  enterprise: 100,
};

const RATE_LIMITS_PER_MINUTE = {
  free: 30,
  premium: 120,
  enterprise: 600,
};

function isValidPlan(plan) {
  return plan === "free" || plan === "premium" || plan === "enterprise";
}

function getTaskCapForPlan(plan) {
  return TASK_CAPS[plan] ?? TASK_CAPS.free;
}

function getRateLimitPerMinuteForPlan(plan) {
  return RATE_LIMITS_PER_MINUTE[plan] ?? RATE_LIMITS_PER_MINUTE.free;
}

module.exports = {
  isValidPlan,
  getTaskCapForPlan,
  getRateLimitPerMinuteForPlan,
};
