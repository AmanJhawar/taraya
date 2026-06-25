'use client'

import { Suspense } from 'react'
import { Controller } from 'react-hook-form'
import { useInquiryForm } from '@/hooks/use-inquiry-form'
import { Button, SelectField, TextField, TextareaField } from '@/components/ui'

function ContactForm() {
  const { form, success, error, onSubmit } = useInquiryForm()
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = form

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <Controller
          name="inquiryType"
          control={control}
          render={({ field }) => (
            <SelectField
              id="inquiryType"
              name="inquiryType"
              label="Inquiry Type"
              value={field.value}
              onChange={field.onChange}
              error={errors.inquiryType?.message}
              options={[
                { value: "general", label: "General Inquiry" },
                { value: "support", label: "Order Support" },
                { value: "corporate", label: "Corporate Gifting" },
                { value: "bullion", label: "Wholesale & Bullion" },
                { value: "press", label: "Press & Media" }
              ]}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TextField
          id="firstName"
          label="First Name"
          required
          placeholder="e.g., Jane"
          error={errors.firstName?.message}
          {...register('firstName')}
        />

        <TextField
          id="middleName"
          label="Middle Name"
          placeholder="e.g., A."
          error={errors.middleName?.message}
          {...register('middleName')}
        />

        <TextField
          id="lastName"
          label="Last Name"
          required
          placeholder="e.g., Doe"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex gap-4">
          <div className="w-24 shrink-0">
            <TextField
              id="countryCode"
              label="Code"
              required
              type="tel"
              placeholder="+91"
              error={errors.countryCode?.message}
              {...register('countryCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/[^\d+]/g, '').slice(0, 5);
                }
              })}
            />
          </div>
          <div className="flex-1">
            <TextField
              id="mobile"
              label="Phone Number"
              required
              type="tel"
              placeholder="e.g., 9876543210"
              error={errors.mobile?.message}
              {...register('mobile', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15);
                }
              })}
            />
          </div>
        </div>

        <TextField
          id="email"
          label="Email Address"
          type="email"
          placeholder="e.g., jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextField
          id="company"
          label="Company Name"
          placeholder="e.g., Acme Corp"
          error={errors.company?.message}
          {...register('company')}
        />

        <TextField
          id="gstinPan"
          label="GSTIN / PAN"
          placeholder="e.g., ABCDE1234F"
          error={errors.gstinPan?.message}
          {...register('gstinPan')}
          className="uppercase"
        />
      </div>

      <TextareaField
        id="message"
        label="Message"
        required
        placeholder="How can we help you?"
        error={errors.message?.message}
        {...register('message')}
      />

      {error && <p className="text-ink text-sm font-semibold bg-band border border-line p-4 rounded-lg">{error}</p>}
      {success && (
        <div className="bg-ink text-field text-sm font-medium p-4 rounded-lg flex items-center gap-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Thank you! Your inquiry has been sent.
        </div>
      )}

      <Button 
        type="submit" 
        loading={isSubmitting}
      >
        Send Message
      </Button>
    </form>
  )
}

export default function Contact() {
  return (
    <div className="pt-10 pb-20 min-h-[calc(100vh-160px)]">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-ink mb-6 font-serif">
            Contact Us
          </h1>
          <p className="text-xl font-normal text-muted leading-relaxed max-w-[600px] mx-auto">
            Let&apos;s talk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-xl font-semibold text-ink mb-4">Corporate Gifting</h3>
              <p className="text-lg text-muted leading-relaxed mb-4">Looking for personalized silver frames or bulk orders for your organization? Reach out to our specialized gifting team.</p>
              <div className="text-lg text-muted leading-relaxed">
                <strong className="text-ink">Email:</strong> corporate@taraya.com
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink mb-4">Wholesale & Bullion</h3>
              <p className="text-lg text-muted leading-relaxed mb-4">For B2B pricing, wholesale partnerships, and silver bullion investments.</p>
              <div className="text-lg text-muted leading-relaxed">
                <strong className="text-ink">Email:</strong> bullion@taraya.com
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-ink mb-4">Office Location</h3>
              <div className="text-lg text-muted leading-relaxed">
                <strong className="text-ink">Address:</strong><br />
                A96 Ventures Private Limited<br />
                Kolkata, WB<br />
                India
              </div>
            </div>
          </div>

          <div className="bg-band/50 p-6 md:p-10 rounded-xl border border-line">
            <Suspense fallback={<div className="h-[500px] flex items-center justify-center text-muted">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
