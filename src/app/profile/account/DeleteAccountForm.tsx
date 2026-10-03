"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "@/app/actions/account";
import { Button } from "@/components/ui/button";

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, {});

  return (
    <form action={formAction} className="w-full space-y-3 sm:w-auto sm:min-w-64">
      <label htmlFor="delete-account-confirmation" className="sr-only">
        Type DELETE to confirm
      </label>
      <input
        id="delete-account-confirmation"
        name="confirmation"
        type="text"
        autoComplete="off"
        required
        pattern="DELETE"
        placeholder="Type DELETE to confirm"
        aria-describedby={state.error ? "delete-account-error" : undefined}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button
        variant="destructive"
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Deleting Account..." : "Permanently Delete Account"}
      </Button>
      {state.error && (
        <p id="delete-account-error" role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
