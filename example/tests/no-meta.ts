import { Selector } from 'testcafe';

fixture`No meta`.page`http://localhost:3000/no-meta`;

test('Raw object is built', async (t) => {
  const result = Selector('#__next');
  await t.expect(result.innerText).eql('props.rawField is String: test');
});
