import Purchases, { CustomerInfo, PurchasesPackage, PURCHASES_ERROR_CODE } from 'react-native-purchases';

// EXPO_PUBLIC_REVENUECAT_API_KEY is set to a RevenueCat Test Store public
// key as of 2026-08-03 (see PROJECT_SPEC.md Phase 5.1) — real App Store/Play
// Console products still aren't configured, so this exercises the RevenueCat
// SDK/entitlement plumbing against RevenueCat's sandbox store, not a real
// purchase. Every export below assumes Purchases.configure() has already
// run; callers MUST check isPurchasesConfigured first and fall back to the
// local-only stub (PaywallScreen's pre-RevenueCat behavior) when it's false.
const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

export const isPurchasesConfigured = Boolean(API_KEY);

let configured = false;

// Configure exactly once per app session — react-native-purchases throws if
// you call configure() twice, and PaywallScreen may mount more than once
// (e.g. reopened from Settings, see PaywallScreen.test.tsx).
export function ensurePurchasesConfigured(): void {
  if (configured || !API_KEY) return;
  Purchases.configure({ apiKey: API_KEY });
  configured = true;
}

// Must match the entitlement identifier configured in the RevenueCat
// dashboard for "piercer.ai Pro" (PROJECT_SPEC.md §6) once a real project
// exists — nothing on this end besides the string needs to change. Renamed
// from the old face-reading app's `aura_pro_access` during the piercer.ai
// pivot (2026-08-07) — gates unlimited renders and multi-piercing stacking,
// see studioSlice.ts / entitlementSlice.ts.
const ENTITLEMENT_ID = 'piercer_pro_access';

export function hasActiveEntitlement(customerInfo: CustomerInfo): boolean {
  return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
}

export interface SubscriptionPackages {
  weekly: PurchasesPackage | null;
  monthly: PurchasesPackage | null;
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackages> {
  const offerings = await Purchases.getOfferings();
  return {
    weekly: offerings.current?.weekly ?? null,
    monthly: offerings.current?.monthly ?? null,
  };
}

export class PurchaseCancelledError extends Error {}

export async function purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error) {
    if ((error as { code?: PURCHASES_ERROR_CODE }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      throw new PurchaseCancelledError();
    }
    throw error;
  }
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}
