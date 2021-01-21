import { Selector } from 'testcafe';

fixture`Static`.page`http://localhost:3099/static`;

test('Date is preserved', async (t) => {
  const result = Selector('#__next');
  await t.expect(result.innerText).eql('props.date is Date: true');
});
