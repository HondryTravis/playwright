/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { HeaderView } from './headerView';

test.use({ viewport: { width: 720, height: 200 } });

test('should render counters', async ({ mount }) => {
  const component = await mount(<HeaderView stats={{
    total: 100,
    expected: 42,
    unexpected: 31,
    flaky: 17,
    skipped: 10,
    ok: false,
    duration: 100000
  }} filterText='' setFilterText={() => {}}></HeaderView>);
  await expect(component.get('a', { hasText: 'All' }).get('.counter')).toHaveText('100');
  await expect(component.get('a', { hasText: 'Passed' }).get('.counter')).toHaveText('42');
  await expect(component.get('a', { hasText: 'Failed' }).get('.counter')).toHaveText('31');
  await expect(component.get('a', { hasText: 'Flaky' }).get('.counter')).toHaveText('17');
  await expect(component.get('a', { hasText: 'Skipped' }).get('.counter')).toHaveText('10');
});

test('should toggle filters', async ({ page, mount: mount }) => {
  const filters: string[] = [];
  const component = await mount(<HeaderView
    stats={{
      total: 100,
      expected: 42,
      unexpected: 31,
      flaky: 17,
      skipped: 10,
      ok: false,
      duration: 100000
    }}
    filterText=''
    setFilterText={(filterText: string) => filters.push(filterText)}>
  </HeaderView>);
  await component.get('a', { hasText: 'All' }).click();
  await component.get('a', { hasText: 'Passed' }).click();
  await expect(page).toHaveURL(/#\?q=s:passed/);
  await component.get('a', { hasText: 'Failed' }).click();
  await expect(page).toHaveURL(/#\?q=s:failed/);
  await component.get('a', { hasText: 'Flaky' }).click();
  await expect(page).toHaveURL(/#\?q=s:flaky/);
  await component.get('a', { hasText: 'Skipped' }).click();
  await expect(page).toHaveURL(/#\?q=s:skipped/);
  expect(filters).toEqual(['', 's:passed', 's:failed', 's:flaky', 's:skipped']);
});
