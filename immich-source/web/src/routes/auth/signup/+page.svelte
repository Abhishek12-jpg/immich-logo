<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthPageLayout from '$lib/components/layouts/AuthPageLayout.svelte';
  import { Route } from '$lib/route';
  import { Alert, Button, Field, Input, PasswordInput } from '@immich/ui';
  import { t } from 'svelte-i18n';
  import type { PageData } from './$types';

  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let name = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  const mismatch = $derived(confirmPassword.length > 0 && password !== confirmPassword);
  const valid = $derived(password.length > 0 && password === confirmPassword);

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    if (!valid || loading) {
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? 'Unable to sign up');
      }

      await goto(Route.login());
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unable to sign up';
    } finally {
      loading = false;
    }
  };
</script>

<AuthPageLayout title={data.meta.title}>
  <form onsubmit={onSubmit} method="post" class="flex flex-col gap-4">
    <Field label={$t('email')} required>
      <Input bind:value={email} type="email" autocomplete="email" />
    </Field>

    <Field label={$t('name')} required>
      <Input bind:value={name} type="text" autocomplete="name" />
    </Field>

    <Field label={$t('password')} required>
      <PasswordInput bind:value={password} autocomplete="new-password" />
    </Field>

    <Field label="Confirm password" required>
      <PasswordInput bind:value={confirmPassword} autocomplete="new-password" />
    </Field>

    {#if mismatch}
      <Alert color="danger" title={$t('password_does_not_match')} size="medium" />
    {/if}

    {#if errorMessage}
      <Alert color="danger" title={errorMessage} size="medium" />
    {/if}

    <Button class="mt-4" type="submit" size="giant" shape="round" fullWidth disabled={!valid || loading} {loading}
      >{$t('sign_up')}</Button
    >
  </form>
</AuthPageLayout>