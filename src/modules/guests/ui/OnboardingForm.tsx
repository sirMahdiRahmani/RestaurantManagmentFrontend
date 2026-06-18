import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Field, Input, Modal } from '../../../shared/ui'
import { useCreateGuest } from '../application/useGuests'

const PHONE_PATTERN = /^\+?[0-9 ()-]{7,}$/

export interface OnboardingFormProps {
  onClose: () => void
}

/** Waiter-assisted or QR self-signup: name + phone, creates a Guest and enrolls loyalty. */
export function OnboardingForm({ onClose }: OnboardingFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const createGuest = useCreateGuest()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!PHONE_PATTERN.test(phone.trim())) {
      setError('Enter a valid phone number.')
      return
    }
    setError(null)
    createGuest.mutate({ name: name.trim(), phone: phone.trim() }, { onSuccess: onClose })
  }

  return (
    <Modal title="New guest" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Full name">
          <Input value={name} onChange={(event) => { setName(event.target.value) }} placeholder="e.g. Jordan Lee" />
        </Field>
        <Field label="Phone number">
          <Input
            type="tel"
            value={phone}
            onChange={(event) => { setPhone(event.target.value) }}
            placeholder="+1 555 0100"
          />
        </Field>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-2)' }}>
          <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked) }} />
          Send SMS updates about offers and visits
        </label>
        {error ? <p style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>{error}</p> : null}
        <Button type="submit" variant="primary" disabled={createGuest.isPending}>
          {createGuest.isPending ? 'Creating…' : 'Get my code'}
        </Button>
      </form>
    </Modal>
  )
}
