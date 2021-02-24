import { Selector } from 'testcafe';

fixture`Null`.page`http://localhost:3099/undefined`;

test('Raw object is built', async (t) => {
  const result = Selector('#__next');
  await t.expect(result.innerText).eql('props: {}');
});
