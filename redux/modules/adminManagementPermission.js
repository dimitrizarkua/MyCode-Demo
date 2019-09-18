// @flow

export type Permission =
  // ""
  "kyc-read" |
  "kyc-write" |
  // "operations"
  "userinfo-read" |
  "userinfo-write" |
  "withdraw-read" |
  "withdraw-write" |
  "referral-write" |
  // "kycBoss"
  "kycreport-read" |
  // "admin-management"
  "admin-management-read" |
  "admin-management-write" |
  // "checkSanctionsPEP"
  "pep-read";
