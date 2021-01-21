import { Selector } from 'testcafe';

fixture`gSP Arrow`.page`http://localhost:3099/gsp-arrow`;

test('Date is preserved', async (t) => {
  const result = Selector('#__next');
  await t.expect(result.innerText).eql('props.today is Date: true');
});
