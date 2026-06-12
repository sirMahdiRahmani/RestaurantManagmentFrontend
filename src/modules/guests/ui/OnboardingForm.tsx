import { useState } from 'react'
import { Button, Card, Field, Input } from '../../../shared/ui'
import { useCreateGuest } from '../application/useGuests'
import styles from './OnboardingForm.module.css'

interface OnboardingFormProps {
  onSuccess?: () => void
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  const createGuest = useCreateGuest()

  function validate() {
    const e: typeof errors = {}
    if (!name.trim()) e.name = 'Please enter your name'
    if (!phone.trim()) e.phone = 'Please enter your phone number'
    else if (!/^\+?\d[\d\s\-]{6,}$/.test(phone.trim())) e.phone = 'Enter a valid phone number'
    if (!consent) e.consent = 'You must agree to receive messages'
    return e
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    try {
      await createGuest.mutateAsync({ name: name.trim(), phone: phone.trim() })
      setSubmitted(true)
      onSuccess?.()
    } catch (err) {
      setErrors({ phone: err instanceof Error ? err.message : 'Registration failed' })
    }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <Card>
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Welcome, {name}!</h2>
            <p className={styles.successText}>You are now enrolled in our loyalty programme.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Card>
        <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className={styles.form}>
          <div className={styles.brandHeader}>
            <h1 className={styles.brandName}>Saffron House</h1>
            <p className={styles.brandTagline}>Join our loyalty programme</p>
          </div>

          <Field label="Your name" error={errors.name}>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              placeholder="Full name"
              autoComplete="name"
            />
          </Field>

          <Field label="Phone number" error={errors.phone}>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value) }}
              placeholder="+98 912 …"
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>

          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => { setConsent(e.target.checked) }}
              className={styles.consentCheck}
            />
            <span>I agree to receive loyalty updates and promotions via SMS</span>
          </label>
          {errors.consent ? <p className={styles.fieldError}>{errors.consent}</p> : null}

          <Button
            type="submit"
            variant="primary"
            disabled={createGuest.isPending}
            style={{ inline_size: '100%' } as React.CSSProperties}
          >
            {createGuest.isPending ? 'Registering…' : 'Join now'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
