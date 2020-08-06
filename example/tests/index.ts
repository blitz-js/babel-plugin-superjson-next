import { Selector } from 'testcafe';

fixture`Index`.page`http://localhost:3000/`;

test('Index', async (t) => {
  const result = Selector('#__next');
  await t.expect(result.value).eql('props.date is Date: true');
});
