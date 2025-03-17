import { Profile } from '../../..';
import NetworkMocker, { getApiKeyClientProvider } from '../../NetworkMocker';

function getProfile(status) {
  return new NetworkMocker(getApiKeyClientProvider()).use(([mollieClient, networkMocker]) => {
    networkMocker.intercept('GET', '/profiles/pfl_ahe8z8OPut', 200, {
      resource: 'profile',
      id: 'pfl_ahe8z8OPut',
      mode: 'live',
      name: 'My website name',
      website: 'http://www.mywebsite.com',
      email: 'info@mywebsite.com',
      phone: '31123456789',
      categoryCode: 5399,
      status,
      review: {
        status: 'pending',
      },
      createdAt: '2016-01-11T13:03:55+00:00',
      _links: {
        self: {
          href: 'https://api.mollie.com/v2/profiles/pfl_ahe8z8OPut',
          type: 'application/hal+json',
        },
        chargebacks: {
          href: 'https://api.mollie.com/v2/chargebacks?profileId=pfl_ahe8z8OPut',
          type: 'application/hal+json',
        },
        methods: {
          href: 'https://api.mollie.com/v2/methods?profileId=pfl_ahe8z8OPut',
          type: 'application/hal+json',
        },
        payments: {
          href: 'https://api.mollie.com/v2/payments?profileId=pfl_ahe8z8OPut',
          type: 'application/hal+json',
        },
        refunds: {
          href: 'https://api.mollie.com/v2/refunds?profileId=pfl_ahe8z8OPut',
          type: 'application/hal+json',
        },
        checkoutPreviewUrl: {
          href: 'https://www.mollie.com/payscreen/preview/pfl_ahe8z8OPut',
          type: 'text/html',
        },
      },
    }).twice();

    return bluster(mollieClient.profiles.get.bind(mollieClient.profiles))('pfl_ahe8z8OPut');
  });
}

test('profileStatuses', () => {
  return Promise.all(
    ['blocked', 'verified', 'unverified'].map(async status => {
      const profile = await getProfile(status);

      expect(profile.status).toBe(status);
    }),
  );
});
