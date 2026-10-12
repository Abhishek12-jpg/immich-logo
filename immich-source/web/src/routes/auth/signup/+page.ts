import { getFormatter } from '$lib/utils/i18n';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
  await parent();
  const $t = await getFormatter();

  return {
    meta: {
      title: $t('sign_up'),
    },
  };
}) satisfies PageLoad;