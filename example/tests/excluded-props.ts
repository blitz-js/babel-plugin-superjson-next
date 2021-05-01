import { Selector } from 'testcafe';

fixture`With Static Methods`.page`http://localhost:3099/excluded-props`;

test('Static methods are preserved', async (t) => {
  const result = Selector('#__next');
  await t
    .expect(result.innerText)
    .eql('props.superJsonSkipped is string: true');
});
