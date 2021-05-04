import { Selector } from 'testcafe';

fixture`Excluded Props`.page`http://localhost:3099/excluded-props`;

test('works', async (t) => {
  const result = Selector('#__next');
  await t
    .expect(result.innerText)
    .eql('props.superJsonSkipped is string: true');
});
