const mockConfigure = jest.fn();
const mockGetOfferings = jest.fn();
const mockPurchasePackage = jest.fn();
const mockRestorePurchases = jest.fn();

jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    configure: (...args: unknown[]) => mockConfigure(...args),
    getOfferings: (...args: unknown[]) => mockGetOfferings(...args),
    purchasePackage: (...args: unknown[]) => mockPurchasePackage(...args),
    restorePurchases: (...args: unknown[]) => mockRestorePurchases(...args),
  },
  PURCHASES_ERROR_CODE: { PURCHASE_CANCELLED_ERROR: 'PURCHASE_CANCELLED_ERROR' },
}));

function customerInfoWith(activeEntitlementIds: string[]) {
  const active = Object.fromEntries(activeEntitlementIds.map((id) => [id, { identifier: id }]));
  return { entitlements: { active } };
}

describe('purchases utility', () => {
  const originalEnv = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

  afterEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_REVENUECAT_API_KEY = originalEnv;
  });

  it('reports unconfigured when no API key env var is set, without importing react-native-purchases having thrown', () => {
    // isPurchasesConfigured is read once at module load from process.env,
    // matching api/config.ts's USE_MOCK_API pattern -- verified via a fresh
    // module registry since the env var can't change after this file's
    // first import.
    jest.isolateModules(() => {
      delete process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const purchases = require('./purchases');
      expect(purchases.isPurchasesConfigured).toBe(false);
    });
  });

  it('reports configured when the API key env var is set', () => {
    jest.isolateModules(() => {
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY = 'test-key';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const purchases = require('./purchases');
      expect(purchases.isPurchasesConfigured).toBe(true);
    });
  });

  it('configures the SDK exactly once even across repeated calls', () => {
    jest.isolateModules(() => {
      process.env.EXPO_PUBLIC_REVENUECAT_API_KEY = 'test-key';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const purchases = require('./purchases');
      purchases.ensurePurchasesConfigured();
      purchases.ensurePurchasesConfigured();
      expect(mockConfigure).toHaveBeenCalledTimes(1);
      expect(mockConfigure).toHaveBeenCalledWith({ apiKey: 'test-key' });
    });
  });

  it('does not call configure when no API key is set', () => {
    jest.isolateModules(() => {
      delete process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const purchases = require('./purchases');
      purchases.ensurePurchasesConfigured();
      expect(mockConfigure).not.toHaveBeenCalled();
    });
  });

  it('reads weekly and monthly packages off the current offering', async () => {
    const weekly = { identifier: 'weekly-pkg' };
    const monthly = { identifier: 'monthly-pkg' };
    mockGetOfferings.mockResolvedValue({ current: { weekly, monthly } });

    const { getSubscriptionPackages } = require('./purchases');
    const result = await getSubscriptionPackages();

    expect(result).toEqual({ weekly, monthly });
  });

  it('returns null packages when there is no current offering', async () => {
    mockGetOfferings.mockResolvedValue({ current: null });

    const { getSubscriptionPackages } = require('./purchases');
    const result = await getSubscriptionPackages();

    expect(result).toEqual({ weekly: null, monthly: null });
  });

  it('hasActiveEntitlement is true when the piercer_pro_access entitlement is active', () => {
    const { hasActiveEntitlement } = require('./purchases');
    expect(hasActiveEntitlement(customerInfoWith(['piercer_pro_access']))).toBe(true);
  });

  it('hasActiveEntitlement is false when no matching entitlement is active', () => {
    const { hasActiveEntitlement } = require('./purchases');
    expect(hasActiveEntitlement(customerInfoWith([]))).toBe(false);
    expect(hasActiveEntitlement(customerInfoWith(['some_other_entitlement']))).toBe(false);
  });

  it('purchasePackage resolves with the customer info on success', async () => {
    const customerInfo = customerInfoWith(['piercer_pro_access']);
    mockPurchasePackage.mockResolvedValue({ customerInfo });

    const { purchasePackage } = require('./purchases');
    await expect(purchasePackage({ identifier: 'weekly-pkg' })).resolves.toBe(customerInfo);
  });

  it('purchasePackage throws PurchaseCancelledError when the user backs out', async () => {
    mockPurchasePackage.mockRejectedValue({ code: 'PURCHASE_CANCELLED_ERROR' });

    const { purchasePackage, PurchaseCancelledError } = require('./purchases');
    await expect(purchasePackage({ identifier: 'weekly-pkg' })).rejects.toBeInstanceOf(PurchaseCancelledError);
  });

  it('purchasePackage rethrows any other error unchanged', async () => {
    const originalError = new Error('billing unavailable');
    mockPurchasePackage.mockRejectedValue(originalError);

    const { purchasePackage } = require('./purchases');
    await expect(purchasePackage({ identifier: 'weekly-pkg' })).rejects.toBe(originalError);
  });

  it('restorePurchases resolves with the customer info', async () => {
    const customerInfo = customerInfoWith(['piercer_pro_access']);
    mockRestorePurchases.mockResolvedValue(customerInfo);

    const { restorePurchases } = require('./purchases');
    await expect(restorePurchases()).resolves.toBe(customerInfo);
  });
});
