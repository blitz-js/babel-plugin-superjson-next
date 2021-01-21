import { Selector } from 'testcafe';

fixture`With Static Methods`.page`http://localhost:3099/with-static-methods`;

test('Static methods are preserved', async (t) => {
  const result = Selector('#__next');
  await t
    .expect(result.innerText)
    .eql('This is part of the static method props.date is Date: true');
});
