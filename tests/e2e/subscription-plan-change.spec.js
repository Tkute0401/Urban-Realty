const { test, expect } = require('@playwright/test');

// Focused API test for subscribe and plan change flow
// Uses backend mock plans if DB is disconnected

test.describe('Subscriptions: subscribe and plan change', () => {
  const apiURL = 'http://localhost:3001';
  const user = {
    name: `Sub User ${Date.now()}`,
    email: `sub_${Date.now()}@example.com`,
    password: 'password123',
  };

  let token;
  let plans;

  test('register and fetch plans', async ({ request }) => {
    const reg = await request.post(`${apiURL}/api/v1/auth/register`, { data: user });
    expect(reg.ok()).toBeTruthy();
    const regData = await reg.json();
    expect(regData.token).toBeTruthy();
    token = regData.token;

    const resp = await request.get(`${apiURL}/api/v1/subscriptions`);
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.success).toBe(true);
    plans = data.data;
    expect(Array.isArray(plans) && plans.length > 0).toBeTruthy();
  });

  test('subscribe to basic plan, then change to premium', async ({ request }) => {
    // pick plans by type if present, else fallback to first two
    const basic = plans.find(p => p.type === 'basic') || plans[0];
    const premium = plans.find(p => p.type === 'premium') || plans[1] || plans[0];

    // subscribe
    const subResp = await request.post(`${apiURL}/api/v1/subscriptions/subscribe`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        subscriptionId: basic._id,
        billingCycle: 'monthly',
        paymentMethod: 'card'
      }
    });
    expect(subResp.ok()).toBeTruthy();
    const subData = await subResp.json();
    expect(subData.success).toBe(true);

    // verify current
    const current = await request.get(`${apiURL}/api/v1/subscriptions/my-subscription`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(current.ok()).toBeTruthy();
    const currentData = await current.json();
    expect(currentData.success).toBe(true);

    // change plan (backend cancels existing and creates new pending)
    const changeResp = await request.post(`${apiURL}/api/v1/subscriptions/subscribe`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        subscriptionId: premium._id,
        billingCycle: 'monthly',
        paymentMethod: 'card'
      }
    });
    expect(changeResp.ok()).toBeTruthy();
    const changeData = await changeResp.json();
    expect(changeData.success).toBe(true);
  });
});